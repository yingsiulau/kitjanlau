#!/bin/bash

# Replace with your actual repository name and GitHub username
REPO_NAME="kitjanlau"
USERNAME="yingsiulau"

# Build the Angular project with the production configuration
ng build --configuration production --output-path=docs --base-href=/${REPO_NAME}/

# Create a .nojekyll file
touch docs/.nojekyll

# Add a CSP-compatible meta tag in the index.html file, allowing inline scripts (use cautiously)
sed -i '' 's|<head>|<head>\n  <meta http-equiv="Content-Security-Policy" content="default-src '\''self'\''; script-src '\''self'\'' '\''unsafe-inline'\'' https://${USERNAME}.github.io;"><meta name="description" content="Project description">|' docs/index.html

# Commit and push to GitHub
git add docs
git commit -m "Deploy Angular project to GitHub Pages"
git push origin main

echo "Deployment complete. Visit https://${USERNAME}.github.io/${REPO_NAME}/ to see your site."
