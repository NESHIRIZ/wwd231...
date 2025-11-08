# Dar Salam Chamber — Local Preview

Available preview options:

1) Quick open in default browser (no install)
   - In VS Code: open Command Palette → Tasks: Run Task → "Open index.html in default browser"
   - Or run in PowerShell (from project root):
     Start-Process 'c:\Users\Admin\Downloads\wdd231-2\index.html'

2) Live-reload server (recommended)
   - Install dependencies once:
     npm install
   - Start server:
     npm start
   - Open http://127.0.0.1:5500 (live-server opens index.html automatically)

Notes:
- The project uses inline SVGs and local images in `/images`. No external Font Awesome kit required.
- Tasks assume Windows (PowerShell). Adjust if using another OS.