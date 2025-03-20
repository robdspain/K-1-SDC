#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo "Error: .env file not found."
  exit 1
fi

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GITHUB_TOKEN not found in .env file."
  exit 1
fi

# GitHub username
GITHUB_USERNAME="robdspain"

# Repository name
REPO_NAME="conversation-app-docker"

# Create a new repository if it does not exist already
echo "Creating GitHub repository if it does not exist..."
curl -H "Authorization: token $GITHUB_TOKEN" \
     -d "{\"name\":\"$REPO_NAME\",\"description\":\"A responsive conversation web application built with React.js and Node.js, containerized with Docker\",\"private\":false}" \
     https://api.github.com/user/repos

# Set up git configuration
git config user.name "Rob Spain"
git config user.email "rob.spain@example.com"  # Replace with your actual email

# Initialize git if not already initialized
if [ ! -d .git ]; then
  git init
fi

# Add all files to git
git add .

# Commit changes
git commit -m "Dockerized conversation app"

# Add GitHub as remote with token authentication
git remote rm origin 2>/dev/null || true
git remote add origin https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin main || git push -u origin master

echo "Done!" 