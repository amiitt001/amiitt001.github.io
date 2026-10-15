# Physics-Inspired Portfolio Design Specification

**Project:** Amit Verma — Personal Portfolio  
**Live site:** https://amiitt.vercel.app/  
**Stack:** React + Vite  
**Design direction:** Futuristic 3D, mathematical, physics-inspired  
**Animation intensity:** High, with performance and accessibility safeguards  
**Primary colors:** Cream `#FAF8F3`, forest green `#2D4F3A`

---

## 1. Product Vision

Transform the portfolio into an immersive scientific universe where mathematics defines the geometry, physics defines movement, and interaction makes the experience feel alive.

The site should communicate that Amit is an engineering student and developer building AI-powered products, full-stack applications, and useful software. Visual effects should support that story—not compete with the content or obscure project details.

### Design principles

1. **Scientific, not generic cyberpunk:** use warm cream, deep green, glass-like materials, fine technical lines, orbital paths, and restrained glow.
2. **Interactive with purpose:** motion responds to pointer movement, scrolling, hover, and clicks.
3. **Content remains primary:** name, skills, projects, contact details, and calls to action must remain readable and accessible.
4. **Progressive enhancement:** the portfolio must still work if WebGL or advanced motion is unavailable.
5. **Responsive by design:** simplify 3D scenes and particle counts on mobile.
6. **Honest project presentation:** only show real repositories, demos, metrics, and status claims.

---

## 2. Visual Identity

### Color palette

| Token | Hex | Usage |
|---|---|---|
| `--cream` | `#FAF8F3` | Main page background |
| `--green` | `#2D4F3A` | Primary brand color, buttons, dark panels |
| `--sage` | `#556B4E` | Secondary accents, labels, lines |
| `--glow` | `#A6B69A` | Orbital highlights, soft lighting |
| `--ink` | `#1F3025` | Main text |
| `--muted` | `#667166` | Secondary text |
| `--line` | `#D7DDD3` | Borders and separators |
| `--critical` | `#A34B3C` | Rare emphasis only |

### Typography

- Use an expressive editorial display face for large headings.
- Use a highly readable sans-serif for body copy and UI.
- Use monospace for technical labels, small metadata, coordinates, and section indexes.
- Keep body text comfortably readable; do not use tiny labels as the only way to understand a feature.

### Shape and material language

- Rounded cards and pill-shaped actions, used consistently.
- Thin orbit lines, geometric grids, translucent surfaces, and controlled highlights.
- Use shadows sparingly; create depth primarily through lighting, overlap, perspective, and motion.
- Avoid excessive neon, too many gradients, and decorative effects that make the site feel like a template.

---

## 3. Information Architecture

Recommended page order:

1. Navigation
2. Hero — “Hi, I’m Amit” / “Building intelligent experiences”
3. About — engineering mindset and interests
4. Skills — interactive technology network plus accessible text list
5. Selected Projects — cards with descriptions, stack, repository, and live demo
6. Experience and Achievements — verified internships, leadership, hackathons, milestones
7. Contact — email, GitHub, LinkedIn, and resume
8. Footer

Retain working sections, SEO metadata, links, and existing site functionality during implementation. Audit the current codebase before replacing files.

---

## 4. Section Design and Mathematical Models

### 4.1 Navigation

**Look:** clean cream header, forest-green typography, understated border, clear active section.

**Interactions:**
- Smooth anchor navigation.
- Small active-section indicator.
- Optional subtle magnetic response on desktop pointer devices.
- Mobile menu must work by keyboard and touch.

**Math:** interpolation/easing for indicator movement; avoid animating layout dimensions when transforms will work.

### 4.2 Hero — Personal Universe

**Look:** large editorial heading on the left; interactive 3D orbital object on the right. The central sphere represents the creator’s work, while smaller satellites represent AI, software, and cloud technologies.

