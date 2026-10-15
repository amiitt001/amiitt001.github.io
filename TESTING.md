# Testing and Quality Checklist

## 1. Build and repository health

- [ ] Install dependencies using the existing package manager.
- [ ] Run the configured lint command, if present.
- [ ] Run type checks/tests, if present.
- [ ] Run `npm run build`.
- [ ] Run `npm run preview`.
- [ ] Check browser console and network errors.
- [ ] Confirm no secrets or private credentials are committed.

## 2. Functional behavior

- [ ] Navigation links reach the correct sections.
- [ ] Mobile menu opens, closes, and reports its state accessibly.
- [ ] Project repository and demo links are correct.
- [ ] Email, LinkedIn, GitHub, and resume links work.
- [ ] Optional links are omitted when their destinations are unavailable.
- [ ] Skill nodes can be selected and reset.
- [ ] Interactive effects do not block links or text selection.

## 3. Responsive layouts

Test at representative widths such as 360px, 390px, 768px, 1024px, and 1440px.

- [ ] No horizontal overflow.
- [ ] Hero heading wraps cleanly.
- [ ] 3D scene has a suitable size and fallback.
- [ ] Project cards remain readable.
- [ ] Touch targets are comfortable to use.
- [ ] Content is not clipped by decorative effects.

## 4. Accessibility

- [ ] Semantic landmarks and heading hierarchy are present.
- [ ] All interactive elements are keyboard reachable.
- [ ] Focus indicators are visible.
- [ ] Text and controls have adequate contrast.
- [ ] Images have appropriate alternative text.
- [ ] No information is available only on hover.
- [ ] Reduced-motion preference is honored.
- [ ] Canvas is decorative where appropriate and does not replace meaningful text.

## 5. Motion and 3D

- [ ] Pointer movement is bounded and smooth.
- [ ] Particle behavior remains stable near the pointer.
- [ ] Frame-rate changes do not materially change animation speed.
- [ ] Animation does not trigger unnecessary React renders.
- [ ] Scene resizes correctly.
- [ ] Scene pauses or reduces work when practical while off-screen.
- [ ] No-WebGL behavior leaves the rest of the site usable.
- [ ] Reduced-motion mode removes nonessential continuous animation.

## 6. Performance

- [ ] 3D dependencies load only where needed.
- [ ] Images are appropriately sized and compressed.
- [ ] Pixel ratio and particle count are limited on mobile.
- [ ] Geometries and materials are reused.
- [ ] No avoidable layout shifts occur.
- [ ] Test on a typical mobile device, not only a powerful development machine.

## 7. SEO and metadata

- [ ] Page title and description are correct.
- [ ] Canonical URL points to the intended production URL.
- [ ] Open Graph and social preview metadata are valid.
- [ ] Sitemap and robots directives are appropriate.
- [ ] Person JSON-LD contains accurate information.
- [ ] Project descriptions and links exist in HTML.

## 8. Release checklist

- [ ] Production build passes.
- [ ] Preview deployment has been tested.
- [ ] No placeholder copy or dummy URLs remain.
- [ ] Existing functionality has not regressed.
- [ ] Known limitations are documented.
- [ ] Production deployment has been smoke-tested.
