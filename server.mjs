import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import Message from './serverLib/models/message.mjs';
import dbConnect from './serverLib/mongodb.mjs'; 

const connectedUsersByEmail = new Map();
const connectedUsersBySocket = new Map();

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(async () => {
  const httpServer = createServer(handler);

  await dbConnect();
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log('A user connected:', socket.id);

    /*socket.onAny((eventName, ...args) => {
      console.log(`Event: ${eventName}, Args: ${args}`);
    });*/

    socket.on('join_product_room', (productId) => {
      socket.join(`product_${productId}`);
      console.log(`User ${socket.id} joined product room ${productId}`);
    });

    // Event to register a user
    socket.on('register_user', (param) => {
      // Store user information
      const { email, username, userId } = JSON.parse(param);
      connectedUsersByEmail.set(email, {
        socketId: socket.id,
        email:email,
        userId: userId,
        username: username
      });
      connectedUsersBySocket.set(socket.id, {
        socketId: socket.id,
        email:email,
        userId: userId,
        username: username
      });
      
      console.log(`User registered: ${email} ${userId} (${socket.id})`);
      console.log('Current connected users:', [...connectedUsersByEmail.values()]);
    });

      //socket.on('send_message', ({ productId, senderId, message }) => {
      socket.on('send_message', async (param) => {
        console.log('param:', param);
        const { productId, receiverEmail, message } = JSON.parse(param);
        console.log(`User ${socket.id} send_message ${message}`);
        if(!connectedUsersByEmail.has(receiverEmail)) {
          console.log(`User ${receiverEmail} is not connected`);
          return;
        }
        const peerInfo = connectedUsersByEmail.get(receiverEmail);
        
        console.log(`peerInfo: ${peerInfo}`);console.log(peerInfo);
        const myInfo = connectedUsersBySocket.get(socket.id);
        console.log(`User ${socket.id} send_message ${message} to ${peerInfo.socketId}`);
        

        try {
          console.log('Saving message:', message);
          // Save message to database
          const newMessage = new Message({
            productId,
            senderEmail: myInfo.email,
            receiverEmail, 
            message
          });
          await newMessage.save();

          console.log('Saving message2:', message);
          io.to(peerInfo.socketId).emit('receive_message', {
            email : myInfo.email,
            productId: productId,
            message,
            messageId: newMessage._id.toString(),
            timestamp: new Date(),
          });
          console.log('messageId:', newMessage._id.toString());
        } catch (err) {
          console.error('Error saving message:', err);
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});