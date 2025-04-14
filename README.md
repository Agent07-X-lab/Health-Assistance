# AI Healthcare System

A modern healthcare management system built with React, TypeScript, and Supabase, featuring AI-powered patient monitoring and predictive analysis.

## Features

- 🏥 Patient Management System
- 🤖 AI-Powered Health Predictions
- 👨‍⚕️ Doctor Appointment Scheduling
- 📊 Real-time Environmental Health Monitoring
- 🔍 Advanced Patient Search
- 📱 Responsive Design
- 🌙 Dark Mode Support
- 🔐 Secure Authentication

## Tech Stack

- Frontend: React + TypeScript
- Styling: Tailwind CSS
- Database: Supabase
- Icons: Lucide React
- Charts: Recharts
- Authentication: Supabase Auth
- AI/ML: TensorFlow.js

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git
- VS Code
- GitHub account

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ai-healthcare-system.git
   cd ai-healthcare-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## VS Code Deployment Steps

1. Install Required Extensions:
   - GitHub Pull Requests and Issues
   - GitLens
   - Prettier
   - ESLint

2. Initialize Git Repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. Create GitHub Repository:
   - Open VS Code
   - Click on the Source Control icon in the sidebar
   - Click "Publish to GitHub"
   - Follow the prompts to create a new repository

4. Configure GitHub Repository:
   - Add a description
   - Choose public/private visibility
   - Click "OK" to publish

5. Push Your Code:
   ```bash
   git remote add origin https://github.com/your-username/ai-healthcare-system.git
   git branch -M main
   git push -u origin main
   ```

## Deployment to Production

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Netlify:
   - Connect your GitHub repository to Netlify
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Set environment variables in Netlify dashboard

## Environment Variables

Required environment variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
ai-healthcare-system/
├── src/
│   ├── components/      # React components
│   ├── contexts/        # React contexts
│   ├── lib/            # Utility functions and types
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── public/             # Static assets
├── supabase/          # Supabase migrations and types
└── package.json       # Project dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -m "Add feature"`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.