# NomadHub 🍔

**NomadHub** is an AI-powered SaaS platform tailored specifically for mobile F&B businesses, such as food trucks, pop-up stalls, and street food vendors. It provides a modern, clean, and mobile-first interface to help vendors manage their menus via AI and streamline their customer queues.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, v15+)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: TypeScript
- **Deployment Ready**: Fully containerized with a multi-stage `Dockerfile` (optimized for Google Cloud Run / Next.js standalone mode).
- **Design System**: Custom minimalist, bright light-mode aesthetic (Sky Blue & Emerald Green accents) using Glassmorphism.

## ✨ Features Currently Implemented

### 1. Landing Page (`/`)
- A clean, modern hero section explaining the platform's value proposition to F&B owners.
- Quick navigation to the Vendor Dashboard and the Customer Smart Queue demo.

### 2. Vendor Dashboard (`/vendor`)
- **Live Overview**: Displays a real-time (mocked) active queue counter with dynamic pulse animations.
- **Store Status**: A prominent "Open / Closed" toggle for vendors to control their availability.
- **Quick Actions**: Easy access to other modules like the AI Menu Manager.

### 3. AI Menu Manager (`/vendor/menu`)
- **Smart Image Upload**: Features a custom drag-and-drop image upload area (`ImageUploader` component).
- **AI Processing Simulation**: Once a food photo is uploaded, a slick visual scanning animation simulates the AI analyzing the image.
- **Auto-Fill Data**: After processing, it automatically generates and populates the dish's Title, a mouth-watering Description, and a Suggested Price.

### 4. Customer Smart Queue (`/queue`)
- **Digital Queueing**: A public-facing, mobile-first page for customers.
- **Interactive Experience**: Clicking "Join Queue" triggers an AI calculation delay.
- **Live Updates**: Displays the customer's assigned queue number and a dynamic "AI-Estimated Wait Time" that ticks down automatically.

## 🛠️ Getting Started

### Prerequisites
Make sure you have Node.js installed (v18+ recommended).

### Installation & Running Locally

1. Install the dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Build (For Cloud Run)

To build the container image:
```bash
docker build -t nomadhub .
```

To run the container locally:
```bash
docker run -p 3000:3000 nomadhub
```

## 🧠 Brainstorming / Next Steps
Use this foundation to plan further integrations! Potential ideas:
- Integrating a real AI model (e.g., Google Cloud Vision, OpenAI Vision) into the Menu Manager.
- Adding a real-time database (e.g., Firebase, Supabase) to sync the queue between the Vendor Dashboard and the Customer Queue.
- Adding Auth for Vendors.
