const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface Conversation {
  id: string;
  name: string;
  participants: string[];
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  text: string;
  sender: string;
  timestamp: string;
}

// Get all conversations
export const getConversations = async (): Promise<Conversation[]> => {
  const response = await fetch(`${API_URL}/conversations`);
  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }
  return response.json();
};

// Get a specific conversation
export const getConversation = async (id: string): Promise<Conversation> => {
  const response = await fetch(`${API_URL}/conversations/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch conversation');
  }
  return response.json();
};

// Create a new conversation
export const createConversation = async (name: string, participants: string[]): Promise<Conversation> => {
  const response = await fetch(`${API_URL}/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, participants }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create conversation');
  }
  
  return response.json();
};

// Get messages for a conversation
export const getMessages = async (conversationId: string): Promise<Message[]> => {
  const response = await fetch(`${API_URL}/conversations/${conversationId}/messages`);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  return response.json();
};

// Send a message
export const sendMessage = async (
  conversationId: string,
  text: string,
  sender: string
): Promise<Message> => {
  const response = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, sender }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  
  return response.json();
}; 