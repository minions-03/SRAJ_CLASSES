
# SRAJ Classes
 
**SRAJ Competitive Classes** — Expert Coaching for SSC, Banking, Railways & Police Exams
 
A full-stack educational web platform built to simplify online learning and classroom management for a competitive-exam coaching institute based in Bihar, India. The platform combines a public marketing site with a Learning Management System (LMS) for students and a management dashboard for admins.
 
🔗 **Live Site:** [sraj-classes-5j96.vercel.app](https://sraj-classes-5j96.vercel.app/)
 
---
 
## ✨ Overview
 
SRAJ Classes helps students preparing for SSC, Banking, Railway (RRB), and Police/Defense exams access course materials, track their learning progress, and interact with educational content through a clean, responsive interface. The site also serves as a marketing/admissions page for the institute.
 
## 🚀 Features
 
- **Landing Page** — Hero section, key stats (students placed, success rate, faculty count), and a call-to-action for admissions.
- **Course Programs** — Dedicated sections for:
  - SSC CGL / CHSL
  - Banking Exams (IBPS PO, Clerk, SBI, etc.)
  - Railway (RRB NTPC, Group D, etc.)
  - Police / Defense (State Police, CAPF, etc.)
- **Why Choose Us** — Highlights personalized mentorship, smart AI-powered test series, modern hybrid classrooms, and a weekly-updated curriculum.
- **Testimonials** — Success stories from selected students.
- **Contact Section** — Contact form, email, phone, and location details.
- **Student Login / LMS Portal** — Dedicated portal for enrolled students to access course content and track progress.
- **Admin Login / Management Dashboard** — Separate authenticated area for institute staff to manage classes, students, and content.
- **Responsive Design** — Optimized for both desktop and mobile.
## 🛠️ Tech Stack
 
- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** Modern responsive CSS / component-based UI
- **Deployment:** [Vercel](https://vercel.com/)
- **Fonts:** [Geist](https://vercel.com/font) via `next/font`
## 📁 Project Structure
 
```
SRAJ_CLASSES/
├── public/          # Static assets (images, icons, etc.)
├── src/             # Application source code (pages, components, LMS & admin logic)
├── proxy.js         # Proxy configuration
├── next.config.mjs  # Next.js configuration
├── eslint.config.mjs
├── jsconfig.json
├── package.json
└── postcss.config.mjs
```
 
## 🧑‍💻 Getting Started
 
### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine
- npm / yarn / pnpm / bun
### Installation
 
Clone the repository:
 
```bash
git clone https://github.com/minions-03/SRAJ_CLASSES.git
cd SRAJ_CLASSES
```
 
Install dependencies:
 
```bash
npm install
```
 
### Run the Development Server
 
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
 
Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.
 
You can start editing the app by modifying the files in `src/`. The page auto-updates as you edit.
 
## 🔑 Access Points
 
| Portal | URL |
|---|---|
| Public Website | `/` |
| Student Login (LMS) | `/student/login` |
| Admin Login (Management) | `/login` |
 

