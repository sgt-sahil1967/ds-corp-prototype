# DS Corporation Global RFQ Platform

## Project Overview
A professional B2B Request for Quote (RFQ) web application enabling international buyers to paste Indian e-commerce product links, receive WhatsApp-style previews with metadata extraction, and submit quote requests. Includes a complete admin management dashboard for processing RFQs through a full status workflow.

**Tech Stack**: React + TypeScript + Vite, Express, Wouter, React Query, Zod, Tailwind CSS, Shadcn UI

## Recent Changes (October 2025)
- **Oct 7, 2025**: Complete implementation of DS Corporation Global RFQ Platform
  - Built full-stack RFQ submission and management system
  - Implemented Open Graph metadata extraction from Indian e-commerce sites
  - Created professional admin dashboard with complete quote workflow
  - Established Material Design 3 B2B blue/white color palette (214° hue)
  - Removed all emoji usage per design guidelines
  - Deployed complete authentication and storage system

## User Preferences
- **Design System**: Material Design 3 (B2B variant) with professional blue/white palette
- **Color Palette**: Blue-based (214° hue) - Primary: 214 88% 45% (light), 214 85% 65% (dark)
- **No Emoji**: Text-based indicators for countries instead of flag emojis
- **Storage**: In-memory storage using javascript_mem_db blueprint
- **International Focus**: Serving European markets (Germany, France, Sweden, Switzerland, UK, Italy)

## Project Architecture

### Design System
- **Color Scheme**: Professional blue/white B2B palette (Material Design 3)
  - Light mode primary: `214 88% 45%`
  - Dark mode primary: `214 85% 65%`
  - All tokens configured in `client/src/index.css`
- **No Emoji Policy**: Text-based country indicators enforced throughout UI
- **Components**: Shadcn UI components with custom theming
- **Responsive**: Mobile-first design with breakpoints for all screen sizes

### Data Models (`shared/schema.ts`)
- **RFQ**: Core entity with product details, buyer contact info, status workflow
- **Product**: Extracted metadata (title, price, image, description)
- **Quote**: Admin-generated quotes with pricing and notes
- **Admin**: Simple authentication structure

### Frontend Architecture
- **Pages**:
  - Landing (`/`) - Hero section with CTA
  - RFQ Creation (`/rfq`) - Multi-step form with link preview
  - Confirmation (`/rfq/:id`) - Success page with quote view
  - Admin Login (`/admin/login`) - Authentication
  - Admin Dashboard (`/admin/dashboard`) - RFQ management
  - About (`/about`) - Company information
  - Contact (`/contact`) - Contact details

- **State Management**: React Query for server state, React hooks for UI state
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form + Zod validation

### Backend Architecture (`server/`)
- **API Routes** (`routes.ts`):
  - `POST /api/preview` - Extract Open Graph metadata from product URLs
  - `POST /api/rfq` - Submit new RFQ
  - `GET /api/rfq/:id` - Retrieve RFQ by ID
  - `POST /api/admin/login` - Admin authentication
  - `GET /api/admin/rfqs` - List all RFQs (admin only)
  - `PUT /api/admin/rfqs/:id/quote` - Update quote and status (admin only)

- **Storage** (`storage.ts`): In-memory storage interface
  - RFQ CRUD operations
  - Admin authentication
  - Quote management

### Key Features
1. **Link Preview Extraction**: Cheerio-based Open Graph scraping from Indian marketplaces
2. **WhatsApp-Style Preview**: Real-time product preview with image, title, price
3. **Complete RFQ Workflow**: New → Quoted → Paid → Shipped → Delivered
4. **Admin Dashboard**: Manage all RFQs, add quotes, track status
5. **Dark Mode**: Full theme support with consistent blue palette
6. **International UX**: Multi-language ready, currency display, country indicators

### Security Notes
- **Admin Credentials**: Default username: "admin", password: "ds2025"
  - ⚠️ MUST be changed before production deployment
- **Session Management**: Express session with in-memory store
- **Input Validation**: Zod schemas on all API endpoints

### File Structure
```
├── client/src/
│   ├── pages/          # All route pages
│   ├── components/     # Reusable UI components
│   ├── lib/           # Utilities and query client
│   └── index.css      # Design tokens and theme
├── server/
│   ├── routes.ts      # API endpoints
│   ├── storage.ts     # Data storage interface
│   └── index.ts       # Express server setup
└── shared/
    └── schema.ts      # TypeScript types and Zod schemas
```

### Development Commands
- `npm run dev` - Start development server (frontend + backend)
- Application runs on port 5000
- Workflow: "Start application" auto-restarts on changes

### Deployment Checklist
- [ ] Change admin credentials from defaults
- [ ] Configure production session secret
- [ ] Set up persistent database if needed
- [ ] Configure CORS for production domain
- [ ] Enable rate limiting on API endpoints
- [ ] Set up proper error logging

## Design Guidelines Reference
See `design_guidelines.md` for detailed Material Design 3 B2B specifications including:
- Color palette definitions
- Typography scale
- Component styling patterns
- Spacing system
- Responsive breakpoints
