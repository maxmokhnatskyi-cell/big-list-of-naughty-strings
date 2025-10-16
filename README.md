# Issue Card Prototype

A simple web prototype featuring a modal form for creating issue cards, built with Vite.

## Features

- 🎨 Modern, clean UI with smooth animations (based on Figma design)
- 💳 Card type selection modal (Physical/Virtual)
- 🎭 Rive animation support
- ⚡ Fast development with Vite
- 📱 Responsive design
- 🎯 Interactive card selection with visual feedback

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will open automatically at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
issueCard/
├── src/
│   ├── main.js          # Main JavaScript file
│   └── style.css        # Styles
├── public/
│   └── animations/      # Store Rive animation files here (.riv)
├── index.html           # Main HTML file
├── vite.config.js       # Vite configuration
└── package.json         # Dependencies
```

## Adding Rive Animations

1. Place your `.riv` animation files in the `public/animations/` folder
2. Uncomment the Rive initialization code in `src/main.js`
3. Update the `src` path to point to your animation file
4. Configure the state machine name if needed

Example:
```javascript
const riveInstance = new Rive({
  src: '/animations/your-animation.riv',
  canvas: document.getElementById('rive-canvas'),
  autoplay: true,
  stateMachines: 'State Machine 1',
});
```

## Technologies

- [Vite](https://vitejs.dev/) - Build tool
- [Rive WebGL2](https://rive.app/) - Interactive animations with advanced features (Feathers support)
- Vanilla JavaScript
- CSS3

## License

MIT

# issueCard
