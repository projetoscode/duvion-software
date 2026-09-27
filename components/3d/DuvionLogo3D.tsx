'use client';

import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { createLogoGeometries, type TierSettings } from '@/lib/three';

interface Props {
  settings: TierSettings;
}

/**
 * Three.js applies vertex colors to the diffuse term only. Multiplying the
 * emissive term by them too makes the mark glow with the brand gradient
 * (cyan → blue → violet → magenta) instead of a single flat color.
 */
function tintEmissiveWithVertexColors(material: THREE.MeshPhysicalMaterial) {
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <emissivemap_fragment>',
      '#include <emissivemap_fragment>\n#ifdef USE_COLOR\n  totalEmissiveRadiance *= vColor.rgb;\n#endif',
    );
  };
  material.customProgramCacheKey = () => 'duvion-emissive-gradient';
}

/**
 * The Duvion "D" mark, extruded procedurally from 2D shapes: an open bowl
 * plus a nested chevron, painted with the brand gradient through vertex colors.
 * High-end devices get real glass transmission; others a cheaper glossy metal.
 */
export default function DuvionLogo3D({ settings }: Props) {
  const { body, chevron } = useMemo(
    () => createLogoGeometries(settings.curveSegments, settings.bevelSegments),
    [settings.curveSegments, settings.bevelSegments],
  );

  const [bodyMaterial, chevronMaterial] = useMemo(() => {
    const shared: THREE.MeshPhysicalMaterialParameters = {
      vertexColors: true,
      metalness: settings.transmission ? 0.15 : 0.35,
      roughness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      iridescence: 0.7,
      iridescenceIOR: 1.35,
      envMapIntensity: 1.8,
      transparent: true,
    };
    const glass: THREE.MeshPhysicalMaterialParameters = settings.transmission
      ? {
          transmission: 0.3,
          thickness: 1.4,
          ior: 1.45,
          attenuationColor: new THREE.Color('#6d4bff'),
          attenuationDistance: 2.5,
        }
      : {};

    const body = new THREE.MeshPhysicalMaterial({ ...shared, ...glass, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 0.32 });
    const chevron = new THREE.MeshPhysicalMaterial({ ...shared, ...glass, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 0.48 });
    [body, chevron].forEach(tintEmissiveWithVertexColors);
    return [body, chevron];
  }, [settings.transmission]);

  useEffect(
    () => () => {
      body.dispose();
      chevron.dispose();
    },
    [body, chevron],
  );

  useEffect(
    () => () => {
      bodyMaterial.dispose();
      chevronMaterial.dispose();
    },
    [bodyMaterial, chevronMaterial],
  );

  return (
    <group>
      <mesh geometry={body} material={bodyMaterial} />
      <mesh geometry={chevron} material={chevronMaterial} position={[-0.04, 0, 0.12]} />
    </group>
  );
}
