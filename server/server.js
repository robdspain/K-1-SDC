const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample in-memory data (replace with database in production)
let conversations = [
  {
    id: '1',
    name: 'Project Discussion',
    participants: ['user1', 'user2', 'user3'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Marketing Team',
    participants: ['user1', 'user4'],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Support Tickets',
    participants: ['user2', 'user5'],
    createdAt: new Date().toISOString(),
  },
];

let messages = [
  {
    id: '1',
    conversationId: '1',
    text: 'Hi there! How can I help you today?',
    sender: 'user2',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    conversationId: '1',
    text: 'I need some information about your service.',
    sender: 'user1',
    timestamp: new Date().toISOString(),
  },
  {
    id: '3',
    conversationId: '1',
    text: "Sure, I'd be happy to help. What specific information are you looking for?",
    sender: 'user2',
    timestamp: new Date().toISOString(),
  },
];

// Database setup for PostgreSQL (commented out - uncomment and configure for production)
/*
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
*/

// Routes

// Get all conversations
app.get('/api/conversations', (req, res) => {
  res.json(conversations);
});

// Get a specific conversation
app.get('/api/conversations/:id', (req, res) => {
  const conversation = conversations.find(c => c.id === req.params.id);
  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }
  res.json(conversation);
});

// Create a new conversation
app.post('/api/conversations', (req, res) => {
  const { name, participants } = req.body;
  
  if (!name || !participants || !Array.isArray(participants) || participants.length === 0) {
    return res.status(400).json({ message: 'Name and participants array are required' });
  }
  
  const newConversation = {
    id: Date.now().toString(),
    name,
    participants,
    createdAt: new Date().toISOString(),
  };
  
  conversations.push(newConversation);
  res.status(201).json(newConversation);
});

// Get messages for a conversation
app.get('/api/conversations/:id/messages', (req, res) => {
  const conversationMessages = messages.filter(m => m.conversationId === req.params.id);
  res.json(conversationMessages);
});

// Send a message
app.post('/api/conversations/:id/messages', (req, res) => {
  const { text, sender } = req.body;
  const conversationId = req.params.id;
  
  if (!text || !sender) {
    return res.status(400).json({ message: 'Text and sender are required' });
  }
  
  const conversation = conversations.find(c => c.id === conversationId);
  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }
  
  const newMessage = {
    id: Date.now().toString(),
    conversationId,
    text,
    sender,
    timestamp: new Date().toISOString(),
  };
  
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 