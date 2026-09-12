# Technical Documentation & System Architecture
## Ishaani Dental Clinic — Advanced Implant & Laser Center

> **Version:** 1.0.0  
> **Architecture:** Unified Full-Stack Next.js (App Router + Serverless API Handlers)  
> **Database:** MongoDB Atlas via Mongoose  
> **Hosting Target:** Vercel  

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Security & Credential Protection](#2-security--credential-protection)
3. [Database Architecture & Data Models](#3-database-architecture--data-models)
4. [Authentication & Role-Based Access Control (RBAC)](#4-authentication--role-based-access-control-rbac)
5. [Complete API Reference (41 Endpoints)](#5-complete-api-reference-41-endpoints)
6. [Third-Party Integrations](#6-third-party-integrations)
7. [Deployment & Operations Guide](#7-deployment--operations-guide)

---

## 1. Architecture Overview

The system operates as a unified, monolithic full-stack application built on **Next.js (App Router)**. It combines server-rendered React components for the public patient-facing portal and admin CMS with built-in serverless API Route Handlers (`app/api/*`).

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT BROWSER                                │
│        (Patient Website / Admin CMS / Receptionist Portal)             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS (Same-Origin)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     VERCEL / NEXT.JS ENGINE                            │
│                                                                        │
│  ┌──────────────────────────────┐    ┌──────────────────────────────┐  │
│  │   Server & Client Pages      │    │  Serverless API Handlers     │  │
│  │   - Public Portal (/, etc.)  │    │  - /api/auth/*               │  │
│  │   - Admin CMS (/admin/*)     │    │  - /api/appointments/*       │  │
│  │   - SSG & ISR Static Cache   │    │  - /api/treatments/*         │  │
│  └──────────────────────────────┘    │  - /api/blogs/*              │  │
│                                      │  - /api/contacts/*           │  │
│                                      │  - /api/settings/*           │  │
│                                      └──────────────┬───────────────┘  │
└─────────────────────────────────────────────────────┼──────────────────┘
                                                      │ Mongoose Cache
                                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        MONGODB ATLAS CLUSTER                           │
│  Collections: admins, appointments, blogs, contacts, dentists,         │
│               patients, refreshtokens, sitesettings, treatments        │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Architectural Advantages:
- **Zero CORS / Domain Fragility**: Since frontend UI and backend API routes share the exact same domain, all cross-origin restrictions, preflight `OPTIONS` requests, and third-party cookie blocking are eliminated.
- **Unified TypeScript Layer**: Shared types, interfaces, validation schemas, and constants between client forms and backend database models.
- **Serverless Autoscaling**: Handlers scale down to zero when idle and instantly scale up to handle traffic spikes without server management.

---

## 2. Security & Credential Protection

### Are Credentials Safe?
**Yes.** Security and credential isolation have been enforced at multiple levels:

1. **Git Isolation (`.gitignore`)**:
   - The `.gitignore` file strictly blocks `.env`, `.env*.local`, `*.key`, `*.pem`, and service account JSON files from ever being staged or committed to GitHub.
   - Only `.env.example` (containing sanitized documentation templates) is tracked in version control.

2. **HTTP-Only, Secure Cookies**:
   - Access and Refresh tokens are **never** stored in browser `localStorage` or `sessionStorage` (preventing XSS token extraction).
   - Cookies are issued with:
     - `HttpOnly: true` (inaccessible to browser JavaScript)
     - `SameSite: Lax` (protects against Cross-Site Request Forgery)
     - `Path: /` for Access Token, `Path: /api/auth` for Refresh Token
     - `Secure: true` automatically enabled in production over HTTPS.

3. **Cryptographic Standards**:
   - **Passwords**: Hashed with `bcryptjs` using a salt work factor of **12**.
   - **Refresh Tokens**: Stored in MongoDB only as **SHA-256 hashes** (`hashToken()`). If database records were ever compromised, raw refresh tokens cannot be reversed.
   - **JWT Tokens**: Signed using `HS256` with isolated environment secrets (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`).

---

## 3. Database Architecture & Data Models

All data models are defined using **Mongoose** with cached connections in `client/lib/server/models.ts`:

### 1. `Admin`
- **Fields**: `name`, `email` (unique, lowercase), `passwordHash` (hidden from queries by default), `role` (`super_admin` | `admin` | `receptionist`), `isActive` (boolean), `lastLoginAt` (Date).
- **Index**: Unique index on `email`.

### 2. `Dentist`
- **Fields**: `name`, `role`, `qualifications` (string array), `specializations` (string array), `experienceYears`, `profilePhoto`, `email`, `googleCalendarId`, `isActive`, `displayOrder`.
- **Index**: Compound index on `{ isActive: 1, displayOrder: 1 }`.

### 3. `Patient`
- **Fields**: `name`, `email`, `phone` (unique, normalized digits), `previousDentist` (ref: Dentist).
- **Index**: Unique index on `phone`.

### 4. `Appointment`
- **Fields**: `name`, `email`, `phone`, `treatment` (enum of 18 clinic treatments), `preferredDate` (`YYYY-MM-DD`), `preferredTime` (`HH:MM`), `durationMinutes`, `bufferMinutes`, `dentist` (ref: Dentist), `patient` (ref: Patient), `source` (`Website` | `Receptionist` | `Walk-in`), `googleEventId`, `status` (`Pending` | `Confirmed` | `Completed` | `Cancelled` | `Rescheduled`), `message`.
- **Indexes**: Compound index `{ dentist: 1, preferredDate: 1, preferredTime: 1 }`, `{ status: 1 }`, `{ patient: 1 }`.

### 5. `Blog`
- **Fields**: `title`, `slug` (unique), `excerpt`, `coverImage`, `category`, `author`, `readTime`, `sections` (headings, paragraphs, bullets), `status` (`Draft` | `Published` | `Archived`), `featured` (boolean), `publishedAt`, `seo` (`metaTitle`, `metaDescription`).
- **Indexes**: `{ slug: 1 }`, `{ status: 1 }`, `{ category: 1 }`, `{ featured: 1 }`.

### 6. `Treatment`
- **Fields**: `name`, `slug` (unique), `shortDescription`, `overview`, `bannerImage`, `category`, `benefits` (string array), `idealFor` (string array), `duration`, `recovery`, `procedure` (array of step titles & descriptions), `faqs` (array of Q&As), `relatedTreatments` (refs: Treatment), `status` (`Draft` | `Published`), `displayOrder`, `publishedAt`, `seo`.
- **Indexes**: `{ slug: 1 }`, `{ status: 1 }`, `{ displayOrder: 1 }`.

### 7. `Contact` (Enquiries)
- **Fields**: `name`, `email`, `phone`, `subject`, `message`, `status` (`New` | `In Review` | `Resolved` | `Archived`).
- **Indexes**: `{ status: 1 }`, `{ email: 1 }`.

### 8. `RefreshToken`
- **Fields**: `admin` (ref: Admin), `tokenHash` (unique SHA-256), `expiresAt`, `rememberMe`, `createdByIp`, `userAgent`.
- **Indexes**: TTL index on `{ expiresAt: 1 }` with automatic document deletion (`expireAfterSeconds: 0`), index on `{ admin: 1 }`.

### 9. `SiteSettings` (Singleton)
- **Fields**: `clinicName`, `logoUrl`, `faviconUrl`, `contact` (phone, email, address, whatsappNumber, googleMapsUrl, googleReviewsUrl), `businessHours`, `schedulingHours` (open/close times per day of week), `seo`, `footer`.

---

## 4. Authentication & Role-Based Access Control (RBAC)

### Token Lifecycles:
- **Access Token**: Short-lived (15 minutes), carries `{ sub: adminId, role }`. Used for API authentication via cookies.
- **Refresh Token**: Long-lived (1 day default, 30 days if "Remember Me" is checked). Rotated on every single refresh call (one-time use).

### Role Permissions Matrix:

| Feature / Resource | Receptionist | Admin | Super Admin |
| :--- | :---: | :---: | :---: |
| **View Dashboard & Metrics** | ✅ | ✅ | ✅ |
| **Book & Reschedule Appointments** | ✅ | ✅ | ✅ |
| **Receptionist Walk-in Booking** | ✅ | ✅ | ✅ |
| **Patient Phone Search & History** | ✅ | ✅ | ✅ |
| **Delete Appointments** | ❌ | ❌ | ✅ |
| **Manage Blogs CMS (Create/Edit)** | ❌ | ✅ | ✅ |
| **Delete Blog Posts** | ❌ | ❌ | ✅ |
| **Manage Treatments CMS (Create/Edit)**| ❌ | ✅ | ✅ |
| **Delete Treatments** | ❌ | ❌ | ✅ |
| **View & Update Contact Enquiries** | ✅ | ✅ | ✅ |
| **Delete Contact Enquiries** | ❌ | ❌ | ✅ |
| **Edit Site Settings & Clinic Hours** | ❌ | ✅ | ✅ |
| **Media File Uploads** | ❌ | ✅ | ✅ |

---

## 5. Complete API Reference (41 Endpoints)

### 🔐 Authentication (`/api/auth/*`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticates admin credentials, returns admin profile, sets HTTP-only cookies |
| `POST` | `/api/auth/logout` | Authenticated | Clears cookies and deletes refresh token from database |
| `POST` | `/api/auth/refresh` | Public (Cookie) | Rotates refresh token and issues fresh access token |
| `GET` | `/api/auth/me` | Authenticated | Returns current authenticated admin user profile |
| `POST` | `/api/auth/change-password` | Authenticated | Validates old password and sets new password hash |

### 📅 Appointments (`/api/appointments/*`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/appointments` | Receptionist+ | Paginated list of appointments with date, status, dentist, and search filters |
| `POST` | `/api/appointments` | Public | Public patient appointment booking with automated email & calendar dispatch |
| `POST` | `/api/appointments/receptionist` | Receptionist+ | Receptionist/Walk-in booking with explicit source assignment |
| `GET` | `/api/appointments/available-slots` | Public | Calculates available slots for a given date, treatment duration, and dentist |
| `GET` | `/api/appointments/next-available-slot`| Public | Lookahead engine to find the earliest open slot across 14 days |
| `GET` | `/api/appointments/[id]` | Receptionist+ | Fetches single appointment details |
| `PATCH`| `/api/appointments/[id]` | Receptionist+ | Updates status, reschedules, or updates clinical notes |
| `DELETE`| `/api/appointments/[id]`| Super Admin | Permanently deletes an appointment record |

### 🩺 Treatments CMS (`/api/treatments/*`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/treatments` | Public | Returns all published treatments sorted by display order |
| `GET` | `/api/treatments/[id]` | Public | Fetches treatment details by slug or ObjectId |
| `GET` | `/api/treatments/admin/list` | Admin+ | Paginated admin list with drafts and search |
| `POST` | `/api/treatments/admin` | Admin+ | Creates a new treatment with automatic slug generation |
| `GET` | `/api/treatments/admin/[id]` | Admin+ | Fetches treatment by ID for editing |
| `PATCH`| `/api/treatments/admin/[id]` | Admin+ | Updates treatment content, steps, FAQs, or status |
| `DELETE`| `/api/treatments/admin/[id]`| Super Admin | Deletes treatment and removes dangling relations |

### 📝 Blogs CMS (`/api/blogs/*`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/blogs` | Public | Returns published blogs with category/featured filters |
| `GET` | `/api/blogs/[id]` | Public | Fetches blog article by slug or ObjectId |
| `GET` | `/api/blogs/admin/list` | Admin+ | Paginated admin list with status filters and search |
| `POST` | `/api/blogs/admin` | Admin+ | Creates blog article with slug collision prevention |
| `GET` | `/api/blogs/admin/[id]` | Admin+ | Fetches blog article by ID for editing |
| `PATCH`| `/api/blogs/admin/[id]` | Admin+ | Updates blog content, sections, cover, or status |
| `DELETE`| `/api/blogs/admin/[id]`| Super Admin | Permanently deletes blog article |

### 👥 Patients (`/api/patients/*`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/patients` | Receptionist+ | Phone lookup endpoint with past appointment history |
| `GET` | `/api/patients/[id]` | Receptionist+ | Returns patient profile by ID |

### 📬 Contact Enquiries (`/api/contacts/*`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/contacts` | Receptionist+ | Paginated list of patient contact submissions |
| `POST` | `/api/contacts` | Public | Public contact form submission |
| `GET` | `/api/contacts/[id]` | Receptionist+ | Fetches single contact enquiry |
| `PATCH`| `/api/contacts/[id]` | Receptionist+ | Updates status (`New`, `In Review`, `Resolved`, `Archived`) |
| `DELETE`| `/api/contacts/[id]` | Super Admin | Deletes contact enquiry |

### ⚙️ Settings, Doctors, Media & Seed
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/dentists` | Public | Returns active clinic doctors |
| `GET` | `/api/settings` | Public | Returns clinic info, contact, and business hours |
| `PATCH`| `/api/settings` | Admin+ | Updates clinic information or custom scheduling hours |
| `POST` | `/api/media/upload` | Admin+ | Uploads images to Vercel Blob (with local fallback) |
| `POST` | `/api/seed` | Protected (Secret)| One-time database seeder for Super Admin and Doctors |

---

## 6. Third-Party Integrations

1. **MongoDB Atlas Connection Pooling (`lib/server/db.ts`)**:
   - Connection caching across hot-reloads and serverless function invocations.
   - Connection liveness check (`readyState === 1`) with automatic reconnection on drops.
   - Pool size capped at `10` to avoid connection spikes on MongoDB Atlas M0/M10 tiers.

2. **Nodemailer / SMTP (`lib/server/email.ts`)**:
   - Sends transactional HTML emails for patient appointment confirmations, cancellations, and clinic front-desk alerts.
   - Graceful fallback: If SMTP credentials are not set, logs to console without interrupting the booking transaction.

3. **Google Calendar (`lib/server/calendar.ts`)**:
   - Uses `googleapis` with Google Service Account credentials.
   - Synchronizes appointment bookings directly to Dr. Raghavendra's and Dr. Manjushri's personal Google Calendars.

4. **Media Storage (`lib/server/media/upload`)**:
   - Uploads directly to **Vercel Blob** in production (`BLOB_READ_WRITE_TOKEN`).
   - Includes automatic local fallback writing to `public/uploads` in development if Vercel Blob token is omitted.

---

## 7. Deployment & Operations Guide

### Deployment to Vercel
1. Link your Git repository in Vercel.
2. If prompted, select `client` as the Root Directory (our root `vercel.json` also handles root builds automatically).
3. Set the Environment Variables in Vercel Project Settings:
   - `MONGODB_URI`
   - `JWT_ACCESS_SECRET`
   - `JWT_REFRESH_SECRET`
   - `NEXT_PUBLIC_API_URL=/api`
4. Click **Deploy**.

### CLI Database Seeder
To initialize or re-sync admin accounts and clinic doctors:
```bash
npm run seed:admin
```
Default credentials generated:
- **Email**: `admin@ishaanidental.com`
- **Password**: `Admin@123456`
