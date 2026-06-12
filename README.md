# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Getting Started

This project consists of a frontend (React/Vite) and a backend (FastAPI). Follow the steps below to set up both.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Python](https://www.python.org/) (version 3.11.9)

### Backend Setup

1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Navigate to the backend directory:
   ```bash
   cd src/components/graph/backend
   ```
3. Start the backend server:
   ```bash
   python backend.py
   ```
   The backend will run on `http://localhost:8000` by default.

### Frontend Setup

1. Install Node.js dependencies:
   ```bash
   npm install
   ```
2. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` by default.

### Environment Variables

The backend requires a `.env` file in the `src/components/graph/backend` directory with the following variable:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   (A sample `.env` file is already present in the backend directory.)

The frontend can be configured via the `VITE_API_URL` environment variable. Create a `.env` file in the project root to override the default API URL:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```
   (This is the default, so it is only necessary if you change the backend URL or port.)

### Production Build

To build the frontend for production:
   ```bash
   npm run build
   ```
   The built files will be in the `dist` directory.

To build the backend for production, you can use a production ASGI server like `uvicorn` or `gunicorn`:
   ```bash
   uvicorn src.components.graph.backend.backend:app --host 0.0.0.0 --port 8000
   ```
