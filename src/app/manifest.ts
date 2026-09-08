import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MediKiosk',
    short_name: 'MediKiosk',
    description: 'AI-Powered Triage and OPD Optimization System',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f4b3e',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/jpeg',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/jpeg',
      }
    ],
  }
}
