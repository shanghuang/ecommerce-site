// models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  //senderId: { type: String, required: true },
  senderEmail: { type: String, required: true },
  //receiverId: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  //senderType: { type: String, enum: ['buyer', 'provider'], required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  //readBy: [{ type: String }],
  /*metadata: {
    attachments: [{ type: String }],
    systemMessage: { type: Boolean, default: false }
  }*/
});

export default mongoose.models.Message || mongoose.model('Message', messageSchema);