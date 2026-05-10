feat: initialize NomadHub core infrastructure and foundational UI features

This commit establishes the foundational architecture and primary user interfaces for the NomadHub SaaS platform, tailored for mobile F&B businesses.

Key additions:
- Core Platform: Next.js App Router setup with Tailwind CSS v4 and a fresh, minimalist light-mode design system.
- Landing Page (/): Introductory page highlighting platform value propositions.
- Vendor Dashboard (/vendor): Live queue tracking and store availability management controls.
- AI Menu Manager (/vendor/menu): Simulated AI image processing workflow for automated menu creation.
- Customer Smart Queue (/queue): Public-facing queue management with mock AI-driven wait time estimation.
- Containerization: Added multi-stage Dockerfile, .dockerignore, and Next.js standalone configuration for Google Cloud Run deployment.
