# VentureNext - Exclusive Perks & Deals Platform

A modern web platform for startup founders to discover exclusive perks, deals, and partnerships. Built with Next.js, Supabase, and modern web technologies.

## 🌐 Live Website & Repository

- **Live Website**: https://perk-project-final.vercel.app
- **GitHub Repository**: https://github.com/RivinJayawardhana/perk-project-Final.git
- **Admin Dashboard**: https://perk-project-final.vercel.app/admin

## 📚 Tech Stack

### Frontend
- **Next.js** 15.1.11 - React framework with SSR/SSG
- **React** 18.3.1 - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** 3.4.1 - Utility-first CSS framework
- **Radix UI** - Headless UI components (accessible)
- **Shadcn/ui** - Built on Radix UI (custom components)

### Backend & Database
- **Supabase** - PostgreSQL database with real-time capabilities
- **Supabase Auth** - User authentication and authorization
- **Supabase Storage** - File storage for images (banners, logos)

### Email & Notifications
- **Hostinger SMTP** - Email delivery via Hostinger
- **Nodemailer** - Node.js email library
- **Brevo API** - Email marketing platform (newsletter support)

### External Services
- **Vercel** - Deployment and hosting (auto-deploy from GitHub)
- **reCAPTCHA v2** - Form spam protection
- **TanStack React Query** - Data fetching and state management

### UI Libraries & Components
- **Lucide React** - SVG icon library
- **Recharts** - Charts and data visualization
- **Tiptap** - WYSIWYG rich text editor
- **Embla Carousel** - Carousel/slider component
- **Sonner** - Toast notifications
- **Zod** - TypeScript-first schema validation
- **React Hook Form** - Form state management

## 🛠 Environment Variables

### Local Development (`.env.local`)
Create a `.env.local` file in the project root with the following variables:

```env
# Supabase - Get these from Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Application URL (used for password reset links and redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# SMTP Email Configuration (Hostinger)
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@venturenext.io
SMTP_PASSWORD=your_smtp_password_here
SMTP_FROM=noreply@venturenext.io

# reCAPTCHA (Get from Google reCAPTCHA Admin Console)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Brevo API Key (Optional - for email marketing features)
BREVO_API_KEY=your_brevo_api_key_here
```

### Production Deployment (Vercel Dashboard)
1. Go to Vercel Project → Settings → Environment Variables
2. Add the **same variables** from `.env.local`
3. **Important**: Set `NEXT_PUBLIC_APP_URL` to your production domain:
   ```
   NEXT_PUBLIC_APP_URL=https://perk-project-final.vercel.app
   ```

**Note**: Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser (safe for public keys). Private keys must not have this prefix.

## 📋 Environment Variables Reference

| Variable | Type | Purpose | Example |
|----------|------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anonymous key (client-side) | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Private | Supabase server key (API routes only) | `eyJhbGc...` |
| `NEXT_PUBLIC_APP_URL` | Public | Application base URL | `http://localhost:3000` |
| `SMTP_HOST` | Private | Email server hostname | `smtp.hostinger.com` |
| `SMTP_PORT` | Private | Email server port | `465` |
| `SMTP_SECURE` | Private | Use TLS (true/false) | `true` |
| `SMTP_USER` | Private | Email account username | `hello@venturenext.io` |
| `SMTP_PASSWORD` | Private | Email account password | `Enquiryventurenext123!` |
| `SMTP_FROM` | Private | Sender email address | `noreply@venturenext.io` |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Public | reCAPTCHA site key | `6Led2DEsAAAA...` |
| `RECAPTCHA_SECRET_KEY` | Private | reCAPTCHA secret key | `6Led2DEsAAAA...` |
| `BREVO_API_KEY` | Private | Brevo email marketing API key | `xkeysib-...` |

## 🚀 Local Setup Instructions

### Prerequisites
- Node.js 18+ (recommended: 20+)
- npm or yarn package manager
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/perk-project.git
cd perk-project
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Configure Environment Variables
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your actual credentials
nano .env.local  # or use your preferred editor
```

### Step 4: Run Development Server
```bash
npm run dev
# or
yarn dev
```

The app will be available at: **http://localhost:3000**

### Step 5: Access the Admin Dashboard
Navigate to: **http://localhost:3000/admin**

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server on port 3000

# Production
npm run build        # Build for production
npm start           # Start production server

# Code Quality
npm run lint        # Run ESLint with strict warnings
```

## 🌐 Deployment

### Automatic Deployment (Vercel)
1. Push to the `main` branch on GitHub
2. Vercel automatically deploys the latest changes
3. Check deployment status: https://vercel.com/dashboard

