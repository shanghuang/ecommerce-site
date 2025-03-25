'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { io as ClientIO } from 'socket.io-client';

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    /*const socketInstance = new (ClientIO as any)("http://localhost:3000", {
      path: '/api/socket',
      addTrailingSlash: false,
    });*/

    const socketInstance = ClientIO();

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server'); console.log(socketInstance.id);
      //socketInstance.emit('register_user', JSON.stringify({ email, username, userId }););
      //socketInstance.emit('join_product_room', '123');
      //socketInstance.emit('send_message', '123');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    /*socketInstance.onAnyOutgoing((arguments) => {
      console.log('Outgoing event:', arguments);
    });*/

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
