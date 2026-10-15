# Mathematics and Physics Reference

This document defines the mathematical ideas used by the portfolio's visual system. These effects are visual simulations, not claims of exact physical realism.

## 1. Parametric orbits

A circle of radius `r`:

```text
x(t) = r cos(t)
y(t) = r sin(t)
```

A 3D helix:

```text
x(t) = r cos(t)
y(t) = r sin(t)
z(t) = k t
```

Use for orbital paths, satellite motion, and spiral trails. Keep angular speed low in the hero.

## 2. Vectors and pointer distance

Let a particle position be `p` and pointer position be `q`:

```text
delta = q - p
distance = ||delta||
direction = delta / distance
```

Only apply a force inside a finite interaction radius. Handle distance near zero to avoid division by zero.

A smooth falloff:

```text
u = clamp(1 - distance / range, 0, 1)
force = strength * u²
```

This creates a predictable attraction or repulsion without unbounded acceleration.

## 3. Gravity-inspired interaction

Newtonian gravity is:

```text
F = G M m / r²
```

For interface motion, use a capped visual approximation rather than raw inverse-square force near `r = 0`. Clamp the minimum distance and maximum acceleration, or use the bounded falloff above.

## 4. Smoothstep easing

```text
f(t) = 3t² - 2t³, 0 ≤ t ≤ 1
```

This begins and ends with zero slope. Use for simple transitions where acceleration should feel smooth.

## 5. Exponential interpolation

For a value moving toward a target over frame delta `dt`:

```text
alpha = 1 - exp(-speed * dt)
current = lerp(current, target, alpha)
```

This is useful for pointer-following rotations and camera-like motion. Using `dt` makes behavior less dependent on frame rate.

## 6. Spring dynamics

A damped spring can be described as:

```text
m x'' + c x' + k x = 0
```

- `m`: effective mass
- `c`: damping
- `k`: stiffness

Use a spring animation library for UI elements where possible. If implementing a custom simulation, clamp values and test for stability.

## 7. Bézier curves

A quadratic Bézier curve:

```text
B(t) = (1-t)² P0 + 2(1-t)t P1 + t² P2
```

Use for decorative paths between skill nodes or project-card transitions. For most UI transitions, CSS or Motion may be simpler.

## 8. 3D transformations

A point can be transformed by a matrix:

```text
p' = M p
```

Three.js already provides object transforms. Prefer its built-in position, rotation, scale, and quaternion APIs rather than implementing matrix operations unnecessarily.

## 9. Wave functions

```text
y = A sin(kx - ωt + φ)
```

- `A`: amplitude
- `k`: spatial frequency
- `ω`: angular frequency
- `φ`: phase

Use for low-cost decorative waves and click ripples. Keep waves subtle behind text.

## 10. Voronoi regions

Each location belongs to its nearest site:

```text
region(p) = argmin_i distance(p, site_i)
```

Potential use: interactive regions around skill nodes. This is optional; use a straightforward graph if it communicates skill relationships more clearly.

## Implementation cautions

- Normalize vectors only when their length is safe.
- Bound force, speed, rotation, and particle counts.
- Use frame delta for time-based motion.
- Reuse geometries and materials.
- Avoid allocating many temporary objects every frame.
- Make every effect optional and provide a fallback.
- Profile before adding complex shaders, fractals, or post-processing.
