import React from 'react';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Project Discussion',
    lastMessage: 'Let\'s schedule a meeting tomorrow',
    timestamp: '10:30 AM',
    unread: true,
  },
  {
    id: '2',
    name: 'Marketing Team',
    lastMessage: 'The new campaign looks great!',
    timestamp: 'Yesterday',
    unread: false,
  },
  {
    id: '3',
    name: 'Support Tickets',
    lastMessage: 'Can you check ticket #45678?',
    timestamp: 'Monday',
    unread: false,
  },
];

// Using simple function declaration
function ConversationList() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Conversations</h2>
        <div className="mt-2">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {mockConversations.map((conversation) => (
          <div 
            key={conversation.id}
            className={`p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${
              conversation.unread ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-900">{conversation.name}</h3>
              <span className="text-xs text-gray-500">{conversation.timestamp}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1 truncate">{conversation.lastMessage}</p>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          New Conversation
        </button>
      </div>
    </div>
  );
}

export default ConversationList; 