# Fix Netlify Submodule Error

## Issue

Netlify build is failing with the error:
```
fatal: No url found for submodule path 'conversation-app' in .gitmodules
```

## Solution Steps

### 1. Create a Repository for the Submodule

1. Go to [GitHub](https://github.com) and log in
2. Click the "+" button in the upper right corner and select "New repository"
3. Name the repository: `K-1-SDC-conversation-app`
4. Add a description: "Conversation app submodule for K-1-SDC project"
5. Keep it public
6. Click "Create repository"

### 2. Set Up the Conversation App Repository

Run these commands in the terminal:

```bash
# Navigate to the conversation-app directory
cd /Users/robspain/Desktop/TK-1-SDC\ Assessment\ Project/conversation-app

# Set up the remote (if you haven't already)
git remote add origin https://github.com/robdspain/K-1-SDC-conversation-app.git

# Push the code to the new repository
git add .
git commit -m "Initial commit for conversation app submodule"
git push -u origin main
```

### 3. Set Up the Submodule in the Main Repository

```bash
# Navigate to the main project directory
cd /Users/robspain/Desktop/TK-1-SDC\ Assessment\ Project

# Create or update the .gitmodules file
echo '[submodule "conversation-app"]
	path = conversation-app
	url = https://github.com/robdspain/K-1-SDC-conversation-app.git' > .gitmodules

# Add and commit the .gitmodules file
git add .gitmodules
git commit -m "Add conversation-app submodule configuration"
git push origin main

# Initialize and update the submodule
git submodule init
git submodule update
```

### 4. Update Your Netlify Build Settings

- In Netlify settings, ensure that Git submodules are checked out during the build process.
- Navigate to Site settings > Build & deploy > Environment > Edit settings
- Add environment variable: `GIT_LFS_ENABLED=true`
- Enable the "Use Git Submodules" option in the Netlify project settings.

After completing these steps, trigger a new Netlify deployment to see if the issue is resolved. 