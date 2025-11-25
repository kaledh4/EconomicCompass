# Hunch Machine (GitHub Pages Edition)

This is a self-hosted, 100% free version of the Hunch Machine crypto investment insight tool.
It runs automatically on GitHub Actions and hosts the result on GitHub Pages.

## Features
- **Daily Market Insight**: AI-generated report on Macro, Crypto, and TASI markets.
- **Free Data**: No paid APIs required (Yahoo Finance, etc.).
- **Zero Cost Hosting**: Uses GitHub Actions (Free Tier) and GitHub Pages.
- **Premium UI**: Dark mode, glassmorphism design.

## Setup Instructions

### 1. Push to GitHub
1.  Create a new repository on GitHub (e.g., `hunch-machine`).
2.  Push this code to the repository:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/hunch-machine.git
    git push -u origin main
    ```

### 2. Configure Secrets
1.  Go to your GitHub Repository Settings -> **Secrets and variables** -> **Actions**.
2.  Click **New repository secret**.
3.  Name: `OPENROUTER_API_KEY`
4.  Value: Your OpenRouter API Key (starts with `sk-or-v1-...`).

### 3. Enable GitHub Pages
1.  Go to Settings -> **Pages**.
2.  Under **Build and deployment**, select **Source** as `Deploy from a branch`.
3.  (Note: The Action will automatically create a `gh-pages` branch. You might need to run the action once manually first).
4.  Once the Action runs successfully, select `gh-pages` branch and `/ (root)` folder.

### 4. Run Manually (First Time)
1.  Go to the **Actions** tab in your repo.
2.  Select **Daily Market Update** on the left.
3.  Click **Run workflow**.
4.  Wait for it to finish (green checkmark).
5.  Your site will be live at `https://YOUR_USERNAME.github.io/hunch-machine/`.

## Local Development
1.  Install dependencies: `pip install -r requirements.txt`
2.  Set `OPENROUTER_API_KEY` in `.env`.
3.  Run build script: `python build.py`
4.  Open `public/index.html` in your browser.
