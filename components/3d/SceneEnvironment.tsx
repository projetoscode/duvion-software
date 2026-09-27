'use client';

import { Environment, Lightformer } from '@react-three/drei';

/**
 * Procedural studio environment (no HDR download): colored light panels
 * give the glass/metal materials their cyan → violet reflections.
 */
export default function SceneEnvironment() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={4} color="#4fd8ff" position={[-5, 2, 3]} scale={[4, 8, 1]} />
      <Lightformer form="rect" intensity={5} color="#a855f7" position={[5, 0.5, 2]} scale={[3, 8, 1]} />
      <Lightformer form="ring" intensity={3} color="#ffffff" position={[0, 5, -2]} scale={3} />
      <Lightformer form="rect" intensity={2} color="#2f6bff" position={[0, -4, 4]} scale={[10, 2, 1]} />
      <Lightformer form="rect" intensity={1.5} color="#d946ef" position={[2, 3, -5]} scale={[6, 2, 1]} />
    </Environment>
  );
}
