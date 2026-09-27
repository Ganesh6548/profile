# Mainframe Creative Agency Landing Page

A full-screen hero landing page built with React, TypeScript, Vite, and Tailwind CSS. Features mouse-controlled video scrubbing, typewriter animations, and responsive design.

## Features

- **Background Video with Mouse Scrubbing**: Horizontal mouse movement controls video playback
- **Typewriter Animation**: Smooth character-by-character text reveal with custom hook
- **Responsive Design**: Mobile hamburger menu, adaptive layouts
- **Interactive Elements**: 
  - Copy-to-clipboard email button
  - Hover effects on all buttons
  - Smooth fade-in animations for action buttons
- **Custom Fonts**: Helvetica Now Display fonts loaded from CDN
- **Tailwind CSS**: Utility-first styling for rapid development

## Project Structure

```
.
├── index.html              # Main HTML entry point
├── main.tsx               # React app entry point
├── mainframe-landing.tsx  # Main component with all features
├── index.css              # Global styles & Tailwind directives
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

### Installation

1. **Clone or extract the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Replace the video URL** (Optional)
   
   The landing page uses a video URL by default. If you want to use your own video:
   - Host your video file (e.g., on Cloudinary, S3, Vercel, or your own server)
   - Update the `src` attribute in `mainframe-landing.tsx` (line with `<source src="..."`)
   
   To use your uploaded video file:
   ```
   <source src="YOUR_VIDEO_URL" type="video/mp4" />
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This generates optimized files in the `dist/` folder ready for deployment.

## Key Features Explained

### Mouse Scrubbing Video Control

The video responds to horizontal mouse movement:
- Move mouse **right** → advances video forward
- Move mouse **left** → rewinds video
- Sensitivity can be adjusted via the `SENSITIVITY` constant (default: 0.8)

### Typewriter Effect

The `useTypewriter` hook:
- Takes `text`, `speed` (ms per character), and `startDelay`
- Returns `{ displayed, done }` for tracking animation state
- Displays a blinking cursor while typing
- Cursor disappears when animation completes

### Action Buttons

Four white pill buttons and one outline button with:
- Smooth hover transitions (color and background)
- Fade-in + slide-up animation (400ms after page load)
- Independent of typewriter animation timing
- Copy-to-clipboard functionality on email button

### Responsive Design

- **Mobile**: Stack layout, hamburger menu, larger touch targets
- **Desktop**: Multi-column layout, full navigation bar
- Breakpoint: `md` (768px)

## Customization

### Changing Colors

Update Tailwind classes in `mainframe-landing.tsx`:
- `bg-white` → background color
- `text-black` → text color
- `hover:opacity-60` → hover effects

### Adjusting Video Speed

Modify the `SENSITIVITY` constant in `mainframe-landing.tsx`:
```tsx
const sensitivity = 0.8; // Increase for faster scrubbing
```

### Modifying Text Content

Update strings directly in the component:
- Logo: "Mainframe®"
- Intro label: "Hey there, meet A.R.I.A..."
- Typewriter text: "Glad you stopped in..."
- Button labels and links

### Font Customization

The fonts are loaded from CDN in `index.html`. To change:
1. Update the `<link>` tags in `index.html`
2. Update the CSS variables in `index.css`

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full responsive support

## Performance Tips

- Video file should be optimized (H.264 codec recommended)
- Consider lazy-loading above-the-fold content
- Use `preload="auto"` on video (already set)
- Minify production builds with `npm run build`

## Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Troubleshooting

**Video not showing:**
- Check CORS if using external video URL
- Ensure video format is H.264 MP4
- Verify `<source>` tag has correct URL

**Fonts not loading:**
- Check CDN links are accessible
- Clear browser cache
- Verify font names match CSS variables

**Mobile menu not working:**
- Ensure JavaScript is enabled
- Check breakpoint settings in Tailwind

## Dependencies

- **react**: UI library
- **react-dom**: React DOM rendering
- **tailwindcss**: Utility-first CSS framework
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **autoprefixer**: CSS vendor prefixes

## License

This project is ready for commercial use.

## Support

For issues or questions about the implementation, refer to the code comments in `mainframe-landing.tsx`.
