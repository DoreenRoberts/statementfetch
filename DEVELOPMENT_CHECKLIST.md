# StatementHub Development Environment Checklist

## Prerequisites
- [ ] Node.js version 18+ installed (`node --version`)
- [ ] npm or yarn package manager
- [ ] Git installed and configured

## Terminal Setup & Commands

### 1. Initial Setup
```bash
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# Install dependencies (run this first!)
npm install

# Clear npm cache if having issues
npm cache clean --force
```

### 2. Development Server
```bash
# Start development server
npm run dev

# Should show:
# ➜  Local:   http://localhost:5173/
# ➜  Network: http://[your-ip]:5173/
```

### 3. Build & Preview
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Build in development mode
npm run build:dev
```

## Browser Settings
- [ ] Open http://localhost:5173 (NOT preview URL)
- [ ] Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- [ ] Disable browser extensions temporarily
- [ ] Open Developer Tools (F12) and check Console tab for errors

## Common Issues & Solutions

### White/Blank Page
1. Check terminal for compilation errors
2. Check browser console for JavaScript errors
3. Verify all dependencies installed: `npm install`
4. Clear browser cache completely
5. Try incognito/private browsing mode

### Port Issues
```bash
# If port 5173 is busy, kill the process:
# On Mac/Linux:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
# Then: taskkill /PID <PID_NUMBER> /F
```

### CSS Not Loading
- [ ] Check if Tailwind CSS is working
- [ ] Verify postcss.config.js exists
- [ ] Check tailwind.config.ts configuration

## File Structure Check
- [ ] src/main.tsx exists and imports App
- [ ] src/App.tsx exists
- [ ] src/index.css exists
- [ ] index.html exists in root

## Environment Variables
- [ ] Copy .env.example to .env if needed
- [ ] Set up Supabase credentials if using database features

## Debugging Steps
1. **Terminal Output**: Look for compilation errors
2. **Browser Console**: Check for JavaScript errors
3. **Network Tab**: Verify all assets are loading
4. **Elements Tab**: Check if HTML is rendering

## Quick Fix Commands
```bash
# Complete reset
rm -rf node_modules package-lock.json
npm install
npm run dev

# Force clear everything
npm cache clean --force
rm -rf dist
npm run build
npm run dev
```

## Success Indicators
- [ ] Terminal shows "Local: http://localhost:5173/"
- [ ] Browser shows StatementHub interface (not blank)
- [ ] No errors in browser console
- [ ] CSS styles are applied correctly