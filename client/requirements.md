## Packages
@react-three/fiber | 3D rendering engine for the game world
@react-three/drei | Helpers for Three.js (Text, useTexture, etc.)
three | Core 3D library
zustand | Game state management (performance critical)
framer-motion | UI animations and overlays

## Notes
The game uses a hybrid approach:
- Three.js/Fiber for the 3D runner mechanics (performance).
- Framer Motion for the HUD and overlay UI (cinematic feel).
- LocalStorage used for persisting character images and high scores locally first, then syncing to DB if needed.
- No complex auth required for this version, simple name entry.
