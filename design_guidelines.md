# DS Corporation Global RFQ Platform - Design Guidelines

## Design Approach

**Selected Framework**: Material Design 3 (Modern B2B Variant)
**Rationale**: This B2B platform prioritizes trust, efficiency, and data clarity. Material Design provides robust form controls, professional aesthetics, and proven patterns for complex workflows - perfect for international business transactions.

**Core Principles**:
- Professional credibility over visual flair
- Information clarity and workflow efficiency
- International accessibility and trust signals
- Mobile-responsive business functionality

---

## Color Palette

### Primary Colors (Trust & Professionalism)
**Light Mode**:
- Primary Blue: `214 88% 45%` - Main actions, headers, links
- Primary Light: `214 95% 92%` - Backgrounds, subtle highlights
- Primary Dark: `214 70% 35%` - Hover states, emphasis

**Dark Mode**:
- Primary Blue: `214 85% 65%` - Adjusted for dark backgrounds
- Primary Dark: `214 30% 15%` - Card/section backgrounds
- Surface: `220 18% 12%` - Main background

### Semantic Colors
- Success Green: `142 71% 45%` (Paid/Shipped status)
- Warning Orange: `38 92% 50%` (Pending actions)
- Error Red: `0 84% 60%` (Rejected/Issues)
- Neutral Gray: `220 13% 46%` (Supporting text)

### Accent (Minimal Use)
- Gold Highlight: `45 93% 58%` - Only for premium features or important CTAs (use sparingly)

---

## Typography

**Font Families**:
- Primary: `'Inter', sans-serif` (Professional, excellent readability)
- Monospace: `'JetBrains Mono', monospace` (RFQ IDs, technical data)

**Type Scale**:
- Hero/Display: `text-5xl md:text-6xl font-bold` (Landing hero)
- Page Title: `text-3xl md:text-4xl font-semibold` (Page headers)
- Section Header: `text-2xl font-semibold` (Dashboard sections)
- Card Title: `text-lg font-medium` (Product cards, RFQ items)
- Body Text: `text-base` (Forms, descriptions)
- Caption: `text-sm text-gray-600` (Metadata, helper text)
- RFQ ID: `text-sm font-mono tracking-wide` (Order/RFQ identifiers)

---

## Layout System

**Spacing Primitives**: Tailwind units of **4, 6, 8, 12, 16, 20** (p-4, gap-6, my-8, py-12, mb-16, py-20)

**Container Widths**:
- Full sections: `w-full` with `max-w-7xl mx-auto px-4 md:px-8`
- Content areas: `max-w-6xl`
- Forms/Cards: `max-w-2xl`
- Dashboards: `max-w-[1600px]` (wider for tables)

**Grid Patterns**:
- Landing features: `grid-cols-1 md:grid-cols-3 gap-8`
- Product cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Dashboard tables: Full-width responsive tables
- RFQ detail: `grid-cols-1 lg:grid-cols-3 gap-8` (2/3 products, 1/3 quote summary)

---

## Component Library

### Navigation
- **Header**: Fixed top navbar with logo left, navigation center, "Start RFQ" CTA right
- Style: White background, subtle shadow `shadow-sm`, blue underline on active link
- Mobile: Hamburger menu, slide-in drawer

### Hero Section (Landing Page)
- **Layout**: Full-width with centered content, `py-20 md:py-32`
- **Background**: Subtle world map pattern overlay (light blue tint) over white/gradient background
- **Content**: 
  - H1 headline with flag emoji row below (🇩🇪 🇫🇷 🇸🇪 🇨🇭 🇬🇧 🇮🇹)
  - Subtext `text-xl text-gray-600`
  - Primary CTA button `px-8 py-4 text-lg` with arrow icon
- **Image**: Hero illustration/photo showing international shipping, Indian products, or global trade (right side on desktop, 50/50 split)

### Cards & Previews
- **Product Preview Card** (WhatsApp-style):
  - White background, `rounded-xl shadow-md border border-gray-200`
  - Image left (120px square), content right with padding `p-4`
  - Title `font-semibold`, price in `text-blue-600 font-bold`
  - Remove button top-right as icon `text-gray-400 hover:text-red-500`

- **RFQ Status Card**:
  - Larger card `rounded-2xl shadow-lg p-6`
  - Status badge top-right: pill shape with colored background matching status
  - Grid layout for metadata (date, customer, products count)

### Forms
- **Input Fields**:
  - Style: `rounded-lg border-2 border-gray-300 focus:border-blue-500 px-4 py-3`
  - Labels: `text-sm font-medium text-gray-700 mb-2`
  - Helper text: `text-xs text-gray-500 mt-1`
  - Error state: `border-red-500` with error message below