**Interactions:**
- Slow continuous rotation.
- Orbital satellites and rings.
- Gentle pointer-driven parallax.
- Clear “Explore Projects” and “Contact” calls to action.
- Scroll cue and small technical labels.

**Mathematics: parametric equations**

For a circular orbit:

```text
x(t) = r cos(t)
y(t) = r sin(t)
```

For a 3D helix:

```text
x(t) = r cos(t)
y(t) = r sin(t)
z(t) = k t
```

Use these to generate orbital paths and spiral trails. Orbit motion is a visual metaphor, not a physically accurate planetary simulation.

### 4.3 About — Field of Ideas

**Look:** concise personal introduction, paired with a particle field or layered 3D illustration.

**Interactions:**
- Particles subtly react to pointer position.
- Connections appear only between nearby points.
- Section content reveals with restrained staggered motion.

**Mathematics: vectors and distance**

```text
delta = pointer - particle
distance = length(delta)
```

Use the vector direction and a bounded distance falloff to create attraction or repulsion. Keep the force limited so particles do not accelerate uncontrollably.

### 4.4 Skills — Technology Network

**Look:** categories such as Frontend, Backend, AI/ML, Databases, and Cloud arranged around a central node.

**Interactions:**
- Select a node to highlight related skills.
- Hover or focus reveals a short description.
- Related technologies brighten or connect.
- Provide a standard HTML list as an accessible alternative.

**Mathematics:** vectors, graph relationships, distance calculations, and optionally Voronoi regions for proximity-based interactions.

Voronoi regions assign each point in space to its nearest node. Use them only if the interaction adds value; a simple node graph may be clearer and faster.

### 4.5 Projects — Floating Laboratories

**Look:** project cards with layered screenshots, technical labels, and a strong visual hierarchy.

**Interactions:**
- Cards lift slightly and tilt based on pointer position.
- Use perspective and depth without making text difficult to read.
- Reveal stack tags and links on hover, but keep them visible and usable on touch screens.
- Animate cards into view once as the user scrolls.

**Mathematics:** linear algebra and transformation matrices for rotation, scale, and translation; interpolation for smoothing pointer-driven rotation.

Showcase real projects such as Deadline Guardian AI, SkillSphere, DocuPulse, or other strongest work after verifying their current status and links.

### 4.6 Experience and Achievements

**Look:** timeline with nodes, connecting lines, dates, roles, and concise outcomes.

**Interactions:**
- Nodes and content reveal as they enter the viewport.
- A progress line may follow scroll position.
- Use staggered transitions, not continuous animation.

**Mathematics:** interpolation and easing functions.

A smoothstep easing function is:

```text
f(t) = 3t² - 2t³,  where 0 ≤ t ≤ 1
```

### 4.7 Contact — Convergence Point

**Look:** final central sphere or concentric wave, concise invitation, and direct contact options.

**Interactions:**
- A click creates a subtle ripple.
- Contact panel reveals smoothly.
- Email, GitHub, LinkedIn, and resume links work without requiring an animation to finish.

**Mathematics:** wave functions and easing.

```text
y = A sin(kx - ωt)
```

Use waves as a decorative visual layer, not as the only carrier of information.

---

## 5. Mathematical and Physics Concepts

| Concept | Use in the portfolio | Suggested implementation |
|---|---|---|
| Parametric equations | Orbits, spirals, curved paths | Three.js geometry / React Three Fiber |
| Vector mathematics | Pointer direction, particle movement | `THREE.Vector3` |
| Distance and falloff | Proximity-based highlighting | Vector length and bounded falloff |
| Gravity-inspired attraction | Particles gathering near a pointer or object | Stable visual approximation |
| Spring dynamics and damping | Elastic cards, natural settling | Motion spring transitions or a damped simulation |
| Bézier curves | Animated paths and transitions | SVG paths or Three.js curves |
| Linear algebra | 3D transforms and perspective | Three.js object transforms |
| Wave functions | Ripples and flowing backgrounds | Canvas or shader |
| Voronoi diagrams | Spatial skill regions | Optional computational geometry |
| Fractals / recursion | Generative visual artwork | Optional, only if performance permits |
| Easing and interpolation | Scroll reveals and smooth follow behavior | Motion / GSAP / custom interpolation |

