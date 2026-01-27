# UI/UX Design Guidelines - [Nama Project]

**Version**: 1.0
**Date**: 27 Jan 2026
**Status**: Planning

## 1. Design Philosophy

### Core Principles
1. **User-Centric**: Setiap keputusan desain harus mempertimbangkan kebutuhan user
2. **Consistency**: Konsistensi visual dan interaksi di seluruh aplikasi
3. **Accessibility**: Desain yang dapat diakses oleh semua user (WCAG 2.1 Level AA)
4. **Performance**: UI yang cepat dan responsif
5. **Simplicity**: Interface yang clean dan tidak overwhelming

### Design Values
- **Modern & Professional**: Tampilan yang contemporary dan trustworthy
- **Intuitive**: User dapat memahami tanpa perlu tutorial
- **Delightful**: Micro-interactions yang menyenangkan
- **Responsive**: Seamless experience di semua device

## 2. Visual Design System

### Color Palette

#### Primary Colors
```
Primary Blue:
- 50:  #EFF6FF (Background light)
- 100: #DBEAFE (Hover states)
- 500: #3B82F6 (Main brand color)
- 600: #2563EB (Active states)
- 700: #1D4ED8 (Dark variant)
```

#### Secondary Colors
```
Secondary Purple:
- 50:  #FAF5FF
- 500: #A855F7
- 600: #9333EA
```

#### Neutral Colors
```
Gray Scale:
- 50:  #F9FAFB (Background)
- 100: #F3F4F6 (Card background)
- 200: #E5E7EB (Borders)
- 400: #9CA3AF (Placeholder text)
- 600: #4B5563 (Secondary text)
- 900: #111827 (Primary text)
```

#### Semantic Colors
```
Success: #10B981 (Green)
Warning: #F59E0B (Amber)
Error:   #EF4444 (Red)
Info:    #3B82F6 (Blue)
```

### Typography

#### Font Family
```
Primary: 'Inter', system-ui, -apple-system, sans-serif
Monospace: 'JetBrains Mono', 'Fira Code', monospace
```

#### Font Sizes & Line Heights
```
Display:
- 4xl: 56px / 64px (Hero headings)
- 3xl: 48px / 56px (Page titles)
- 2xl: 36px / 44px (Section headings)

Heading:
- xl:  24px / 32px (Card titles)
- lg:  20px / 28px (Subsections)
- md:  18px / 26px (Small headings)

Body:
- base: 16px / 24px (Default text)
- sm:   14px / 20px (Secondary text)
- xs:   12px / 16px (Captions, labels)
```

#### Font Weights
```
Regular:  400 (Body text)
Medium:   500 (Emphasis)
Semibold: 600 (Headings)
Bold:     700 (Strong emphasis)
```

### Spacing System

#### Base Unit: 4px
```
0:   0px
1:   4px
2:   8px
3:   12px
4:   16px
5:   20px
6:   24px
8:   32px
10:  40px
12:  48px
16:  64px
20:  80px
24:  96px
```

#### Common Patterns
```
Component padding:     16px (p-4)
Card padding:          24px (p-6)
Section padding:       48px (py-12)
Container max-width:   1280px
Content max-width:     768px
```

### Border Radius
```
sm:   4px  (Buttons, inputs)
md:   8px  (Cards, modals)
lg:   12px (Large cards)
xl:   16px (Hero sections)
full: 9999px (Pills, avatars)
```

### Shadows
```
sm:   0 1px 2px rgba(0,0,0,0.05)
md:   0 4px 6px rgba(0,0,0,0.07)
lg:   0 10px 15px rgba(0,0,0,0.1)
xl:   0 20px 25px rgba(0,0,0,0.15)
```

## 3. Component Design Standards

### Buttons

#### Primary Button
```
Style:
- Background: Primary-500
- Text: White
- Padding: 12px 24px
- Border-radius: 8px
- Font-weight: 600

States:
- Hover: Primary-600 + shadow-md
- Active: Primary-700
- Disabled: Gray-300 + opacity-50
- Loading: Spinner + disabled state
```

#### Secondary Button
```
Style:
- Background: Transparent
- Border: 2px solid Primary-500
- Text: Primary-600
- Padding: 10px 22px (account for border)

States:
- Hover: Background Primary-50
- Active: Background Primary-100
```

#### Ghost Button
```
Style:
- Background: Transparent
- Text: Gray-700
- Padding: 12px 24px

States:
- Hover: Background Gray-100
```

### Input Fields

#### Text Input
```
Style:
- Height: 44px (touch-friendly)
- Padding: 12px 16px
- Border: 1px solid Gray-300
- Border-radius: 8px
- Font-size: 16px (prevent zoom on mobile)

States:
- Focus: Border Primary-500 + ring-2 Primary-100
- Error: Border Error + ring-2 Error-100
- Disabled: Background Gray-100 + opacity-60
```

#### Label
```
Style:
- Font-size: 14px
- Font-weight: 500
- Color: Gray-700
- Margin-bottom: 8px
```

### Cards

#### Standard Card
```
Style:
- Background: White
- Border: 1px solid Gray-200
- Border-radius: 12px
- Padding: 24px
- Shadow: shadow-sm

Hover State:
- Shadow: shadow-md
- Transform: translateY(-2px)
- Transition: 200ms ease
```

### Navigation

