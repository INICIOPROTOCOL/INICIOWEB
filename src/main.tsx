import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeMetaPixel } from './utils/metaPixel'

// Initialize Meta Pixel if configured
initializeMetaPixel()

createRoot(document.getElementById("root")!).render(<App />);
