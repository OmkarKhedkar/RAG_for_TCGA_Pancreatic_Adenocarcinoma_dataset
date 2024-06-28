import React, { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const AppContainer = styled.div`
  background-color: #1E1E1E;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 30px;
  text-align: center;
`;

const ChatContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  background-color: #2D2D2D;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
`;

const MessageList = styled.div`
  height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const MessageItem = styled(motion.div)<{ isUser: boolean }>`
  max-width: 70%;
  margin: ${props => props.isUser ? '10px 0 10px auto' : '10px auto 10px 0'};
  padding: 10px 15px;
  border-radius: 18px;
  background-color: ${props => props.isUser ? '#4A4A4A' : '#8E8CD8'};
  color: white;
`;

const Input = styled.textarea`
  width: 95%;
  background-color: #3D3D3D;
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 16px;
  padding: 10px 15px;
  resize: none;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #8E8CD8;
  }
`;

const Button = styled.button`
  background-color: #8E8CD8;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background-color: #7A78C8;
  }
`;

const FileUploadContainer = styled.div`
  margin-bottom: 20px;
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled.label`
  background-color: #4A4A4A;
  color: white;
  padding: 10px 15px;
  border-radius: 20px;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    background-color: #5A5A5A;
  }
`;

interface Message {
  text: string;
  isUser: boolean;
}

const App: React.FC = () => {
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

    const formData = new FormData();
    formData.append('clinical_file', clinicalFile);
    formData.append('expression_file', expressionFile);

    try {
      const result = await axios.post('http://localhost:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessages(prev => [...prev, { text: `Files uploaded successfully. ${result.data.records} records processed.`, isUser: false }]);
    } catch (error) {
      console.error('Error uploading files:', error);
      setMessages(prev => [...prev, { text: 'An error occurred while uploading files.', isUser: false }]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <AppContainer>
      <Title>Pancreatic Cancer Genomics RAG</Title>
      <ChatContainer>
        <FileUploadContainer>
          <FileInput 
            type="file" 
            id="clinical-file" 
            onChange={(e) => setClinicalFile(e.target.files?.[0] || null)} 
            accept=".tsv"
          />
          <FileLabel htmlFor="clinical-file">Select Clinical Data File</FileLabel>
          <FileInput 
            type="file" 
            id="expression-file" 
            onChange={(e) => setExpressionFile(e.target.files?.[0] || null)} 
            accept=".tsv"
          />
          <FileLabel htmlFor="expression-file">Select Expression Data File</FileLabel>
          <Button onClick={handleFileUpload}>Upload Files</Button>
        </FileUploadContainer>
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your query here..."
            rows={3}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Send Query'}
          </Button>
        </form>
      </ChatContainer>
    </AppContainer>
  );
};

export default App;
