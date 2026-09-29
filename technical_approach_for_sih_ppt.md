# Technical Approach: MediKiosk (AYUSH Healthcare App)

This document outlines the technical architecture, key features, and methodologies used to build the MediKiosk application. It is designed to be easily copy-pasted into your Smart India Hackathon (SIH) PowerPoint presentation.

---

## 1. Project Overview & Problem Statement
**Objective:** To build a unified, accessible, and user-friendly digital gateway (MediKiosk) for AYUSH healthcare services, bridging the gap between patients and alternative medicine centers across India.

**Key Challenges Addressed:**
- Language barriers in rural and semi-urban areas.
- Lack of awareness and discoverability of nearby AYUSH centers.
- Fragmented health records and appointment tracking.
- Need for a gamified/incentivized approach to healthcare access.

---

## 2. Technology Stack
Highlight this in a "Tech Stack" slide with logos:
- **Frontend Framework:** Next.js (React)
- **Styling & UI:** Tailwind CSS (Responsive, Mobile-First Design)
- **Animations:** Framer Motion (Micro-interactions & seamless modal transitions)
- **State Management:** React Context API & LocalStorage (Offline persistence)
- **Icons:** Lucide React
- **Geolocation & Mapping:** HTML5 Geolocation API, OpenStreetMap / Nominatim API (Reverse Geocoding)
- **Deployment:** Vercel (Recommended for Next.js)

---

## 3. Core Technical Features & Implementation

### A. Hyper-Localization (Multi-Language Architecture)
- **Approach:** Implemented a robust, client-side translation engine supporting 11 languages (English + 10 Regional: Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, Punjabi).
- **Technical Detail:** Uses a central `translations.ts` dictionary. State is persisted in `localStorage` (`medikiosk_language`) to ensure user preferences are saved across sessions. UI is built with flexible CSS (`break-words whitespace-normal`) to dynamically handle varying string lengths without breaking the layout.

### B. Secure Authentication & Identity
- **Approach:** Multi-modal verification supporting ABHA (Ayushman Bharat Health Account), Aadhaar, and Mobile OTP.
- **Technical Detail:** Future-ready architecture to integrate with ABDM (Ayushman Bharat Digital Mission) APIs for fetching health IDs.

### C. Geolocation & AYUSH Centre Discovery
- **Approach:** Real-time discovery of nearby AYUSH hospitals based on the user's current physical location.
- **Technical Detail:** Utilizes the native browser Geolocation API to fetch coordinates. Calls the OpenStreetMap (Nominatim) API to reverse-geocode coordinates into a precise State/Region. Filters a vast dataset of AYUSH hospitals and calculates relative distances, plotting them in an interactive list with direct links to Google Maps routing.

### D. Token-Based Incentive System (Gamification)
- **Approach:** A functional digital wallet ("My Coins") that tracks patient engagement and rewards them.
- **Technical Detail:** Built using a global React Context (`CoinContext`). Users earn coins for healthy habits or app usage, which can be dynamically deducted securely using a transactional architecture to unlock "Premium AYUSH Services" (e.g., Special Consultations, Priority Appointments) at selected centers.

### E. AI Integration (Triage & Summarization)
- **Approach:** AI-powered patient assistance for symptom summarization and triage.
- **Technical Detail:** Floating action buttons and dedicated dashboard sections route users to an AI assistant, intended to integrate with LLMs (like Gemini/OpenAI) to parse uploaded documents and health history.

---

## 4. Architecture Diagram Flow (For Presentation)
You can create a flowchart slide using this logic:
1. **User Layer:** Patient interacts with Next.js Mobile-First UI (Language selected).
2. **Auth Layer:** ABHA / Aadhaar Verification.
3. **Core Application Engine:** 
   - State Manager (Coin Wallet, Family Members).
   - Geolocation Engine (Finds state -> maps centers).
   - Translation Engine (Injects regional text).
4. **Data/API Layer:** External integrations (OpenStreetMap API for maps, Future ABDM API for records).

---

## 5. UI/UX Design Philosophy
- **Aesthetics:** "AYUSH Green" color palette (Emerald/Teal) promoting healing, nature, and trust. Glassmorphism overlays and vibrant gradients.
- **Accessibility:** Large touch targets, highly legible fonts, and clear iconography tailored for elderly and rural demographics.

---

## 6. Scalability & Future Scope
- **Offline Mode:** Transitioning to a PWA (Progressive Web App) with Service Workers to allow rural users to view upcoming appointments offline.
- **ABDM Integration:** Full PHR (Personal Health Record) linking via Ayushman Bharat Digital Mission.
- **Tele-AYUSH:** Integrating WebRTC for video consultations with Ayurvedic doctors.
