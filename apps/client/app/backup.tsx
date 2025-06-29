 <div className={`mb-4 px-3 py-1 rounded-full text-sm ${
        isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>

      {/* Messages Display */}
      <div className='flex-1 w-full max-w-2xl bg-white rounded-lg shadow-md p-4 mb-4 overflow-y-auto'>
        <h2 className='text-lg font-semibold mb-4'>Messages:</h2>
        {messages.length === 0 ? (
          <p className='text-gray-500 italic'>No messages yet...</p>
        ) : (
          <div className='space-y-2'>
            {messages.map((msg, index) => (
              <div key={index} className='p-2 bg-gray-50 rounded border-l-4 border-blue-500'>
                {msg}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className='flex gap-2 w-full max-w-2xl'>
        <Input
          placeholder="Type your message here..."
          className="flex-1"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleMessageSend();
            }
          }}
          disabled={!isConnected}
        />
        <Button 
          onClick={handleMessageSend} 
          variant="outline"
          disabled={!isConnected || message.trim() === ''}
        >
          Send
        </Button>
      </div>



<div className='text-center p-4 bg-green-50 border border-green-200 rounded-lg'>
                    <h3 className='text-lg font-semibold text-green-800 mb-2'>Room Created! 🎉</h3>
                    <p className='text-green-700 mb-2'>Your room code is:</p>
                    <div className='text-3xl font-bold text-green-900 bg-white px-4 py-2 rounded border-2 border-green-300 inline-block'>
                      {room}
                    </div>
                    <p className='text-sm text-green-600 mt-2'>Share this code with others to join your room</p>
                  </div>