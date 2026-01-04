<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Orden - AI-Powered Study Companion

An iPad-style AI-powered study companion with organized folders, smart transcripts, and voice-enabled note taking.

## Features

### Authentication
- **Email Signup/Login** - Create an account with email, password, and username
- **Persistent Sessions** - Stay logged in across browser sessions
- **Secure Password Management** - Change password with current password verification

### Profile Management
- **User Profile** - View and manage your account details
- **Avatar Customization** - Choose from preset avatars or upload custom images
- **Username Updates** - Change your display name anytime
- **Account Settings** - Access general settings for profile management

### AI Chat
- **Gemini AI Integration** - Powered by Google's Gemini 3 Flash model
- **Academic Tutor** - Specialized for Biology, History, Calculus, and more
- **Conversation History** - Maintains context throughout your session
- **Streaming Responses** - Real-time AI response generation

### Notes Organization
- **Folder-based Organization** - Organize notes by subject or category
- **Multiple Note Types** - Summaries, slides, audio, articles, and tasks
- **Progress Tracking** - Track completion status on task-based notes

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **Icons**: Material Symbols Outlined
- **AI**: Google Gemini API (@google/genai)

## Project Structure

```
Orden/
├── index.tsx                    # Application entry point
├── App.tsx                      # Root component with auth flow
├── types.ts                     # TypeScript type definitions
├── components/
│   └── Layout.tsx               # Main layout with bottom navigation
├── views/
│   ├── LoginView.tsx            # Login page
│   ├── SignupView.tsx           # Signup page
│   ├── ChatView.tsx             # AI chat interface
│   ├── FolderView.tsx           # Notes organization
│   ├── ProfileView.tsx          # User profile with avatar management
│   └── GeneralSettingsView.tsx  # Username and password settings
└── services/
    ├── authService.ts           # Authentication API service
    └── geminiService.ts         # Gemini AI integration
```

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Usage

1. **Sign Up** - Create a new account with your email, username, and password
2. **Chat** - Ask the AI tutor questions about your studies
3. **Notes** - Browse and organize your study materials
4. **Profile** - Manage your account, change avatar, and update settings

## API Configuration

The app uses Google's Gemini API for AI functionality. Configure your API key:

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env.local` file in the project root
3. Add: `GEMINI_API_KEY=your_api_key_here`

## License

This project is private.
