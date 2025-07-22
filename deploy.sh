#!/bin/bash

echo "🏗️  Building Next.js application for GitHub Pages..."
npm run build

echo "📤 Deploying to gh-pages branch..."
git checkout --orphan gh-pages
git --work-tree out add --all
git --work-tree out commit -m "Deploy to GitHub Pages"
git push origin HEAD:gh-pages --force
git checkout main
git branch -D gh-pages

echo "🚀 Deployment complete!"
echo "Your app should be available at: https://cgrove-alt.github.io/mlb-sun-tracker/"