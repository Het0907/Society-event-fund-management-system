# Society Event Fund Management System

## About
This project is a full-stack web application for managing society or community event finances. It helps you:
- Track events and their financial details
- Manage members and their contributions
- Record and analyze expenses
- Download Excel reports for each event
- Use the app easily on both desktop and mobile devices

## Features
- Add, edit, and view society members
- Create events and track all related contributions and expenses
- Responsive UI for mobile and desktop
- Download detailed Excel reports for any event
- Secure: sensitive data (like .env) and dependencies are not pushed to GitHub

## How to Use

### 1. Clone the repository
```
git clone <your-repo-url>
cd Socient-event-fund-management-system
```

### 2. Install dependencies
Install for both backend and frontend:
```
cd Backend
npm install
cd ../frontend
npm install
```

### 3. Set up environment variables
- Create a `.env` file in both `Backend` and `frontend` folders.
- Add your MongoDB URI and any other required secrets.

Example for Backend `.env`:
```
MONGODB_URI=your_mongodb_connection_string
PORT=4000
```

### 4. Run the app locally
- Start the backend:
```
cd Backend
npm start
```
- Start the frontend:
```
cd ../frontend/Event
npm run dev
```
- Open the frontend URL (usually http://localhost:5173 or similar) in your browser.

### 5. Build for production
- Frontend: `npm run build` in `frontend/Event`.
- Backend: Deploy to your server or cloud platform.

## Deployment
- Make sure `.env` and `node_modules/` are not pushed to GitHub (see `.gitignore`).
- You can deploy the backend and frontend together or separately (see deployment instructions in this repo or ask for platform-specific help).

## License
MIT