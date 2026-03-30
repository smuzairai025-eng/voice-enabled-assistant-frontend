
# 🎙️ Frontend UI: Sunmarke AI Voice Assistant

This repository contains the user interface for the Sunmarke AI Voice Assistant. It is a modern, responsive Next.js web application that leverages browser-native APIs for real-time speech recognition and synthesis, providing a seamless multi-model comparison experience.

## 🚀 Live Deployment
* **Live Application:** `https://voice-enabled-multimodel-assistant-production-7a44.up.railway.app/`
* **Backend API Referenced:** `voice-enabled-multimodel-assistant-production.up.railway.app`

## 💻 Tech Stack
* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Speech-to-Text:** Web Speech API (`SpeechRecognition`)
* **Text-to-Speech:** Web Speech API (`SpeechSynthesis`)
* **Deployment:** Railway / Vercel

## 🏗️ Architecture Design

The frontend is designed as a lightweight, client-side application to handle hardware interactions (microphone) and UI rendering:
1. **Audio Capture:** Utilizes the browser's native `SpeechRecognition` interface to capture user voice input in real-time without requiring external API calls or file uploads.
2. **API Communication:** Sends the transcribed text payload to the external FastAPI backend via a standard REST `POST` request.
3. **Comparative UI:** Implements a fully responsive, 3-column CSS Grid layout to display the responses from Gemini, DeepSeek, and Kimi side-by-side for easy evaluation.
4. **Audio Playback:** Uses the native `SpeechSynthesisUtterance` interface to read the generated LLM responses aloud, dynamically mapping to the specific column the user interacts with.

## 🛠️ Local Setup Instructions

### Prerequisites
* Node.js (v18 or higher)
* A modern web browser with Web Speech API support (**Google Chrome** or **Microsoft Edge** highly recommended).

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/smuzairai025-eng/voice-enabled-assistant-frontend.git
   cd frontend-voice-agent
Install dependencies:

npm install
Update the Backend URL (If testing locally):
Open src/app/page.tsx and ensure the fetch request on line 73 points to your active backend (either http://localhost:8000/api/ask for local testing or your live Railway URL).

Start the development server:

npm run dev
Open http://localhost:3000 in your browser.

Usage Notes
Ensure you grant microphone permissions when prompted by the browser.

For the Speech-to-Text feature to function properly, the application must be accessed via localhost or a secure https:// domain due to browser security restrictions.