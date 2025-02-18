# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Firebase Config
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_APP_ID=your_firebase_app_id

# Firebase Admin (Service Account)
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Google provider
3. Generate a new private key from Project Settings > Service Accounts
4. Add the credentials to your `.env` file

## Deployment

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Deploy:
```bash
npm run build
firebase deploy