# FUTU Booking Frontend

A modern React frontend for the FUTU booking system built with Vite, TypeScript, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Vite** - Fast build tool and dev server
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The app will be running on `http://localhost:5173`

### Building for Production

Build the app for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── api/           # API layer and HTTP requests
├── components/    # Reusable UI components
├── pages/         # Page components
├── styles/        # Global styles and Tailwind
├── App.tsx        # Main app component
├── main.tsx       # Entry point
└── index.css      # Tailwind imports
```

## API Configuration

The frontend is configured to connect to the backend at:
- **Base URL**: `http://localhost:8080/api`

Available API endpoints are configured in `src/api/index.ts`:

- Bookings: CRUD operations
- Payments: Start payment and webhooks
- Availability: Check room availability

## Features

- ✅ TypeScript support
- ✅ Tailwind CSS configured
- ✅ Framer Motion animations
- ✅ API layer ready
- ✅ Component structure
- ✅ Responsive design

## Development Notes

- The dev server runs on port 5173
- Hot reload is enabled
- ESLint is configured for code quality
- The project is independent from the Spring Boot backend
