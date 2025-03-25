/*import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';

// Create a map to store the Socket.IO server instance
const ioMap = new Map();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!ioMap.has('io')) {
    // Initialize the Socket.IO server
    const io = new Server(res.socket?.server);
    ioMap.set('io', io);

    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      socket.on('join_product_room', (productId: string) => {
        socket.join(`product_${productId}`);
        console.log(`User ${socket.id} joined product room ${productId}`);
      });

      socket.on('send_message', ({ productId, senderId, message }) => {
        io.to(`product_${productId}`).emit('receive_message', {
          senderId,
          message,
          timestamp: new Date(),
        });
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  }

  // Attach the Socket.IO instance to the response
  res.socket.server.io = ioMap.get('io');
  res.end();
}
*/
import { NextResponse } from 'next/server';
import { Server } from 'socket.io';
import {createServer} from 'http';

let io: Server;

export async function GET() {
  if (!io) {
    const httpServer = createServer();

    io = new Server(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
    });
    /*io = new Server({
      path: '/api/socket',
      addTrailingSlash: false,
    });*/

    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);

      socket.on('join_product_room', (productId: string) => {
        socket.join(`product_${productId}`);
        console.log(`User ${socket.id} joined product room ${productId}`);
      });

      socket.on('send_message', ({ productId, senderId, message }) => {
        io.to(`product_${productId}`).emit('receive_message', {
          senderId,
          message,
          timestamp: new Date(),
        });
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    httpServer.listen(3001, () => {
      console.log('Socket.IO server running on port 3001');
    });
  }

  return NextResponse.json({ success: true });
}
