# Fix Netlify Submodule Deployment Error

## Problem

Your Netlify deployment is failing with the following error:

```
Error checking out submodules: Submodule 'conversation-app' (https://github.com/robdspain/K-1-SDC-conversation-app.git) registered for path 'conversation-app'
Cloning into '/opt/build/repo/conversation-app'...
fatal: could not read Username for 'https://github.com': No such device or address
```

This indicates that Netlify cannot access the submodule repository.

## Solutions

### Option 1: Make the Submodule Repository Public

If the repository isn't sensitive, the simplest solution is to make it public.

1. Go to your GitHub repository: https://github.com/robdspain/K-1-SDC-conversation-app
2. Navigate to Settings > General
3. Scroll down to the "Danger Zone" section
4. Click "Change visibility" and select "Public"
5. Confirm the change
6. Trigger a new Netlify deployment

### Option 2: Use SSH URL for the Submodule

Change the submodule URL from HTTPS to SSH format:

1. Edit your `.gitmodules` file:

```bash
# From your main repository directory
git config -f .gitmodules submodule.conversation-app.url git@github.com:robdspain/K-1-SDC-conversation-app.git
git submodule sync
git commit -am "Update submodule URL to SSH format"
git push origin main
```

### Option 3: Configure Netlify with GitHub Access Token

1. Generate a GitHub Personal Access Token:
   - Go to GitHub > Settings > Developer settings > Personal access tokens
   - Create a new token with `repo` scope
   - Copy the token

2. Add the token to Netlify:
   - Go to your Netlify site's dashboard
   - Navigate to Site settings > Build & deploy > Environment
   - Add a new environment variable: `GH_TOKEN` with your GitHub token as the value

3. Update your Netlify build settings to use the token:
   - Go to Site settings > Build & deploy > Continuous Deployment
   - Enable "Use GitHub App for Cloning"

### Option 4: Include Submodule Contents Directly

If you're having trouble with the submodule approach, you can include the contents directly:

1. Remove the submodule:
```bash
git submodule deinit -f conversation-app
git rm -f conversation-app
git commit -m "Remove conversation-app submodule"
```

2. Copy the contents directly:
```bash
# Clone the submodule repository
git clone https://github.com/robdspain/K-1-SDC-conversation-app.git temp-conversation-app

# Copy the contents (excluding the .git directory)
cp -r temp-conversation-app/ conversation-app/
rm -rf temp-conversation-app

# Add the contents to your main repository
git add conversation-app
git commit -m "Add conversation-app contents directly"
git push origin main
```

## Verify Deployment

After implementing one of these solutions:

1. Go to your Netlify dashboard
2. Navigate to the "Deploys" section
3. Click "Trigger deploy" > "Deploy site"
4. Monitor the build logs to ensure the submodule is being properly accessed

## Additional Netlify Submodule Settings

Ensure you have the correct settings in your Netlify configuration:

1. Go to Site settings > Build & deploy > Environment
2. Add the variable: `GIT_LFS_ENABLED=true`
3. Navigate to Site settings > Build & deploy > Continuous Deployment
4. Check "Fetch submodules" if it's available 