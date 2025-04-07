'use client';
import { useSocket } from '../components/SocketProvider';

export const useSocketClient = () => {
  const { socket, isConnected } = useSocket();

  const joinProductRoom = (productId: string) => {
    if (socket) {
      socket.emit('join_product_room', productId);
    }
  };

  const registerUser = (email: string, username: string, userId: string) => {
    if (socket) {
      socket.emit('register_user', JSON.stringify({ email, username, userId }));
    }
  };

  const sendMessage = (productId: string, receiverEmail: string, message: string) => {
    if (socket) {
      console.log("sendMessage::productId:"+productId+"::receiverEmail:"+receiverEmail+"::message:"+message);
      const msg = JSON.stringify({ productId, receiverEmail, message });
      console.log("sendMessage::msg:"+msg);
      socket.emit('send_message', msg);//JSON.stringify({ productId, senderId, message }));
      //console.log("sendMessage::socket id:"); console.log(socket.id);
      //socket.emit('send_message', message);
      //socket.emit('join_product_room', message);
    }
  };

  const onReceiveMessage = (callback: (message: any) => void) => {
    if (socket) {
      socket.on('receive_message', callback);
    }
  };

  const onReceivePreviousMessage = (callback: (messages: any) => void) => {
    if (socket) {
      socket.on('previous messages', callback);
    }
  };
  return {
    isConnected,
    registerUser,
    joinProductRoom,
    sendMessage,
    onReceiveMessage,
    onReceivePreviousMessage,
  };
};