#### Header
```
Height: 64px
Background: White
Border-bottom: 1px solid Gray-200
Shadow: shadow-sm (on scroll)
Sticky: top-0
Z-index: 50
```

#### Sidebar (Dashboard)
```
Width: 256px (desktop)
Background: Gray-50
Border-right: 1px solid Gray-200
```

## 4. Layout Patterns

### Grid System
```
Container:
- Max-width: 1280px
- Padding: 16px (mobile), 24px (tablet), 32px (desktop)
- Margin: 0 auto

Grid:
- Columns: 12
- Gap: 24px
- Responsive breakpoints
```

### Breakpoints
```
sm:  640px  (Mobile landscape)
md:  768px  (Tablet)
lg:  1024px (Desktop)
xl:  1280px (Large desktop)
2xl: 1536px (Extra large)
```

### Common Layouts

#### Landing Page
```
1. Hero Section (Full viewport height)
2. Features Grid (3 columns on desktop)
3. How It Works (Timeline/Steps)
4. Testimonials (Carousel)
5. CTA Section
6. Footer
```

#### Dashboard Layout
```
┌─────────────────────────────────┐
│         Header (64px)           │
├──────┬──────────────────────────┤
│      │                          │
│ Side │    Main Content          │
│ bar  │    (Scrollable)          │
│      │                          │
│256px │                          │
└──────┴──────────────────────────┘
```

## 5. Animation & Transitions

### Timing Functions
```
Ease-out: cubic-bezier(0, 0, 0.2, 1)  // Default
Ease-in:  cubic-bezier(0.4, 0, 1, 1)  // Exit
Ease:     cubic-bezier(0.4, 0, 0.2, 1) // Both
```

### Duration
```
Fast:     150ms (Hover states)
Normal:   200ms (Default)
Slow:     300ms (Page transitions)
Slower:   500ms (Complex animations)
```

### Common Animations

#### Fade In
```
From: opacity-0
To:   opacity-100
Duration: 200ms
```

#### Slide Up
```
From: translateY(20px) + opacity-0
To:   translateY(0) + opacity-100
Duration: 300ms
```

#### Scale
```
From: scale(0.95) + opacity-0
To:   scale(1) + opacity-100
Duration: 200ms
```

## 6. Iconography

### Icon Library
**Recommended**: Heroicons, Lucide Icons, atau Feather Icons

### Icon Sizes
```
xs:  16px (Inline with text)
sm:  20px (Buttons)
md:  24px (Default)
lg:  32px (Feature highlights)
xl:  48px (Hero sections)
```

### Icon Usage
- Always use consistent icon set
- Maintain 1.5px stroke width
- Use semantic colors
- Add aria-labels for accessibility

## 7. Responsive Design

### Mobile First Approach
1. Design untuk mobile terlebih dahulu
2. Progressive enhancement untuk tablet & desktop
3. Touch-friendly targets (minimum 44x44px)

### Responsive Patterns

#### Navigation
```
Mobile:  Hamburger menu
Tablet:  Collapsed sidebar
Desktop: Full sidebar
```

#### Grid
```
Mobile:  1 column
Tablet:  2 columns
Desktop: 3-4 columns
```

#### Typography
```
Mobile:  Smaller font sizes
Desktop: Larger, more spacious
```

## 8. Accessibility (A11y)

### Color Contrast
- Text: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: Clear focus states

### Keyboard Navigation
- All interactive elements accessible via Tab
- Logical tab order
- Visible focus indicators
- Escape key closes modals

### Screen Readers
- Semantic HTML (header, nav, main, footer)
- ARIA labels where needed
- Alt text for images
- Skip to content link

### Forms
- Clear labels for all inputs
- Error messages associated with fields
- Success/error feedback
- Validation on submit

## 9. Performance Guidelines

### Image Optimization
- Use WebP format with fallback
- Lazy loading for below-fold images
- Responsive images (srcset)
- Maximum file size: 200KB

### Loading States
- Skeleton screens for content
- Spinners for actions
- Progress bars for uploads
- Optimistic UI updates

### Code Splitting
- Route-based code splitting
- Lazy load heavy components
- Defer non-critical CSS

## 10. Design Checklist

### Before Development
- [ ] Wireframes completed
- [ ] High-fidelity mockups approved
- [ ] Design system documented
- [ ] Component library defined
- [ ] Responsive breakpoints planned
- [ ] Accessibility audit done

### During Development
- [ ] Design tokens implemented
- [ ] Components match mockups
- [ ] Responsive behavior tested
- [ ] Animations smooth (60fps)
- [ ] Loading states implemented
- [ ] Error states handled

### Before Launch
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Accessibility testing
- [ ] Performance audit (Lighthouse)
- [ ] User testing feedback
- [ ] Final design review

## 11. Tools & Resources

### Design Tools
- **Figma**: Primary design tool
- **Coolors**: Color palette generator
- **Type Scale**: Typography calculator
- **Contrast Checker**: WCAG compliance

### Development Tools
- **Tailwind CSS**: Utility-first CSS
- **Framer Motion**: Animation library
- **React Icons**: Icon components
- **Storybook**: Component documentation

### Inspiration
- **Dribbble**: UI inspiration
- **Behance**: Design portfolios
- **Awwwards**: Award-winning sites
- **Mobbin**: Mobile app patterns

---

**Note**: Dokumen ini adalah living document yang akan di-update seiring perkembangan project.
