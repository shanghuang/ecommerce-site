'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocketClient } from '../../hooks/useSocket';

export default function ProviderChatPage() {
  const [selectedBuyer, setSelectedBuyer] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ sender: string, content: string, timestamp: Date }>>([]);

  const { isConnected, registerUser, joinProductRoom, sendMessage, onReceiveMessage } = useSocketClient();
  const [buyers, setBuyers] = useState([]);//useState<string | null>(null);
  const latestMessageId = useRef('');

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom of the messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to load more messages
  const loadMoreMessages = useCallback(async () => {
    if (isLoadingMore || !hasMoreMessages || !selectedBuyer || messages.length === 0) return;

    setIsLoadingMore(true);
    try {
      const oldestTimestamp = messages[0].timestamp;
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      const response = await fetch(
        `/api/messages?buyerEmail=${selectedBuyer}&before=${oldestTimestamp}`,
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
  }, [isLoadingMore, hasMoreMessages, selectedBuyer, messages]);

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

  useEffect(() => {
    // Fetch the list of buyers when the component mounts
    const fetchBuyers = async () => {
      const buyersList = await getBuyersList();
      if(buyersList?.length > 0) {
        //todo: update only if list changed
        let changed = false;
        if(buyersList.length !== buyers.length) {
          changed = true;
        }
        else{
          for(let i=0; i<buyersList.length; i++){
            if(buyersList[i].email !== buyers[i].email){
              changed = true;
              break;
            }
          }
        }
        if(changed){

          setBuyers(buyersList);
        }
      }
    };

    fetchBuyers();

    // Clean up socket listeners on unmount
    return () => {
      //socket?.off('new_message');
    };
  }, [buyers]);

  useEffect(() => {
    const email = localStorage.getItem('email');
    const username = "user";//localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    registerUser(email!, 'Provider', userId!);
    onReceiveMessage(onReceiveMessageHandler);
    return () => {
      // Clean up the event handler
      onReceiveMessage(() => {});
    }
  });

  // Fetch the list of buyers when the component mounts
  //  .sort by last conversation time
  const getBuyersList = async () => {
    // Fetch the list of buyers from your backend
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch('/api/buyers',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
    const data = await response.json();
    return data.buyers;
  };

  const handleSelectBuyer = async (buyerId: string) => {
    setSelectedBuyer(buyerId);
    // Fetch previous messages for this buyer
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Not authenticated');
    }
    const response = await fetch(`/api/messages?buyerEmail=${buyerId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
    const data = await response.json();
    console.log('Fetched messages:', data);
    setMessages(data.messages);
    
    // Set up socket listener for new messages
    /*socket?.on('new_message', (message) => {
      if (message.sender === buyerId || message.receiver === buyerId) {
        setMessages(prev => [...prev, message]);
      }
    });*/
  };

  const handleSendMessage = (content: string) => {
    if (!selectedBuyer) return;
    /*socket?.emit('send_message', {
      content,
      receiver: selectedBuyer,
    });*/
    if (content.trim() /*&& productId*/) {
      const productId = 'all'; // Replace with actual product ID
      sendMessage(productId, selectedBuyer, content);
      setMessages(prev => [...prev, {
        sender: 'You',
        content: content,
        timestamp: new Date()
      }]);    
    }  
  };

  const onReceiveMessageHandler = useCallback((message) => {
      //const parsedMessage = JSON.parse(message);
      console.log("ProviderChatPage::onReceiveMessage::message:"+message.message);
      console.log("message._id:"+message.messageId+"::latestMessageId:"+latestMessageId);
      if( message.messageId !== latestMessageId.current){
        setMessages(prev => [...prev, {
          sender: message.email,
          content: message.message,
          timestamp: new Date()
        }]);
        latestMessageId.current = message.messageId;
        console.log("set latest message id:"+message.messageId);
      }
      /*if(message.email !== peerCustomerEmail){
        setPeerCustomerEmail(message.email);
      }*/
    }, [latestMessageId]);

  return (
    <div className="flex h-screen">
      {/* Buyer List */}
      <div className="w-1/4 bg-gray-800 p-4">
        <h2 className="text-lg font-bold mb-4">Buyers</h2>
        <ul>
          {buyers?.map(buyer => (
            <li
              key={buyer.email}
              className={`p-2 hover:bg-sky-500 cursor-pointer ${
                selectedBuyer === buyer.email ? 'bg-blue-500' : ''
              }`}
              onClick={() => handleSelectBuyer(buyer.email)}
            >
              {buyer.email}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col p-4">
        <h2 className="text-lg font-bold mb-4">
          {selectedBuyer ? `Chat with ${buyers.find(b => b.id === selectedBuyer)?.name}` : 'Select a buyer'}
        </h2>
        
        {/* Message List */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto pr-4 relative"
          >
            {isLoadingMore && (
              <div className="flex justify-center py-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              </div>
            )}
            <div className="flex flex-col space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === selectedBuyer ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.sender === selectedBuyer
                        ? 'bg-gray-200 text-gray-900'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    <p>{message.content}</p>
                    <div className={`text-xs mt-1 ${
                      message.sender === selectedBuyer ? 'text-gray-500' : 'text-blue-200'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Message Input with improved styling */}
        {selectedBuyer && (
          <div className="mt-4 border-t pt-4">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    handleSendMessage(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input.value.trim()) {
                    handleSendMessage(input.value);
                    input.value = '';
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