### Example utility functions

```js
import * as THREE from "three";

export function getOrbitPosition(t, radius, speed = 1) {
  const angle = t * speed;
  return new THREE.Vector3(
    radius * Math.cos(angle),
    radius * Math.sin(angle),
    0
  );
}

export function smoothStep(t) {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

export function followTarget(current, target, delta, speed = 5) {
  const alpha = 1 - Math.exp(-speed * delta);
  return current.lerp(target, alpha);
}

export function getAttraction(
  particle,
  pointer,
  strength = 0.5,
  range = 2
) {
  const delta = pointer.clone().sub(particle);
  const distance = delta.length();

  if (distance < 0.001 || distance > range) {
    return new THREE.Vector3(0, 0, 0);
  }

  const falloff = 1 - distance / range;

  return delta
    .normalize()
    .multiplyScalar(strength * falloff * falloff);
}
```

These are building blocks, not a complete physics engine. Use frame delta for time-based motion and clamp force/velocity where necessary.

---

## 6. Motion Direction

### High visual intensity, controlled motion

- Hero: continuous but slow 3D motion.
- About: pointer-reactive particle field, with bounded movement.
- Skills: interactive node selection and highlighted connections.
- Projects: tilt, lift, and reveal animations.
- Experience: one-time scroll reveals.
- Contact: ripple or wave effect on interaction.

Do not animate every section continuously. Reserve the most computationally expensive scene for the hero and use CSS/Motion for most other effects.

### Motion rules

- Prefer `transform` and `opacity` for UI animation.
- Avoid React state updates on every pointer movement or animation frame.
- Use refs and Three.js object mutation for frame-by-frame 3D updates.
- Avoid excessive blur, large transparent particle layers, and high-cost post-processing on mobile.
- Use `prefers-reduced-motion` to reduce or disable nonessential movement.
- Provide a static fallback when WebGL is unavailable.

---

## 7. Recommended Technology Stack

| Technology | Responsibility |
|---|---|
| React + Vite | Existing application foundation |
| Three.js | 3D rendering and geometry |
| React Three Fiber | Declarative Three.js scenes in React |
| Drei | Helpers such as `Float`, controls, and useful scene utilities |
| Motion for React | UI transitions, springs, scroll-triggered reveals |
| GSAP (optional) | Complex timelines and advanced scroll choreography |
| Lucide React | Consistent UI icons |
| CSS | Layout, responsive styling, hover states, reduced-motion behavior |

Avoid adopting both Motion and GSAP for the same small animation. Choose one primary animation system for each task to keep the code maintainable.

### Install packages

First check the existing React version and package manager. React Three Fiber v8 pairs with React 18; v9 pairs with React 19.

```bash
npm install three @react-three/fiber @react-three/drei motion lucide-react
npm install -D @types/three
```

Only add GSAP if the design actually requires its timeline or scroll-control features.

---

## 8. Suggested Project Structure

```text
src/
  components/
    Navbar.jsx
    Hero.jsx
    OrbitalScene.jsx
    ParticleField.jsx
    AboutSection.jsx
    SkillsOrbit.jsx
    ProjectCard.jsx
    ProjectsSection.jsx
    ExperienceTimeline.jsx
    ContactSection.jsx
  hooks/
    useReducedMotionPreference.js
  data/
    projects.js
    skills.js
    experience.js
  utils/
    math.js
  styles/
    tokens.css
    layout.css
    motion.css
  App.jsx
  main.jsx
```

Keep content in data files and the visual system in reusable components. Preserve existing components and routes wherever possible rather than replacing the whole application without an audit.

---

## 9. Responsive and Accessible Behavior

