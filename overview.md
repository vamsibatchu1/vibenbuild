# Vibe N Build - Project Overview

## 1. Introduction
**Vibe N Build** is a digital portfolio and experiment gallery designed to showcase a "52 weeks, 52 apps" challenge. The application serves as a dynamic showcase for various creative coding experiments, combining a high-fidelity frontend with a content management system for easy administration.

## 2. Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Backend/Persistence:**
  - **Firestore:** Stores user-submitted ideas and email subscriptions.
  - **Local Filesystem (JSON):** Stores experiment data (`experiments.json`) and WIP ideas (`wip-ideas.json`).
  - **Local Filesystem (Assets):** Stores uploaded images and videos in the `public` directory.
- **Deployment:** Firebase Hosting (via `npm run deploy` which performs `next build` export).

## 3. Core Capabilities

### A. Experiments Gallery (`/allexperiments`)
The main feature of the application is an immersive, horizontal-scrolling gallery of digital experiments.

*   **User Interface:**
    *   **Desktop:** Horizontal scrolling layout with a "Welcome" column, distinct "Experiment" columns, and an "Exit" column.
    *   **Mobile:** Vertical scrolling layout with a sticky navigation bar and a hamburger menu for quick access.
    *   **Pixel Art:** Includes an animated pixel art component for visual flair.

*   **Experiment Detail View:**
    *   **Metadata:** Displays Title, ID, Tags, Token counts, and Links.
    *   **Content:** Rich text descriptions and a gallery of images (automatically fetched based on naming convention).
    *   **Video:** Supports video playback in a modal overlay.

*   **Interactive Columns:**
    *   **Welcome Column:** Introductory visual.
    *   **Exit Column:**
        *   **"Keep Reading":** Displays a list of "Work in Progress" ideas.
        *   **Idea Submission:** Allows users to submit their own ideas for future experiments (saved to Firestore `ideas` collection).
        *   **Newsletter:** Email subscription form (saved to Firestore `subscribers` collection).
        *   **"About Me":** Section with social and contact links.

### B. Admin Panel (`/admin`)
A protected interface for managing the content of the portfolio without touching the code.

*   **Authentication:**
    *   Simple password-based protection (validated via `/api/admin/auth`).

*   **Experiment Management:**
    *   **CRUD Operations:** Create, Read, Update, and Delete experiments.
    *   **JSON Persistence:** Changes are saved directly to `app/allexperiments/experiments.json` via the `/api/admin/save-experiments` endpoint.
    *   **Asset Management:**
        *   **Image Upload:** Uploads images to `public/images/experiments2/`. Naming convention: `[exp-number]-[image-number].webp`.
        *   **Video Upload:** Uploads videos to `public/videos/` (inferred).
        *   **Tag Management:** Add/Remove tags for each experiment.

*   **WIP Ideas Management:**
    *   Add, edit, and remove "Work in Progress" ideas.
    *   Changes saved to `app/allexperiments/wip-ideas.json`.

*   **Workflow Note:**
    Since the Admin panel writes to the local filesystem (JSON files and `public` assets), it is likely designed to be **run locally**. Content updates are made via the Admin UI on a local machine, committed to Git, and then deployed to the live site.

## 4. Data Structure

### Local JSON Data
*   **`experiments.json`**: Primary database for projects. Contains:
    *   `id` (e.g., "exp-01")
    *   `title`
    *   `tags` (Array of strings)
    *   `tokens` (Number)
    *   `link` (External URL)
    *   `text` (Description)
    *   `images` (Array of indices)
    *   `video` (Filename)
*   **`wip-ideas.json`**: Simple array of strings for upcoming project concepts.

### Firestore Collections
*   **`ideas`**: User-submitted suggestions.
    *   Fields: `idea`, `submittedAt`
*   **`subscribers`**: Email newsletter signups.
    *   Fields: `email`, `subscribedAt`

## 5. Deployment
The project is configured for static export (`next build` -> `out` directory) and deployment to Firebase Hosting.
- **Command:** `npm run deploy` (Runs `next build` followed by `firebase deploy`)
