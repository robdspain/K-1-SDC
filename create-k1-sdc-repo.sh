#!/bin/bash

# GitHub token
# DO NOT HARDCODE YOUR TOKEN HERE
# Instead, load it from .env or environment variables
if [ -f .env ]; then
  source .env
fi

if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GITHUB_TOKEN not found in environment or .env file."
  echo "Please set your GitHub token in the .env file or as an environment variable."
  exit 1
fi

# Repository info
REPO_NAME="K-1-SDC"
REPO_DESCRIPTION="TK and K-1 Student Data Collection and Assessment Tool"
USERNAME="robdspain"

echo "Creating GitHub repository $REPO_NAME..."

# Create the repository
curl -s -X POST -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"$REPO_DESCRIPTION\",\"private\":false}"

sleep 2
echo "Repository created successfully."

# Initialize git repository if not already initialized
if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
  git add .
  git commit -m "Initial commit"
fi

# Configure git
echo "Configuring git..."
git config user.name "$USERNAME"
git config user.email "$USERNAME@users.noreply.github.com"

# Add README if it doesn't exist
if [ ! -f README.md ]; then
  echo "# $REPO_NAME" > README.md
  echo "TK and K-1 Student Data Collection and Assessment Tool" >> README.md
  echo "" >> README.md
  echo "This application helps TK and K-1 teachers manage student assessments and data collection." >> README.md
  git add README.md
  git commit -m "Add README"
fi

# Set main branch if not already set
git branch -M main

# Push to GitHub with token
echo "Pushing code to GitHub repository $REPO_NAME..."
git push -u -f https://$USERNAME:$GITHUB_TOKEN@github.com/$USERNAME/$REPO_NAME.git main

echo "Repository created and code pushed successfully."
echo "View your repository at: https://github.com/$USERNAME/$REPO_NAME" 