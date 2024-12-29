# OBS Overlay with Super-Chat and Branding

## Overview

A professional streaming overlay solution that integrates super-chat message displays with OBS. This project provides streamers with a customizable overlay system featuring live super-chat messages and a "Powered-by Fanverz" banner.

## Features

- Real-time super-chat message display
- Customizable message animations and styles
- Professional "Powered by Fanverz" branding integration
- Easy setup with OBS Browser Source
- Responsive design that adapts to any resolution
- Low-latency message updates
- Desktop application for easy control

## Setup Instructions

### Step 1: Clone the Repository
```
git clone https://github.com/IamGodseye/browser-overlay.git
cd browser-overlay
```

### Step 2: Install Dependencies
```bash
# Install all dependencies
npm install

# For development
npm start

# Build desktop application
# For Windows
npm run build -- --win --x64
npm run build -- --win --ia32


# For macOS
npm run build -- --mac

# For Linux
npm run build -- --linux
```

The built application will be available in the `dist` folder.

### Step 3: OBS Configuration
1. Open OBS Studio
2. Add a new Browser Source
3. Set the URL to: http://localhost:3000/overlay
4. Adjust dimensions to match your stream layout

### Demo:

Checkout the demo video [here](demo/obs-overlay-demo.mp4)

## Project Structure

```
obs-overlay/
├── public/                 # Frontend assets
│   └── overlay.html        # Main overlay template
├── server.js              # Backend server
├── package.json           # Project dependencies
└── README.md             # Documentation
```

## Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch
```
git checkout -b feature-name
```
3. Commit your changes
```
git commit -m "Description of changes"
```
4. Push to your branch
```
git push origin feature-name
```
5. Submit a pull request



## Troubleshooting

If you encounter issues:
1. Verify the server is running
2. Check browser source URL
3. Confirm all dependencies are installed
4. Review browser console for errors