- **Buttons**:
  - Primary: `bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-3 font-medium shadow-md transition-colors`
  - Secondary: `bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg px-6 py-3 font-medium`
  - Outline: `border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg px-6 py-3 font-medium`

### Data Display
- **Tables** (Admin Dashboard):
  - Striped rows `odd:bg-gray-50`
  - Header: `bg-gray-100 font-semibold text-sm uppercase tracking-wide`
  - Cells: `px-6 py-4` with borders
  - Hover: `hover:bg-blue-50 cursor-pointer`
  - Status badges as pills with icon + text

- **Timeline/Status Flow**:
  - Horizontal stepper showing RFQ stages
  - Completed steps: Blue with checkmark
  - Current step: Blue with pulse animation (subtle)
  - Future steps: Gray outline

### Modals & Overlays
- **Modal Container**: `rounded-2xl shadow-2xl max-w-lg bg-white p-8`
- **Backdrop**: `bg-black/50 backdrop-blur-sm`
- **Confirmation Modal**: Icon at top, message, two-button footer
- **Quote Detail Modal**: Larger `max-w-4xl`, scrollable content area

---

## Page-Specific Layouts

### Landing Page
1. **Hero Section**: Full-width with illustration (as described above)
2. **Trust Bar**: Logo carousel/grid of country flags with "Serving X countries" text, `py-12 bg-gray-50`
3. **How It Works**: 3-column grid with numbered steps, icons, descriptions, `py-20`
4. **Feature Highlights**: 3-column cards showcasing WhatsApp-style preview, admin dashboard, payment tracking, `py-20`
5. **Social Proof**: Statistics cards (RFQs processed, countries served, products sourced), `py-16 bg-blue-50`
6. **CTA Section**: Centered with button "Start Your First RFQ", `py-20`
7. **Footer**: Multi-column (Company info, Quick Links, Contact, Social), `bg-gray-900 text-gray-300 py-12`

### RFQ Creation Page
- **Two-column layout** (desktop): Left side for input/preview, right side for RFQ summary cart
- **Mobile**: Stacked, with floating summary button at bottom
- **URL Input**: Large prominent field with "Paste Link" placeholder, "Fetch" button inline
- **Product Preview Area**: Stacked cards with delete option
- **Bottom Actions**: "Add Another Product" (secondary) and "Submit RFQ" (primary, disabled until ≥1 product)

### Admin Dashboard
- **Sidebar Navigation** (desktop): Fixed left, `w-64`, collapsed on tablet
- **Main Content**: Table view with filters at top, search bar, status filter dropdown
- **Detail View**: Slide-in panel from right (desktop) or full-page modal (mobile)
- **Edit Quote Section**: Form fields for pricing, textareas for notes, status dropdown, action buttons at bottom

---

## Images

**Hero Image**: 
- Professional photo/illustration showing global shipping, Indian handicrafts/products being packaged, or world map with connection lines
- Placement: Right 50% of hero section on desktop, full-width above text on mobile
- Style: Slightly desaturated with blue overlay for brand consistency

**About Page**:
- Team photo or warehouse/office image at top, `rounded-xl shadow-lg`
- Product category images in grid showcasing textile, handicraft, industrial materials

**Product Previews**:
- Fetched from Open Graph tags, displayed as 120x120px square thumbnails
- Fallback: Generic product icon if image fails to load

---

## Responsive Behavior

**Breakpoints**:
- Mobile: `< 768px` - Single column, stacked navigation, full-width cards
- Tablet: `768px - 1024px` - Two columns where applicable, sidebar collapses
- Desktop: `> 1024px` - Full multi-column layouts, persistent sidebar

**Mobile Priorities**:
- Sticky header with hamburger menu
- Bottom floating action button for primary CTAs
- Collapsible RFQ summary on creation page
- Simplified table views (card-based on mobile)

---

## Animations

**Minimal & Purposeful**:
- Page transitions: Fade in content `opacity-0 animate-fade-in` (300ms)
- Loading states: Spinner for data fetching, skeleton screens for tables
- Status changes: Subtle pulse on status badge updates
- **No scroll animations, parallax, or decorative motion**

---

## Trust & International Design Elements

- **Flag Icons**: Use emoji flags (🇩🇪 🇫🇷 etc.) for simplicity, or flag icon library via CDN
- **Trust Badges**: SSL secure icon, "International Shipping" badge in footer
- **Professional Imagery**: Avoid stock photos; prefer authentic product/warehouse images
- **Language Indicators**: Small language selector in header (flags for EN, DE, FR - even if not implemented)
- **Currency Display**: Always show INR with conversion estimate `text-sm text-gray-500` like "~€14.50"

This design system creates a trustworthy, efficient B2B platform that balances professional credibility with modern usability standards.