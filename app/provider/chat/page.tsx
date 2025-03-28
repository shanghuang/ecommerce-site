'use client';
import { useEffect, useState, useRef } from 'react';
import { useSocketClient } from '../../hooks/useSocket';
import { useCallback } from 'react';

export default function ProviderChatPage() {
  const [messages, setMessages] = useState<Array<{ sender: string, text: string, timestamp: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [productId, setProductId] = useState('all'); // The product being discussed
  const { isConnected, registerUser, joinProductRoom, sendMessage, onReceiveMessage } = useSocketClient();
  const [peerCustomerEmail, setPeerCustomerEmail] = useState('customer-id');
  //const [latestMessageId, setLatestMessageId] = useState('');
  const latestMessageId = useRef('');

  const onReceiveMessageHandler = useCallback((message) => {
    //const parsedMessage = JSON.parse(message);
    console.log("ProviderChatPage::onReceiveMessage::message:"+message.message);
    console.log("message._id:"+message.messageId+"::latestMessageId:"+latestMessageId);
    if( message.messageId !== latestMessageId.current){
      setMessages(prev => [...prev, {
        sender: message.email,
        text: message.message,
        timestamp: new Date().toLocaleTimeString()
      }]);
      latestMessageId.current = message.messageId;
      console.log("set latest message id:"+message.messageId);
    }
    
    if(message.email !== peerCustomerEmail){
      setPeerCustomerEmail(message.email);
    }
  }, [latestMessageId, peerCustomerEmail]);

  
  // Handle incoming messages
  useEffect(() => {
    console.log("ProviderChatPage::useEffect");
    const email = localStorage.getItem('email');
    const username = "user";//localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    registerUser(email!, 'Provider', userId!);
    onReceiveMessage(onReceiveMessageHandler);

    return () => {
      // Clean up the event handler
      onReceiveMessage(() => {});
    }
  }, [ onReceiveMessage,registerUser, onReceiveMessageHandler]);

  const handleSendMessage = () => {
    if (inputMessage.trim() && productId) {
      sendMessage(productId, peerCustomerEmail, inputMessage);
      setMessages(prev => [...prev, {
        sender: 'You',
        text: inputMessage,
        timestamp: new Date().toLocaleTimeString()
      }]);      
      setInputMessage('');
    }
  };

  

  return (
    <div className="flex flex-col h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Provider Chat</h1>
      
      {/* Product Selection */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="p-2 border rounded"
        />
        <button
          onClick={() => joinProductRoom(productId)}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Join Product Room
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4 border p-4 rounded">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <div className="font-semibold">{msg.sender}</div>
            <div>{msg.text}</div>
            <div className="text-sm text-gray-500">{msg.timestamp}</div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 p-2 border rounded"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 p-2 bg-green-500 text-white rounded"
        >
          Send
        </button>
      </div>

      {/* Connection Status */}
      <div className="mt-2 text-sm">
        Connection Status: {isConnected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
}
