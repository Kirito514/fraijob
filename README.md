# FraiJob - AI-Powered Job Platform

A modern job platform with AI assistance, real-time chat, and comprehensive user management.

## 🚀 Features

### ✨ Core Features
- **AI-Powered Job Matching** - Intelligent job recommendations
- **Real-Time Chat System** - Live messaging with users and employers
- **Portfolio Management** - Showcase your projects and skills
- **Skill Testing** - Take assessments to prove your expertise
- **Job Applications** - Track your application status
- **User Profiles** - Complete profile management

### 🎨 Modern UI/UX
- **Responsive Design** - Works on all devices
- **Dark/Light Mode** - Beautiful themes
- **Smooth Animations** - Framer Motion powered
- **Glassmorphism** - Modern glass effects
- **Gradient Design** - Eye-catching visuals

### 🔧 Technical Features
- **Real-Time Chat** - WebSocket-like experience
- **File Sharing** - Share documents and images
- **Message Reactions** - Like and react to messages
- **Edit/Delete Messages** - Full message control
- **User Authentication** - Secure login system
- **Database Integration** - PostgreSQL with Prisma

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Real-Time**: Supabase Realtime
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Styling**: Tailwind CSS

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fraijob-app.git
   cd fraijob-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/fraijob"
   
   # JWT Secret
   JWT_SECRET="your-super-secret-jwt-key-here"
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   
   # Email (Resend)
   RESEND_API_KEY="your-resend-api-key"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Run the migration SQL from `supabase_migration.sql`
   - Copy your project URL and anon key to `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### Supabase Migration
Run the following SQL in your Supabase SQL editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  lang TEXT DEFAULT 'en',
  github TEXT,
  telegram TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  reply_to UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for chat_messages table
CREATE POLICY "Anyone can view chat messages" ON chat_messages
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert messages" ON chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages" ON chat_messages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages" ON chat_messages
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, name, email, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email, NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## 🚀 Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📱 Features Overview

### Dashboard
- **Real-time statistics** - Profile views, applications, test scores
- **Recent activity** - Track your latest actions
- **Quick actions** - Fast access to common tasks

### Chat System
- **Real-time messaging** - Instant message delivery
- **Message reactions** - Like and react to messages
- **File sharing** - Share documents and images
- **Message editing** - Edit your own messages
- **Message deletion** - Delete your own messages
- **Reply functionality** - Reply to specific messages

### Portfolio
- **Project showcase** - Display your best work
- **View tracking** - See how many people view your projects
- **Like system** - Get feedback on your work

### Job Applications
- **Application tracking** - Monitor your job applications
- **Status updates** - Real-time application status
- **Salary information** - View job compensation details

### Skill Tests
- **Assessment system** - Take skill-based tests
- **Score tracking** - Monitor your performance
- **Progress visualization** - See your improvement over time

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you need help or have questions:
- Create an issue on GitHub
- Contact us at support@fraijob.com
- Join our Discord community

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - The open source Firebase alternative
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Production-ready motion library
- [Lucide](https://lucide.dev/) - Beautiful & consistent icon toolkit
