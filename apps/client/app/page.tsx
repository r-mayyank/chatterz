"use client"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { ThemeToggle } from '@/components/ui/theme-toggle'


// const SOCKET_URL = process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true' 
//   ? process.env.NEXT_PUBLIC_PRODUCTION_URL 
//   : "http://localhost:3000";
const SOCKET_URL = "https://chatterz-cocf.onrender.com";

const Page = () => {
  const [inputName, setInputName] = useState<string>(''); // Input for user's name
  const [inputCode, setInputCode] = useState<string>(''); // Input for room code
  const [isConnected, setIsConnected] = useState(false); // Track connection status
  const [joined, setJoined] = useState(false); // Track if user has joined the room
  const [room, setRoom] = useState<string>(''); // Room code
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [userSize, setUserSize] = useState(0); // Track number of users in the room
  const [users, setUsers] = useState<string[]>([]); // Track users in the room
  const [messages, setMessages] = useState<any[]>([]); // Store chat messages
  const [messageInput, setMessageInput] = useState<string>(''); // Message input
  const [currentUser, setCurrentUser] = useState<string>(''); // Current user name
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    console.log('🔄 Initializing socket connection...');

    // Create socket connection inside useEffect
    socketRef.current = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('🟢 Connected to server:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('⚠️ Connection error:', error);
      setIsConnected(false);
    })

    socket.on("roomCreated", (code) => {
      console.log('🏠 Room created:', code);
      setRoom(code);
      setIsLoading(false);
    })

    socket.on('error', (e) => {
      console.error('🚨 Socket error:', e);
      toast.error(`Error: ${e.message || 'An error occurred'}`);
    })

    socket.on('joinedRoom', (data) => {
      console.log('✅ Joined room:', data);
      console.log('📊 Data breakdown:', {
        roomId: data.roomId,
        users: data.users,
        userSize: data.userSize, // Fixed: Changed from usersize to userSize
        messages: data.messages // Fixed: Changed from message to messages
      });

      // Initialize messages from room history (if any)
      if (data.messages && Array.isArray(data.messages)) {
        setMessages(data.messages); // Set existing messages
      } else {
        setMessages([]); // Initialize with empty array
      }

      setJoined(true);
      setUserSize(data.userSize); // Fixed: Changed from usersize to userSize
      setUsers(data.users);
      setRoom(data.roomId);

      // Use the name from the join data instead of inputName to ensure consistency
      const userName = inputName.trim();
      setCurrentUser(userName);

      console.log('✅ State updated - userSize should be:', data.userSize);
    })

    socket.on('user-joined', (size) => {
      setUserSize(size);
      toast.success(`👤 User joined! Total users: ${size}`);
    })

    socket.on('user-left', (size) => {
      setUserSize(size);
      toast.error(`👤 User left! Total users: ${size}`);
    })

    // Handle incoming messages
    socket.on('message', (message) => {
      console.log('📨 Message received:', message);
      setMessages(prev => [...prev, message]);
    })

    // Cleanup function - runs when component unmounts
    return () => {
      console.log('🧹 Cleaning up socket connection...');
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Empty dependency array - runs only once


  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createRoom = () => {
    if (!socketRef.current) {
      console.error('❌ Socket not connected');
      return;
    }
    console.log('📤 Emitting createRoom event...');
    setIsLoading(true);
    socketRef.current.emit('createRoom');
  }

  const handleJoin = () => {
    if (!inputName.trim() || inputName.trim() === '') {
      toast.error("Please enter your name to join.")
      return;
    }
    if (!inputCode.trim() || inputCode.trim() === '') {
      toast.error("Please enter a room code to join.")
      return;
    }
    if (!socketRef.current) {
      console.error('❌ Socket not connected');
      toast.error('Not connected to server');
      return;
    }

    // Set current user immediately when joining
    const userName = inputName.trim();
    setCurrentUser(userName);
    console.log('👤 Setting current user to:', userName);

    const joinData = {
      roomId: inputCode.toUpperCase(),
      name: userName
    };

    console.log("📤 Joining room with:", joinData);
    socketRef.current.emit('join-room', JSON.stringify(joinData));
  }

  // const handleSendMessage = () => {
  //   if (!message.trim()) {
  //     toast.error("Please enter a message to send.")
  //     return;
  //   }
  //   if (!socketRef.current) {
  //     console.error('❌ Socket not connected');
  //     toast.error('Not connected to server');
  //     return;
  //   }

  //   const messageData = {
  //     roomId: room,
  //     userId: inputName,
  //     message: message
  //   };

  //   console.log("📤 Sending message:", messageData);
  //   socketRef.current.emit('sendMessage', JSON.stringify(messageData));
  //   setMessage(''); // Clear the message input after sending

  // }

  const copyToClickboard = () => {
    navigator.clipboard.writeText(room)
    toast("✅ Copied to clipboard!")
  }

  const sendMessage = () => {
    if (!messageInput.trim()) {
      return;
    }

    if (!socketRef.current) {
      console.error('❌ Socket not connected');
      toast.error('Not connected to server');
      return;
    }

    // Ensure we have a valid current user
    const senderName = currentUser || inputName || 'Anonymous';

    const messageData = {
      roomId: room,
      content: messageInput,
      senderId: socketRef.current.id,
      sender: senderName
    };

    console.log('📤 Sending message:', messageData);
    console.log('👤 Current user check:', { currentUser, inputName, senderName });

    socketRef.current.emit('sendMessage', messageData);
    setMessageInput(''); // Clear input after sending
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="container mx-auto max-w-2xl p-4 h-screen flex items-center justify-center">
        <Card className='w-full'>
          <CardHeader className='space-y-1'>

            <div className='flex justify-between items-center '>
              <div className='flex items-center gap-2'>
                <CardTitle className='flex items-center text-2xl font-bold gap-2'>
                  <MessageCircle />
                  Chatterz
                </CardTitle>
              </div>

              <div className={`px-3 py-1 rounded-full text-sm ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                {isConnected ? '🟢 Connected' : '🔴 Connecting...'}
              </div>
            </div>

            <CardDescription>
              real-time chatting app
              <br />
              temporary rooms that expires after all users exit
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!joined ? (
              <div className='space-y-4'>
                {!room ? (
                  <Button onClick={createRoom} className='w-full mb-4 text-lg py-6'>
                    {isLoading ? 'Creating Room...' : 'Create New Room'}
                  </Button>
                ) : (
                  <Button onClick={copyToClickboard} className='w-full mb-4 text-lg py-6 gap-2'>
                    {room}
                    <Copy />
                  </Button>
                )}

                <Input
                  placeholder='Enter Your Name'
                  className='w-full py-5'
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  disabled={!isConnected}
                />
                <div className='w-full flex items-center gap-2'>
                  <Input
                    placeholder="Enter Room Code"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-full py-5"
                    disabled={!isConnected}
                  />
                  <Button
                    onClick={handleJoin}
                    className='py-5 px-8'
                  >
                    Join Room&nbsp;↵
                  </Button>
                </div>
              </div>
            )
              :
              (
                <div className='space-y-6'>
                  <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span>Room Code: <span className="font-mono font-bold">{room}</span></span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={copyToClickboard}
                        className="h-6 w-6"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <span>Users: {userSize}</span>
                  </div>

                  {/* Messages Area */}
                  <div className="h-[430px] overflow-y-auto border rounded-lg p-4 space-y-2">
                    {!messages || messages.length === 0 ? (
                      <p className="text-gray-500 italic text-center">No messages yet... Start the conversation!</p>
                    ) : (
                      messages.filter(msg => msg && msg.sender && msg.content).map((msg, index) => (
                        <div key={msg.id || index} className={`flex ${msg.sender === inputName ? 'justify-end' : 'justify-start'
                          }`}>
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === inputName
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                            }`}>
                            <div className={`text-xs mb-1 ${msg.sender === inputName ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                              <div className='flex items-center justify-between'>
                                <span className="font-semibold">{msg.sender}</span>
                                <span className="ml-2">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                            <div className={`break-words ${msg.sender === inputName ? 'justify-end' : 'justify-start'}`}>{msg.content}</div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message..."
                      className="text-lg py-5"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          sendMessage();
                        }
                      }}
                      disabled={!isConnected}
                    />
                    <Button
                      onClick={sendMessage}
                      size="lg"
                      className="px-8"
                      disabled={!isConnected}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              )}

          </CardContent>

        </Card >
      </div>
    </ >
  )
}

export default Page