### Manual Deployment
```bash
# Build locally
npm run build

# Test production build
npm start

# Deploy to Vercel (if Vercel CLI installed)
vercel --prod
```

## 📁 Project Structure

```
perk-project/
├── src/
│   ├── app/                    # Next.js app directory (pages & routes)
│   │   ├── (auth)/             # Authentication pages (login, register)
│   │   ├── admin/              # Admin dashboard
│   │   │   ├── categories/     # Manage categories
│   │   │   ├── perks/          # Manage perks
│   │   │   ├── leads/          # View form submissions
│   │   │   ├── journal/        # Manage blog posts
│   │   │   └── settings/       # Admin settings
│   │   ├── api/                # API routes (backend endpoints)
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── perks/          # Perks CRUD endpoints
│   │   │   ├── categories/     # Categories endpoints
│   │   │   ├── contact/        # Contact form endpoints
│   │   │   └── leads/          # Lead form submissions
│   │   ├── perks/              # Public perks listing page
│   │   ├── blog/               # Public blog/journal pages
│   │   ├── contact/            # Contact form page
│   │   └── page.tsx            # Home page
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # Shadcn/ui components
│   │   ├── admin/              # Admin-specific components
│   │   ├── perks/              # Perks-specific components
│   │   └── layout/             # Layout components
│   ├── hooks/                  # Custom React hooks
│   │   ├── usePerks.ts         # Perks data fetching
│   │   ├── useCategories.ts    # Categories data fetching
│   │   ├── useLeadForms.ts     # Lead forms data fetching
│   │   └── use-toast.ts        # Toast notifications
│   ├── lib/                    # Utility functions and libraries
│   │   ├── supabase.ts         # Supabase client configuration
│   │   ├── form-validation.ts  # Form validation logic
│   │   ├── meta-tags.ts        # SEO meta tags
│   │   └── utils.ts            # General utilities
│   ├── contexts/               # React context providers
│   └── index.css               # Global styles
├── public/                     # Static assets (images, robots.txt)
├── .env.local                  # Local environment variables (NOT committed)
├── .env.example                # Template for environment variables
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## 🗄 Database (Supabase)

### Key Tables
- **perks** - Product/perk listings with details
- **categories** - Perk categories (SaaS, Hosting, etc.)
- **subcategories** - Nested categories within main categories
- **lead_forms** - Lead capture form configurations
- **leads** - Submitted lead data
- **journal_posts** - Blog articles
- **contact_submissions** - Contact form submissions
- **page_content** - Dynamic page content 
- **footer_content** - Dynamic Footer content 

### Storage Buckets
- **perk-images** - Perk banner images (public)
- **Journal-iamges** - journal blog images (public)

### Row Level Security (RLS)
All tables have RLS enabled with permissive policies for public access and user submissions. Admin-only actions are controlled via API routes.

## 🔐 Authentication & Authorization

- **Public Pages**: Available to all visitors
- **Admin Pages**: Protected routes that require admin authentication
- **API Routes**: Implement server-side validation and Supabase role checks

## 📧 Email Configuration

### Hostinger SMTP
The app uses Hostinger's SMTP server for transactional emails:
- Password reset emails
- Contact form confirmations
- Lead submission notifications

### Brevo Integration (Optional)
Brevo is configured for marketing emails and newsletters.



## 📱 Responsive Design

The application is fully responsive and optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)

## 🧪 Testing

Currently, the project uses browser-based testing. To add automated tests:

```bash
# Install testing libraries
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Create test files in src/__tests__/
# Run tests with: npm run test
```

## 🐛 Troubleshooting

### Common Issues

**"SUPABASE_URL not found"**
- Ensure `.env.local` is in the project root
- Verify all required environment variables are set
- Restart the development server

**"Email sending fails"**
- Check SMTP credentials in `.env.local`
- Verify Hostinger email account is active
- Check email whitelist/SPF/DKIM settings

**"Images not uploading"**
- Verify Supabase storage buckets exist (`banners`, `logos`)
- Check RLS policies on storage buckets
- Ensure file size is within limits

**"reCAPTCHA validation fails"**
- Verify site key and secret key match
- Check domain whitelist in reCAPTCHA console
- Ensure `NEXT_PUBLIC_APP_URL` matches reCAPTCHA configuration

## 📞 Support & Contact

For issues or questions:
- Email: hello@venturenext.io
- GitHub Issues: [Add repo URL]

## 📄 License

[Add license information]

## 📝 Additional Notes

- Always test environment variable changes before deploying to production
- Keep sensitive keys (.env.local) in `.gitignore`
- Use `.env.example` as a template for new developers
- Read `DATABASE.md` for detailed schema documentation
- Refer to `ACCESS.md` for credential management information
