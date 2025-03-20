import React from 'react';
import './App.css';
import ConversationList from './components/ConversationList';
import ChatWindow from './components/ChatWindow';

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden md:block w-1/4 bg-white border-r border-gray-200">
        <ConversationList />
      </div>
      <div className="w-full md:w-3/4">
        <ChatWindow />
      </div>
    </div>
  );
}

export default App; 