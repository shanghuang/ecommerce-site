'use client';
import { useEffect, useState, useRef } from 'react';
import { useSocketClient } from '../hooks/useSocket';

interface ProductChatProps {
  productId: string;
  providerEmail: string;
}

export const ProductChat = ({ productId, providerEmail }: ProductChatProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: string; message: string }>>([]);
  const { sendMessage, onReceiveMessage, registerUser } = useSocketClient();
  //const [latestMessageId, setLatestMessageId] = useState('');
  const latestMessageId = useRef('');

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(productId, providerEmail, message);
      setMessages((prev) => [...prev, { sender: 'You', message }]);
      setMessage('');
    }
  };

  useEffect(() => {
    
    console.log("ProductChat::useEffect");
    const email = localStorage.getItem('email');
    const username = "user";//localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    registerUser(email!, username!, userId!);

    return () => {
      onReceiveMessage(() => {});
    };
  }
    , [registerUser, onReceiveMessage]);

  onReceiveMessage((receivedMessage: any) => {

      console.log("message._id:"+receivedMessage.messageId+"::latestMessageId:"+latestMessageId);
      console.log("receivedMessage:");console.log(receivedMessage);
      if( receivedMessage.messageId !== latestMessageId.current){
      //if (receivedMessage.senderId !== 'buyer') {
        setMessages((prev) => [
          ...prev,
          { sender: receivedMessage.email , message: receivedMessage.message },
        ]);
        latestMessageId.current = receivedMessage.messageId;
      }
      //setLatestMessageId(receivedMessage.messageId);
      //}
    });
  

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-xl font-semibold mb-4">Contact Provider</h3>
      
      <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="p-3 rounded-lg bg-gray-80">
            <strong>{msg.sender}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};