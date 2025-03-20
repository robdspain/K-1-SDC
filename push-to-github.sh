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
REPO_NAME="K1-SDC"

# Create a new repository if it does not exist already
echo "Creating GitHub repository if it does not exist..."
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
     -H "Accept: application/vnd.github+json" \
     -H "X-GitHub-Api-Version: 2022-11-28" \
     https://api.github.com/user/repos \
     -d "{\"name\":\"$REPO_NAME\",\"description\":\"A responsive web application for managing conversations, built with React.js and Node.js, with Docker containerization.\"}"

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

# Push to GitHub
echo "Pushing to GitHub..."
git remote add origin "https://robdspain:$GITHUB_TOKEN@github.com/robdspain/$REPO_NAME.git" || git remote set-url origin "https://robdspain:$GITHUB_TOKEN@github.com/robdspain/$REPO_NAME.git"
git push -u origin main || git push -u origin master

echo "Done!" 