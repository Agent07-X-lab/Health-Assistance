# 🏥 AI Healthcare Management System

A production-ready, scalable healthcare management platform built with React, TypeScript, Tailwind CSS, Supabase, and TensorFlow.js. Features advanced AI-powered tools used in real hospitals and digital health platforms.

## 🔐 Development Test Credentials

For testing the application, you can use these credentials:

### Doctor Login
- **Email:** `doctor@test.com`
- **Password:** `doctor123`
- **Dashboard:** `/doctor-dashboard`

### Patient Login
- **Email:** `patient@test.com`
- **Password:** `patient123`
- **Dashboard:** `/patient-dashboard`

**Note:** These are development credentials for prototype testing. In production, users must register through the signup pages.

## ✨ Key Features

### 🧠 AI & Health Intelligence
- **AI Symptom Checker** - Interactive chat-based symptom analysis with urgency detection
- **AI Health Risk Score** - TensorFlow.js-powered risk assessment for heart disease, diabetes, and hypertension
- **Wearable Device Integration** - Real-time health monitoring with smartwatch data simulation
- **Predictive Analytics** - Advanced ML models for health trend prediction

### 🚨 Emergency & Alerts
- **Smart Emergency Alert System** - Real-time critical health alerts with severity classification
- **Automatic Vital Monitoring** - Continuous tracking with threshold-based alerts
- **Quick Emergency Contacts** - One-click access to emergency services

### 👨‍⚕️ Patient Management
- **Smart Appointment System** - Calendar-based scheduling with automatic reminders
- **Medication Reminder System** - Adherence tracking with customizable schedules
- **Electronic Health Records** - Comprehensive patient history management
- **Video Consultation** - Telemedicine support (UI ready)

### 📊 Analytics & Insights
- **Health Trend Analytics** - Visual charts for vitals over time
- **Risk Assessment Dashboard** - Interactive risk visualization
- **Wearable Data Analytics** - 24-hour activity and health trends

### 🎨 Modern UI/UX
- **Medical Theme** - Professional teal/blue healthcare palette
- **Responsive Design** - Mobile-first, works on all devices
- **Dark Mode** - Full dark theme support
- **Accessibility** - WCAG compliant design

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization
- **React Router** - Client-side routing

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication & authorization
  - Row Level Security (RLS)
  - File storage

### AI/ML
- **TensorFlow.js** - Client-side machine learning
- **Custom algorithms** - Health risk assessment

## 🗺️ Application Routes

### Public Routes
- `/` - Landing page with user type selection
- `/login` - Legacy user authentication
- `/signup` - Legacy user registration
- `/doctor-login` - Doctor authentication
- `/doctor-signup` - Doctor registration
- `/patient-login` - Patient authentication
- `/patient-signup` - Patient registration
- `/reset-password` - Password recovery
- `/about` - About the platform
- `/contact` - Contact information

### Protected Routes (Authentication Required)

#### Doctor Routes
- `/doctor-dashboard` - Doctor dashboard with patient management
- Manage appointments, prescriptions, and consultations
- Access patient records and medical history

#### Patient Routes
- `/patient-dashboard` - Patient dashboard with health overview
- `/ai-symptom-checker` - AI-powered symptom analysis
- `/health-risk-score` - Health risk assessment tool
- `/wearable-dashboard` - Wearable device data monitoring
- `/appointments` - Appointment management system
- `/medications` - Medication reminder tracker
- `/emergency-alerts` - Emergency alert monitoring

#### Legacy Routes
- `/dashboard` - Original dashboard (maintained for compatibility)

## 📦 Components

### Authentication & User Management
- [`LandingPage.tsx`](src/components/LandingPage.tsx) - Home page with user type selection
- [`DoctorLogin.tsx`](src/components/DoctorLogin.tsx) - Doctor authentication
- [`DoctorSignup.tsx`](src/components/DoctorSignup.tsx) - Doctor registration
- [`PatientLogin.tsx`](src/components/PatientLogin.tsx) - Patient authentication
- [`PatientSignup.tsx`](src/components/PatientSignup.tsx) - Patient registration

### Dashboards
- [`DoctorDashboard.tsx`](src/components/DoctorDashboard.tsx) - Doctor management interface
- [`PatientDashboard.tsx`](src/components/PatientDashboard.tsx) - Patient health overview

### AI Features
- [`AISymptomChecker.tsx`](src/components/AISymptomChecker.tsx) - Chat-based symptom checker
- [`AIHealthRiskScore.tsx`](src/components/AIHealthRiskScore.tsx) - TensorFlow.js risk calculator
- [`WearableDeviceDashboard.tsx`](src/components/WearableDeviceDashboard.tsx) - Real-time health monitoring

### Patient Management
- [`AppointmentSystem.tsx`](src/components/AppointmentSystem.tsx) - Smart scheduling system
- [`MedicationReminder.tsx`](src/components/MedicationReminder.tsx) - Medication adherence tracker
- [`EmergencyAlertSystem.tsx`](src/components/EmergencyAlertSystem.tsx) - Critical alert management

## 🗄️ Database Schema

### Tables (18 total)
1. `user_roles` - Role-based access control (doctor/patient)
2. `doctors` - Doctor profiles and credentials
3. `patients` - Patient profiles and health information
4. `symptom_checker_history` - AI symptom logs
5. `health_risk_scores` - Risk assessment results
6. `wearable_data` - Smartwatch/fitness data
7. `emergency_alerts` - Critical health alerts
8. `ehr_records` - Electronic health records
9. `ai_prescriptions` - AI prescription assistance
10. `appointments` - Appointment scheduling
11. `video_consultations` - Telemedicine sessions
12. `diet_plans` - Nutrition planning
13. `activity_plans` - Exercise recommendations
14. `medication_reminders` - Medication schedules
15. `environmental_health_data` - Environmental factors
16. `health_trends` - Historical metrics
17. `audit_logs` - System activity logs
18. `user_preferences` - User settings

All tables include Row Level Security (RLS) policies for secure data access.

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