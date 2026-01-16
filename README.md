# 🎨 KalaKriti AI

**Bridging Tradition and Technology.**

KalaKriti AI is an intelligent creative partner and marketplace designed to empower traditional Indian artisans and global customers. By leveraging the power of **Google's Gemini 2.5 models**, we facilitate co-creation, safeguard cultural heritage, and provide actionable business intelligence to artisans.

![KalaKriti AI Banner](https://images.unsplash.com/photo-1598556836367-54b9d0941913?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3)

## 🌟 Key Features

### For Customers (The Explorer)
- **✨ Co-Creation Engine**: Describe your dream product (e.g., *"A hand-painted wooden jewelry box with a peacock motif"*). The AI generates a photorealistic mockup using **Gemini Image Generation** so you can visualize it before an artisan crafts it.
- **🛡️ Guardian of Tradition**: An AI-powered cultural compliance layer. Before generating a design, the system analyzes your prompt to ensure it respects sacred imagery and cultural heritage, preventing appropriation.
- **💬 Kriti AI Assistant**: A multilingual chatbot ready to guide you through Indian art history or help you refine your custom order requests.

### For Artisans (The Creator)
- **🧠 Artisan Helper**: Upload a photo of your handicraft. The AI analyzes the image and context to automatically generate a **compelling title, storytelling description, price recommendation, and SEO tags**.
- **📊 Interactive Dashboard**: Visual analytics including dynamic charts for order management (Completed vs. Pending) generated via structured JSON output from Gemini.
- **🔥 Hype & Leaderboard**: Gamified engagement metrics to showcase top artisans based on quality and cultural preservation.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **AI Integration**: [Google GenAI SDK](https://www.npmjs.com/package/@google/genai)
- **Models Used**:
  - `gemini-2.5-flash-image` (Image Generation)
  - `gemini-2.5-flash` (Text reasoning, JSON output, Chat)
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
You will need a Google Cloud Project with the **Gemini API** enabled and an API key.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kalakriti-ai.git
   cd kalakriti-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   The application expects the API key to be available in the environment variables.
   ```env
   API_KEY=your_google_genai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `components/CoCreationEngine.tsx`: Handles text-to-image generation and the cultural guardrails.
- `components/ArtisanHelper.tsx`: Multimodal analysis (Text + Image) for generating product listings.
- `components/GuardianOfTradition.tsx`: Standalone cultural authenticity scanner.
- `services/geminiService.ts`: Centralized service for all interactions with the Google GenAI SDK.
- `types.ts`: TypeScript definitions for the application state and data models.

## 🛡️ The "Guardian of Tradition" Prompt

One of the core innovations of KalaKriti is the System Instruction used for the Guardian. It ensures that the AI doesn't just generate *anything*, but acts as a cultural custodian:

> "Role: You are the AI Guardian of Tradition... Your sole function is to assess user-provided design descriptions for adherence to cultural respect..."

## 📄 License

This project is open-source and available under the MIT License.
