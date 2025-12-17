# Frontend Setup Instructions

## Environment Configuration

Create a `.env.local` file in the root of the hackathon-frontend directory with the following content:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

This file is gitignored and will not be committed to the repository.

## Running the Frontend

1. Install dependencies:
```bash
npm install
```

2. Create the `.env.local` file as described above

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Backend Requirements

The frontend expects the backend API to be running at `http://localhost:8000/api` (or the URL specified in `NEXT_PUBLIC_API_URL`).

Ensure the backend is running before starting the frontend.



