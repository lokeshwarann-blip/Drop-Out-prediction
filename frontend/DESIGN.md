---
name: Clinical Analytics System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#5c5f61'
  on-secondary: '#ffffff'
  secondary-container: '#e0e3e5'
  on-secondary-container: '#626567'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#00174b'
  on-tertiary-container: '#497cff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#e0e3e5'
  secondary-fixed-dim: '#c4c7c9'
  on-secondary-fixed: '#191c1e'
  on-secondary-fixed-variant: '#444749'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#b4c5ff'
  on-tertiary-fixed: '#00174b'
  on-tertiary-fixed-variant: '#003ea8'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  h1:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Space Grotesk
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
  metric-display:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: -0.05em
  data-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
  h1-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 32px
  gutter: 24px
  section-gap: 48px
  dossier-inset: 24px
---

## Brand & Style
The design system bridges the gap between high-stakes institutional reporting and modern software precision. It adopts an **"Institutional Case File"** aesthetic—functional, authoritative, and organized—filtered through a **Modern Minimalist** lens inspired by high-performance developer tools.

The target audience consists of academic advisors and clinical directors who require immediate cognitive clarity. The UI should evoke a sense of **objective calm, absolute precision, and high-trust accountability**. Every element must feel like a deliberate entry in a permanent record, utilizing generous white space and rhythmic alignment to prevent information density from becoming overwhelming.

## Colors
This design system utilizes a high-contrast, professional palette designed for long-duration focused work. 

- **Primary (Deep Slate):** Used for primary text, navigation backgrounds, and structural anchors.
- **Background (Soft Slate):** A neutral, off-white base that reduces eye strain compared to pure white.
- **Accent (Blue):** Reserved for actions, focus states, and progress indicators.
- **Semantic Risk Colors:** These are the only vibrant elements in the UI, used sparingly to draw attention to student performance indicators (High, Medium, and Low risk).

## Typography
The typographic hierarchy is a "three-voice" system:
1. **The Anchor (Space Grotesk):** Used for titles and headers to provide a structural, architectural feel.
2. **The Narrative (Inter):** Used for all descriptive text, student notes, and general UI labels to ensure maximum legibility.
3. **The Readout (JetBrains Mono):** Used for numerical data, IDs, timestamps, and performance metrics to signal precision and technical accuracy.

All headings should use a tight letter-spacing. Data labels should always be presented in uppercase to mimic official filing systems.

## Layout & Spacing
The layout follows an **Asymmetric Fixed Grid** model. Content is organized into a primary wide column for "Case Details" and a narrower sidebar for "Summary Statistics" or "Risk Factors."

- **The Dossier Effect:** Information is grouped into large, white "sheets" (cards) that sit on the light slate background.
- **Hierarchy through Negative Space:** Avoid using heavy lines to separate sections. Use large vertical gaps (48px+) to distinguish between different logical modules.
- **Rhythm:** All spacing must be a multiple of 4px. Use a 12-column grid for the main stage, with a 3-column offset for supplemental data.

## Elevation & Depth
In line with the "Case File" narrative, depth is achieved through **Tonal Layering** rather than traditional shadows.

- **Level 0 (Base):** Background (#F8FAFC).
- **Level 1 (Dossier Sheets):** Pure White (#FFFFFF) surfaces with a subtle, 1px border in #E2E8F0. No shadow.
- **Level 2 (Popovers/Modals):** Pure White with a sharp, high-diffusion shadow (0px 10px 30px rgba(15, 23, 42, 0.08)) to indicate temporary interaction.
- **Interactions:** Hover states on interactive cards should result in a slight background tint shift (#F1F5F9) rather than a lift or "float" effect.

## Shapes
The shape language is "Soft" but disciplined. 
- Elements use a **4px radius (0.25rem)** to maintain a crisp, professional appearance that doesn't feel overly playful or "bubbly."
- Buttons and input fields share this 4px radius.
- **Risk Indicators:** Use sharp vertical bars (0px radius) on the left edge of cards to provide a "clinical" edge to the data visualization.

## Components

### The Dossier Card
The signature component of this design system. It is a white surface with:
- A 4px vertical "Risk Bar" on the far left edge (High/Med/Low color).
- A header area using **Space Grotesk** Bold.
- A "Readout" section at the bottom using **JetBrains Mono** for metrics.

### Buttons
- **Primary:** Deep Slate (#0F172A) background, white text, 4px radius.
- **Secondary:** Transparent background, 1px border (#E2E8F0), slate text.
- **Clinical Action:** Blue (#2563EB) background, used only for critical path "Intervention" actions.

### Metrics & Readouts
All numerical data should be displayed in **JetBrains Mono**. Use small "Data Labels" (12px uppercase) above the metric to identify the data point.

### Risk Chips
Small, rectangular tags with light background tints and saturated text of the risk color (e.g., Light Red background with High Risk Red text). No rounded corners (0px) to keep them looking like stamped labels.

### Input Fields
Strictly rectangular (4px radius) with 1px light slate borders. Focus state is a 2px Blue (#2563EB) border. Label typography is Inter Medium 14px.