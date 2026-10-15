/**
 * math.ts — Pure math/physics utility functions for the portfolio's visual system.
 *
 * These are building blocks for orbital scenes, particle fields, and
 * spring-based interactions.  No React, no DOM imports — pure JS/TS.
 *
 * Reference: MATH_AND_PHYSICS.md in the portfolio design docs.
 */

// ─── Parametric Orbits ────────────────────────────────────────────────────────

/**
 * Returns (x, y) for a point on a circular orbit at angle t.
 *
 *   x(t) = r cos(ωt)
 *   y(t) = r sin(ωt)
 *
 * @param t      — time / elapsed angle (radians or seconds * speed)
 * @param radius — orbit radius
 * @param speed  — angular speed multiplier (default 1)
 */
export function orbitXY(
  t: number,
  radius: number,
  speed = 1
): { x: number; y: number } {
  const angle = t * speed;
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
  };
}

/**
 * Returns (x, y, z) for a point on a 3D helix.
 *
 *   x(t) = r cos(ωt)
 *   y(t) = r sin(ωt)
 *   z(t) = k * t
 */
export function helixXYZ(
  t: number,
  radius: number,
  rise = 1,
  speed = 1
): { x: number; y: number; z: number } {
  const angle = t * speed;
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
    z: rise * t,
  };
}

// ─── Easing ───────────────────────────────────────────────────────────────────

/**
 * Smoothstep: f(t) = 3t² − 2t³ for t ∈ [0, 1].
 * Produces a smooth S-curve that begins and ends with zero slope.
 */
export function smoothStep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/**
 * Linear interpolation between a and b by factor t.
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// ─── Exponential Follow ───────────────────────────────────────────────────────

/**
 * Frame-rate–independent exponential interpolation.
 *
 * Returns a new `current` value moved toward `target` using:
 *   alpha = 1 − exp(−speed * dt)
 *   current = lerp(current, target, alpha)
 *
 * @param current — current value
 * @param target  — target value
 * @param dt      — frame delta in seconds
 * @param speed   — convergence speed (higher = faster, default 5)
 */
export function expFollow(
  current: number,
  target: number,
  dt: number,
  speed = 5
): number {
  const alpha = 1 - Math.exp(-speed * dt);
  return lerp(current, target, alpha);
}

// ─── Particle Attraction / Repulsion ─────────────────────────────────────────

/**
 * Returns a 2D force vector pushing `particle` toward (or away from) `pointer`.
 *
 * Uses a quadratic falloff:  force = strength × clamp(1 − d/range, 0, 1)²
 * so forces vanish smoothly at the interaction boundary.
 *
 * @param particle  — {x, y} position
 * @param pointer   — {x, y} position
 * @param strength  — max force magnitude (default 0.5)
 * @param range     — interaction radius (default 150)
 * @param repel     — if true, force points away from pointer
 */
export function attraction2D(
  particle: { x: number; y: number },
  pointer: { x: number; y: number },
  strength = 0.5,
  range = 150,
  repel = false
): { fx: number; fy: number } {
  const dx = pointer.x - particle.x;
  const dy = pointer.y - particle.y;
  const distSq = dx * dx + dy * dy;

  if (distSq < 0.0001 || distSq > range * range) {
    return { fx: 0, fy: 0 };
  }

  const dist = Math.sqrt(distSq);
  const u = Math.max(0, 1 - dist / range);
  const force = strength * u * u;
  const sign = repel ? -1 : 1;

  return {
    fx: sign * force * (dx / dist),
    fy: sign * force * (dy / dist),
  };
}

// ─── Clamping ─────────────────────────────────────────────────────────────────

/**
 * Clamps `value` to the inclusive range [min, max].
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ─── Wave ─────────────────────────────────────────────────────────────────────

/**
 * 1D wave value: y = A sin(k·x − ω·t + φ)
 *
 * @param x         — spatial position
 * @param t         — time
 * @param amplitude — peak displacement (default 1)
 * @param k         — spatial frequency (default 1)
 * @param omega     — angular frequency (default 1)
 * @param phase     — phase offset (default 0)
 */
export function wave(
  x: number,
  t: number,
  amplitude = 1,
  k = 1,
  omega = 1,
  phase = 0
): number {
  return amplitude * Math.sin(k * x - omega * t + phase);
}

// ─── Pointer normalization ────────────────────────────────────────────────────

/**
 * Maps a client pointer position to a [-1, 1] normalized coordinate
 * relative to the viewport or a bounding box.
 */
export function normalizePointer(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number }
): { nx: number; ny: number } {
  return {
    nx: ((clientX - rect.left) / rect.width) * 2 - 1,
    ny: -((clientY - rect.top) / rect.height) * 2 + 1,
  };
}
