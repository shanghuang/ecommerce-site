'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useSocketClient } from '../hooks/useSocket';

interface ProductChatProps {
  productId: string;
  providerEmail: string;
}

export const ProductChat = ({ productId, providerEmail }: ProductChatProps) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: string; content: string }>>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { sendMessage, onReceiveMessage, registerUser, onReceivePreviousMessage } = useSocketClient();
  //const [latestMessageId, setLatestMessageId] = useState('');
  const latestMessageId = useRef('');

  // Function to load more messages
  const loadMoreMessages = useCallback(async () => {
    if (isLoadingMore || !hasMoreMessages || messages.length === 0) return;

    setIsLoadingMore(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const oldestTimestamp = new Date(messages[0].timestamp).toISOString();
      const response = await fetch(
        `/api/messages?buyerEmail=${providerEmail}&before=${oldestTimestamp}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      const data = await response.json();
      
      if (data.messages.length > 0) {
        setMessages(prev => [...data.messages, ...prev]);
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMoreMessages, messages, productId]);

  // Scroll handler
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop === 0 && hasMoreMessages) {
        loadMoreMessages();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [loadMoreMessages, hasMoreMessages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(productId, providerEmail, message);
      setMessages((prev) => [...prev, { sender: 'You', content:message, timestamp: new Date() }]);
      setMessage('');
    }
  };

  
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      const response = await fetch(`/api/messages?buyerEmail=${providerEmail}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });
      const data = await response.json();
      console.log('Fetched messages:', data);
      setMessages(data.messages);
    }
    fetchMessages();
  }, [productId, providerEmail]);


  useEffect(() => {
      console.log("ProductChat::useEffect");
      const email = localStorage.getItem('email');
      const username = "user";//localStorage.getItem('username');
      const userId = localStorage.getItem('userId');
      registerUser(email!, username!, userId!);

      return () => {
        onReceiveMessage(() => {});
      };
    }, [registerUser, onReceiveMessage]
  );

  onReceiveMessage((receivedMessage: any) => {

      console.log("message._id:"+receivedMessage.messageId+"::latestMessageId:"+latestMessageId);
      console.log("receivedMessage:");console.log(receivedMessage);
      if( receivedMessage.messageId !== latestMessageId.current){
      //if (receivedMessage.senderId !== 'buyer') {
        setMessages((prev) => [
          ...prev,
          { 
            sender: receivedMessage.email , 
            content: receivedMessage.message,
            timestamp: new Date()  
          },
        ]);
        latestMessageId.current = receivedMessage.messageId;
      }
      //setLatestMessageId(receivedMessage.messageId);
      //}
    });
  
  /*onReceivePreviousMessage((receivedMessages: any) => {

    console.log("receivedMessages:");console.log(receivedMessages);
    let previousMessages: any[] = [];
    receivedMessages.forEach(message => {
      previousMessages.push({
        sender: message.email,
        message: message.message, 
      });
    });
    
    setMessages((prev) => previousMessages.concat(prev));
  });*/

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-xl font-semibold mb-4">Contact Provider</h3>
      
      <div 
        ref={messagesContainerRef}
        className="space-y-4 max-h-64 overflow-y-auto mb-4 relative"
      >
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`p-3 rounded-lg ${
            msg.sender === 'You' ? 'bg-blue-100 ml-auto max-w-[80%]' : 'bg-gray-100 mr-auto max-w-[80%]'
          }`}>
            <div className="font-semibold">{msg.sender}</div>
            <div>{msg.content}</div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
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