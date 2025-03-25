'use client';
import { useSocket } from '../components/SocketProvider';

export const useSocketClient = () => {
  const { socket, isConnected } = useSocket();

  const joinProductRoom = (productId: string) => {
    if (socket) {
      socket.emit('join_product_room', productId);
    }
  };

  const sendMessage = (productId: string, senderId: string, message: string) => {
    if (socket) {
      socket.emit('send_message', { productId, senderId, message });
    }
  };

  const onReceiveMessage = (callback: (message: any) => void) => {
    if (socket) {
      socket.on('receive_message', callback);
    }
  };

  return {
    isConnected,
    joinProductRoom,
    sendMessage,
    onReceiveMessage,
  };
};
