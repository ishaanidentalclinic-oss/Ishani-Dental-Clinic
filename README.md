# Ishaani Dental Clinic — Official Website & Admin CMS

Production-grade website and patient management platform for **Ishaani Dental Clinic — Advanced Implant and Laser Center**. Built with a unified full-stack Next.js architecture and MongoDB Atlas.

---

## ⚡ Tech Stack

- **Framework**: Next.js 15+ (App Router, Turbopack, Server-side Route Handlers)
- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide Icons
- **Database**: MongoDB Atlas via Mongoose
- **Authentication**: JWT (Access Token in HTTP-only Cookie + Refresh Token rotation)
- **Integrations**: Nodemailer (Email notifications), Google Calendar API, Vercel Blob (Media CMS)

---

## 📁 Project Structure

```
ishaani-dental-clinic/
├── client/                      # Unified Next.js application
│   ├── app/                     # App Router pages & API route handlers
│   │   ├── (public pages)       # /, /about, /treatments, /blogs, /contact
│   │   ├── admin/               # Admin CMS & Receptionist dashboard
│   │   └── api/                 # Built-in Serverless API endpoints
│   │       ├── appointments/    # Booking, scheduling, available-slots
│   │       ├── auth/            # Login, logout, refresh, change-password
│   │       ├── blogs/           # Public & Admin blog CMS
│   │       ├── contacts/        # Patient contact enquiries
│   │       ├── dentists/        # Doctor profiles & availability
│   │       ├── media/           # Image uploads (Vercel Blob / local)
│   │       ├── patients/        # Receptionist patient phone lookup
│   │       ├── settings/        # Site settings & business hours
│   │       └── seed/            # One-time database initialization
│   ├── components/              # UI & section components
│   ├── lib/
│   │   ├── server/              # Server-only DB, auth, email, calendar utils
│   │   └── ...                  # Client API fetchers
│   └── scripts/
│       └── seedAdmin.mjs        # Admin & dentist database seeding
├── package.json                 # Monorepo root scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 20+**
- **MongoDB Atlas Connection URI**

### 1. Install Dependencies
```bash
npm install --prefix client
```

### 2. Configure Environment Variables
Inside `client/.env.local`:
```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ishaani-dental

# JWT Auth Secrets
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Seed Admin Credentials
SEED_ADMIN_NAME=Super Admin
SEED_ADMIN_EMAIL=admin@ishaanidental.com
SEED_ADMIN_PASSWORD=Admin@123456
```

### 3. Seed the Database
Run the one-time seeder to initialize the Super Admin account and dentist profiles:
```bash
npm run seed:admin
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
Admin portal is available at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## 🚢 Production Deployment

Deploy seamlessly to **Vercel** with zero extra server configuration:
1. Push this repository to GitHub / GitLab.
2. Import project into Vercel and set the Root Directory to `client`.
3. Add the environment variables from `.env.local` to Vercel Project Settings.
4. Deploy! Next.js automatically bundles pages and creates serverless functions for all `/api/*` routes.
