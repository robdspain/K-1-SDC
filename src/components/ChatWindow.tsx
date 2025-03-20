import React, { useState } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
}

function ChatWindow() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hi there! How can I help you today?',
      sender: 'other' as const,
      timestamp: '10:30 AM',
    },
    {
      id: '2',
      text: 'I need some information about your service.',
      sender: 'user' as const,
      timestamp: '10:31 AM',
    },
    {
      id: '3',
      text: 'Sure, I\'d be happy to help. What specific information are you looking for?',
      sender: 'other' as const,
      timestamp: '10:32 AM',
    },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: any) => {
    e.preventDefault();
    
    if (newMessage.trim() === '') return;
    
    const message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Simulate response after a delay
    setTimeout(() => {
      const response = {
        id: (Date.now() + 1).toString(),
        text: 'Thanks for your message. I\'ll get back to you shortly.',
        sender: 'other' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      setMessages(prevMessages => [...prevMessages, response]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
          PD
        </div>
        <div className="ml-4">
          <h2 className="text-lg font-semibold text-gray-800">Project Discussion</h2>
          <p className="text-sm text-gray-500">3 participants</p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p>{message.text}</p>
              <span
                className={`text-xs ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                } block mt-1 text-right`}
              >
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatWindow; 