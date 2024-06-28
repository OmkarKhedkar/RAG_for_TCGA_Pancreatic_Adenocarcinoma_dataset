import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const ChatContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f4f8;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const MessageList = styled.div`
  height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  background-color: white;
  border-radius: 8px;
`;

const MessageItem = styled(motion.div)<{ isUser: boolean }>`
  max-width: 70%;
  margin: ${props => props.isUser ? '10px 0 10px auto' : '10px auto 10px 0'};
  padding: 10px 15px;
  border-radius: 18px;
  background-color: ${props => props.isUser ? '#007bff' : '#e9ecef'};
  color: ${props => props.isUser ? 'white' : 'black'};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 20px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;


interface Message {
    text: string;
    isUser: boolean;
  }
  
  interface ChatInterfaceProps {
    onFileUpload: (files: { clinical: File | null; expression: File | null }) => Promise<void>;
  }
  
  const ChatInterface: React.FC<ChatInterfaceProps> = ({ onFileUpload }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [clinicalFile, setClinicalFile] = useState<File | null>(null);
    const [expressionFile, setExpressionFile] = useState<File | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
  
      setMessages(prev => [...prev, { text: input, isUser: true }]);
      setInput('');
      setIsLoading(true);
  
      try {
        const result = await axios.post('http://localhost:8000/query', { text: input });
        setMessages(prev => [...prev, { text: result.data.response, isUser: false }]);
      } catch (error) {
        console.error('Error querying:', error);
        setMessages(prev => [...prev, { text: 'An error occurred while processing your query.', isUser: false }]);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleFileUpload = async () => {
      if (!clinicalFile || !expressionFile) {
        setMessages(prev => [...prev, { text: 'Please select both clinical and expression files.', isUser: false }]);
        return;
      }
  
      try {
        await onFileUpload({ clinical: clinicalFile, expression: expressionFile });
        setMessages(prev => [...prev, { text: 'Files uploaded successfully.', isUser: false }]);
      } catch (error) {
        console.error('Error uploading files:', error);
        setMessages(prev => [...prev, { text: 'An error occurred while uploading files.', isUser: false }]);
      }
    };
  
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
  
    return (
      <ChatContainer>
        <div>
          <input type="file" onChange={(e) => setClinicalFile(e.target.files?.[0] || null)} accept=".tsv" />
          <label>Clinical Data File</label>
          <input type="file" onChange={(e) => setExpressionFile(e.target.files?.[0] || null)} accept=".tsv" />
          <label>Gene Expression Data File</label>
          <button onClick={handleFileUpload}>Upload Files</button>
        </div>
        <MessageList>
          <AnimatePresence>
            {messages.map((message, index) => (
              <MessageItem
                key={index}
                isUser={message.isUser}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {message.text}
              </MessageItem>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </MessageList>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your query here..."
            disabled={isLoading}
          />
        </form>
        {isLoading && <p>Processing your query...</p>}
      </ChatContainer>
    );
  };
  
  export default ChatInterface;