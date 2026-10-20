/**
 * Smoke shader — black + electric-blue volumetric smoke.
 *
 * Technique: fBm (fractal Brownian motion) value noise with two levels of domain warping
 * (Inigo Quilez style). Each warp feeds the next, which turns plain noise into slow,
 * curling smoke. The number of octaves comes in as the OCTAVES define, so phones can
 * compile a cheaper version of the same shader.
 *
 * Uniforms
 *  uTime        seconds (already scaled by the caller)
 *  uResolution  canvas size in CSS pixels (only the aspect ratio matters)
 *  uMouse       smoothed pointer, 0..1 in canvas space (y up)
 *  uIntensity   1 = full smoke, 0 = dissipated (driven by scroll)
 *  uDensity     overall thickness (the cheaper low-octave version needs a boost)
 *  uDeep/uBlue/uGlow  palette (deep navy, electric blue, bright cyan highlights)
 *  uFocus       where the smoke is densest, 0..1 (e.g. behind the portrait)
 */

export const smokeVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const smokeFragment = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uIntensity;
uniform float uDensity;
uniform vec3 uBase;
uniform vec3 uDeep;
uniform vec3 uBlue;
uniform vec3 uGlow;
uniform vec2 uFocus;

varying vec2 vUv;

// --- Noise -----------------------------------------------------------------

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

// Smooth value noise.
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Fractal Brownian motion: OCTAVES layers of noise, each finer and fainter, rotated
// between layers so the grid never shows.
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  mat2 rotate = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < OCTAVES; i++) {
    value += amplitude * noise(p);
    p = rotate * p;
    amplitude *= 0.5;
  }
  return value;
}

// --- Smoke -----------------------------------------------------------------

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 2.4;

  float t = uTime * 0.055;
  float fade = clamp(uIntensity, 0.0, 1.0);

  // As it dissipates, the smoke drifts upward and spreads out.
  p.y -= (1.0 - fade) * 1.4;
  p *= 1.0 + (1.0 - fade) * 0.35;

  // Mouse: a gentle swirl around the cursor + a soft lift of light.
  vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0) * 2.4;
  vec2 toMouse = p - m;
  float mouseFalloff = exp(-dot(toMouse, toMouse) * 1.4);
  p += vec2(-toMouse.y, toMouse.x) * mouseFalloff * 0.32;

  // Two levels of domain warping.
  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t * 0.8));
  vec2 r = vec2(
    fbm(p + 3.6 * q + vec2(1.7, 9.2) + t * 1.15),
    fbm(p + 3.6 * q + vec2(8.3, 2.8) - t * 0.9)
  );
  float f = fbm(p + 3.2 * r + vec2(0.0, -t * 1.6));

  // Density: thicker toward the focus point and the bottom of the frame.
  float focus = exp(-dot((uv - uFocus) * vec2(aspect * 0.9, 1.1), (uv - uFocus) * vec2(aspect * 0.9, 1.1)) * 1.6);
  float floorFog = smoothstep(0.85, 0.0, uv.y) * 0.55;
  float density = smoothstep(0.34, 1.05, f * f * 1.7 + 0.28 * length(q)) * (0.4 + focus * 0.75 + floorFog);
  density *= fade * uDensity;

  vec3 color = uBase;
  color = mix(color, uDeep, clamp(density * 0.95, 0.0, 1.0));
  color = mix(color, uBlue, clamp(pow(length(q), 3.0) * density * 0.95, 0.0, 1.0));
  // Bright cyan wisps on the crests of the warped field.
  color += uGlow * pow(clamp(r.x * r.y * 2.2, 0.0, 1.0), 3.0) * density * 1.25;
  color += uGlow * mouseFalloff * 0.08 * fade;

  // Vignette keeps the edges in deep black.
  float vignette = smoothstep(1.1, 0.15, length((uv - vec2(0.5, 0.45)) * vec2(1.2, 1.0)));
  color = mix(uBase, color, mix(0.1, 1.0, vignette));

  // Tiny grain avoids banding in the dark gradients.
  color += (hash(uv * uResolution + fract(uTime)) - 0.5) * 0.012;

  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}
`;
