#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  source .env
fi

# Set repository variables
REPO_NAME="K-1-SDC"
USERNAME="robdspain"

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GITHUB_TOKEN not found in .env file."
  echo "Please add your GitHub token to the .env file."
  exit 1
fi

# Check if repository exists
echo "Checking if repository exists..."
REPO_EXISTS=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $GITHUB_TOKEN" \
  "https://api.github.com/repos/$USERNAME/$REPO_NAME")

if [ "$REPO_EXISTS" != "200" ]; then
  echo "Repository does not exist. Creating repository..."
  # Create repository
  curl -H "Authorization: Bearer $GITHUB_TOKEN" \
    -d "{\"name\":\"$REPO_NAME\", \"private\":false, \"description\":\"TK and K-1 Student Data Collection and Assessment Tool\"}" \
    https://api.github.com/user/repos
fi

# Initialize git if not already done
if [ ! -d .git ]; then
  echo "Initializing git repository..."
  git init
  git config user.name "$USERNAME"
  git config user.email "$USERNAME@users.noreply.github.com"
fi

# Add all files that are not in .gitignore
git add .

# Commit changes
git commit -m "Update application code"

# Set up remote or update it
if git remote | grep -q origin; then
  git remote set-url origin "https://$USERNAME:$GITHUB_TOKEN@github.com/$USERNAME/$REPO_NAME.git"
else
  git remote add origin "https://$USERNAME:$GITHUB_TOKEN@github.com/$USERNAME/$REPO_NAME.git"
fi

# Push to GitHub
git push -u origin main || git push -u origin master

echo "Code pushed to GitHub successfully!" 