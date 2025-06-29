"use client"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'


const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000'
const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000,
});

const Page = () => {
  const [inputName, setInputName] = useState<string>(''); // Input for user's name
  const [inputCode, setInputCode] = useState<string>(''); // Input for room code
  const [isConnected, setIsConnected] = useState(false); // Track connection status
  const [joined, setJoined] = useState(false); // Track if user has joined the room
  const [room, setRoom] = useState<string>(''); // Room code
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  useEffect(() => {
    socket.on('connect', () => {
      console.log('🟢 Connected to server:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    })

    socket.on("roomCreated", (code) => {
      setRoom(code); // Assuming room ID is the socket ID for simplicity
      setIsLoading(false);
    })

    socket.on('error', (e) => {
      console.error('Socket error:', e);
      toast.error(`Error: ${e.message || 'An error occurred'}`);
    })

    socket.on('joinedRoom', (data) => {
      console.log('Joined room:', data);
      setJoined(true);
    })

    // Cleanup function
    return () => {
      socket.removeAllListeners();
    };

  }, []);

  const createRoom = () => {
    setIsLoading(true);
    socket.emit('createRoom');
  }

  const handleJoin = () => {
    if (!inputCode.trim() || inputCode.trim() === '') {
      toast.error("Please enter a name and room code to join.")
      return;
    }
    console.log("Joining");
    
    socket.emit('join-room', JSON.stringify({roomId:inputCode.toUpperCase(),inputName}))
  }

  const copyToClickboard = ()=> {
    navigator.clipboard.writeText(room)
    toast("✅ Copied to clipboard!")
  }

  return (
    <>
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
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
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
                <div>
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
                  {/* <span>Users: {users}</span> */}
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