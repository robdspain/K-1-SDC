# GitHub Repository Setup Instructions

## Generate a New Personal Access Token

1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click "Generate new token" (classic)
3. Note: "K1-SDC Repository Access"
4. Select scopes:
   - [x] repo (Full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** - you won't be able to see it again!

## Create and Push the Repository

Run these commands in your terminal, replacing `YOUR_NEW_TOKEN` with the token you just generated:

```bash
# Set your GitHub username
GITHUB_USERNAME="robdspain"
# Set the repository name
REPO_NAME="K1-SDC"
# Your new token
GITHUB_TOKEN="YOUR_NEW_TOKEN"

# Create the repository
curl -X POST -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"A responsive web application for managing conversations, built with React.js and Node.js, with Docker containerization.\",\"private\":false}"

# Configure git (if not already done)
git config user.name "$GITHUB_USERNAME"
git config user.email "$GITHUB_USERNAME@users.noreply.github.com"

# Update remote URL with your new token
git remote set-url origin https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git

# Push to GitHub
git push -u origin main
```

## Verify Repository

After pushing, your repository should be available at:
https://github.com/robdspain/K1-SDC 