#!/bin/bash

# GitHub token
GITHUB_TOKEN="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"

# Repository info
REPO_NAME="K-1-SDC"
REPO_DESCRIPTION="A responsive web application for managing conversations, built with React.js and Node.js, with Docker containerization."
USERNAME="robdspain"

echo "Creating GitHub repository $REPO_NAME..."

# Create the repository
curl -s -X POST -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"$REPO_DESCRIPTION\",\"private\":false}" > /dev/null

sleep 2
echo "Repository created successfully."

# Initialize git repository if not already initialized
if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
fi

# Configure git
echo "Configuring git..."
git config user.name "$USERNAME"
git config user.email "$USERNAME@users.noreply.github.com"

# Add all files
echo "Adding files to git..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "Initial commit to $REPO_NAME"

# Add the remote and push
echo "Setting up remote repository..."
git remote add origin https://github.com/$USERNAME/$REPO_NAME.git
# In case the remote already exists, set the URL
git remote set-url origin https://github.com/$USERNAME/$REPO_NAME.git

# Push to GitHub with token
echo "Pushing code to GitHub repository $REPO_NAME..."
git push -u -f https://$GITHUB_TOKEN@github.com/$USERNAME/$REPO_NAME.git main

echo "Repository created and code pushed successfully."
echo "View your repository at: https://github.com/$USERNAME/$REPO_NAME" 