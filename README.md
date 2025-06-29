# 💬 Chatterz

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3.0-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Socket.io-4.8.1-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.io" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Express.js-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
</div>

<br />

<div align="center">
  <h3>🚀 Real-time chat application with temporary rooms</h3>
  <p>A modern, responsive chat app built with Next.js and Socket.IO featuring temporary rooms that expire when all users leave.</p>
</div>

## ✨ Features

- 🏠 **Create Temporary Rooms** - Generate unique room codes instantly
- 👥 **Real-time Messaging** - Send and receive messages instantly
- 🔒 **Room-based Chat** - Private conversations in dedicated rooms
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- ⚡ **Auto-cleanup** - Rooms automatically expire when empty
- 🎨 **Modern UI** - Clean, intuitive interface with Tailwind CSS
- 🔄 **Live User Count** - See how many users are in your room
- 📋 **Easy Sharing** - Copy room codes to clipboard
- 🌙 **Theme Support** - Built-in dark/light theme switching

## 🌟 Future Features Planning
- Setting room to public and private, and showing public rooms on dashboard
- User joining message in group
- Displaying all users in group in option to private message
- Replying to messages
- Attachments 
- Voice messages
- May bring voice and video call

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15.3.0](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS 4.1.11](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn](https://ui.shadcn.com/)** - UI components library
- **[Radix UI](https://www.radix-ui.com/)** - Headless UI components
- **[Socket.io-client 4.8.1](https://socket.io/)** - Real-time client-side communication
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### Backend
- **[Node.js](https://nodejs.org/)** - JavaScript runtime
- **[Express.js 4.18.2](https://expressjs.com/)** - Web application framework
- **[Socket.IO 4.7.5](https://socket.io/)** - Real-time server-side communication
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development

### Development Tools
- **[Turbo](https://turbo.build/)** - High-performance build system
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** 10+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chatterz.git
   cd chatterz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - **Client**: http://localhost:3001
   - **Server**: http://localhost:3000

## 📁 Project Structure

```
chatterz/
├── 📁 apps/
│   ├── 📁 client/          # Next.js frontend application
│   │   ├── 📁 app/         # App Router pages and layouts
│   │   ├── 📁 components/  # Reusable UI components
│   │   └── 📁 public/      # Static assets
│   └── 📁 server/          # Express.js backend server
├── 📁 packages/
│   ├── 📁 eslint-config/   # Shared ESLint configuration
│   ├── 📁 typescript-config/ # Shared TypeScript configuration
│   └── 📁 ui/              # Shared UI component library
├── 📄 package.json         # Root package configuration
├── 📄 turbo.json          # Turbo build configuration
└── 📄 README.md           # Project documentation
```

## 🎮 How to Use

### Creating a Room
1. Click **"Create New Room"**
2. Copy the generated room code
3. Share the code with friends

### Joining a Room
1. Enter your name
2. Enter the room code
3. Click **"Join Room"**
4. Start chatting!

### Features in Action
- **Real-time messaging** with instant delivery
- **User count** updates live as people join/leave
- **Message history** loads when joining existing rooms
- **Auto-scroll** to latest messages
- **Responsive design** works on mobile and desktop

## 🔧 Available Scripts

In the project root:

- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build the entire project
- `npm run lint` - Run ESLint across all packages
- `npm run check-types` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## 🏗️ Architecture

### Real-time Communication
- **Socket.IO** handles bidirectional communication
- **Room-based** messaging with automatic cleanup
- **Event-driven** architecture for scalability

### State Management
- **React hooks** for local state
- **Socket events** for real-time updates
- **TypeScript interfaces** for type safety

### Styling
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible components
- **Responsive design** with mobile-first approach

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with ❤️ using modern web technologies
- Icons by [Lucide](https://lucide.dev/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)

---