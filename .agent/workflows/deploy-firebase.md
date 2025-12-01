---
description: Deploy NBA app to Firebase Hosting
---

# Deploy to Firebase Hosting

This workflow guides you through deploying your NBA application to Firebase Hosting.

## Prerequisites
- You need a Google account
- You should have a Firebase project created (or we'll create one)

## Steps

### 1. Install Firebase CLI globally
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase with your Google account
```bash
firebase login
```
This will open a browser window for you to authenticate with your Google account.

### 3. Initialize Firebase in your project
```bash
firebase init hosting
```
When prompted:
- **Select or create a Firebase project**: Choose an existing project or create a new one
- **What do you want to use as your public directory?**: Enter `dist`
- **Configure as a single-page app (rewrite all urls to /index.html)?**: Yes
- **Set up automatic builds and deploys with GitHub?**: No (unless you want CI/CD)
- **File dist/index.html already exists. Overwrite?**: No

### 4. Build your application for production
```bash
npm run build
```

### 5. Deploy to Firebase
```bash
firebase deploy
```

### 6. Access your deployed app
After deployment completes, Firebase will provide you with a hosting URL like:
`https://your-project-id.web.app` or `https://your-project-id.firebaseapp.com`

## Future Deployments
After the initial setup, you only need to run:
```bash
npm run build
firebase deploy
```

## Optional: Custom Domain
You can add a custom domain through the Firebase Console:
1. Go to Firebase Console > Hosting
2. Click "Add custom domain"
3. Follow the instructions to verify and configure DNS