### Desktop
- Full orbital scene and pointer-driven parallax.
- Interactive card tilt and magnetic controls.
- Moderate particle count and smooth transitions.

### Tablet
- Smaller 3D scene and fewer particles.
- Reduce pointer effects and simplify card tilt.
- Maintain clear hierarchy and comfortable touch targets.

### Mobile
- Stack hero text and 3D scene.
- Use a static or lightweight 3D fallback when appropriate.
- Disable magnetic cursor behavior and hover-only information.
- Reduce particle count, pixel ratio, and rendering cost.
- Keep project links, navigation, and skills accessible without gestures.

### Accessibility requirements
- Semantic headings and landmarks.
- Keyboard-operable navigation, cards, menus, and skill controls.
- Visible focus styles.
- Meaningful alternative text for informative images.
- Sufficient contrast for text and controls.
- Respect `prefers-reduced-motion`.
- Do not hide essential content until an animation completes.

---

## 10. Performance, SEO, and Deployment

### Performance
- Lazy-load the 3D scene and heavy dependencies.
- Limit device pixel ratio, especially on mobile.
- Reuse geometries and materials.
- Avoid unnecessary allocations inside `useFrame`.
- Pause or reduce animation when the scene is off-screen where practical.
- Use optimized image assets and avoid loading large models for decorative effects.
- Provide a meaningful fallback if WebGL fails.

### SEO
- Keep primary headings, project descriptions, and links in HTML.
- Retain or improve title, description, canonical URL, Open Graph metadata, sitemap, robots.txt, and Person JSON-LD.
- Do not place important portfolio text only inside a canvas.

### Build and deployment checks

```bash
npm run build
npm run preview
```

Before deploying to Vercel, test:
- Desktop pointer interactions.
- Mobile touch navigation.
- Keyboard-only navigation.
- Reduced-motion mode.
- WebGL fallback behavior.
- All repository, live demo, email, LinkedIn, and resume links.
- Console errors and production build output.

---

## 11. Implementation Roadmap

| Phase | Work | Acceptance criteria |
|---|---|---|
| 1. Audit | Inspect current components, routes, styles, metadata, and links | Existing working functionality is documented and preserved |
| 2. Design system | Add color tokens, typography, spacing, and responsive layout | Visual identity is consistent across sections |
| 3. Hero | Build the orbital scene and responsive hero | Scene renders smoothly and has a useful fallback |
| 4. Content | Refine About, Skills, Projects, Experience, and Contact | All real content and links are present |
| 5. Interactions | Add particles, card tilt, easing, and scroll reveals | Effects respond correctly and do not block content |
| 6. Optimization | Reduce mobile cost and honor reduced motion | Site remains usable without advanced motion |
| 7. QA and deploy | Run build, test routes and links, deploy to Vercel | Production build passes and critical interactions work |

**Indicative effort:** approximately 12–20 hours, depending on the existing codebase, asset preparation, and how sophisticated the 3D scenes become.

---

## 12. Definition of Done

The redesign is ready when:

- [ ] Cream `#FAF8F3` and forest green `#2D4F3A` remain the primary identity.
- [ ] Hero contains a polished, interactive orbital visual.
- [ ] Mathematical effects have clear purpose and are not random decoration.
- [ ] All sections work on mobile and desktop.
- [ ] Project cards show verified details and functional links.
- [ ] Essential information is accessible without WebGL or animation.
- [ ] Reduced-motion preferences are respected.
- [ ] Performance is acceptable on a typical mobile device.
- [ ] SEO metadata and existing working functionality are preserved.
- [ ] `npm run build` succeeds and the deployed site has no critical errors.

## Final Direction

Build one excellent orbital hero first, then carry the same mathematical visual language into project cards, skills, and transitions. The result should feel like a coherent interactive scientific universe—not a collection of unrelated effects.

**Design principle:** Mathematics defines the form. Physics gives it motion. Engineering makes it usable.
