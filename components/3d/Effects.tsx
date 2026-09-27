'use client';

import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';

/** Desktop-only post-processing: soft bloom for the neon glow + cinematic vignette. */
export default function Effects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.55} luminanceSmoothing={0.3} radius={0.72} />
      <Vignette eskil={false} offset={0.22} darkness={0.7} />
    </EffectComposer>
  );
}
