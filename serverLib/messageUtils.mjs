import Message from './models/message.mjs';

async function saveMessage(sender, receiver, message) {
  try {
    const productId = "productId"; // Placeholder, replace with actual productId if needed
    const newMessage = new Message({
      productId,
      senderEmail:sender,
      receiverEmail:receiver,
      message,
      timestamp: new Date(),
    });
    
    const savedMessage = await newMessage.save();
    return savedMessage;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
}

/*
export async function getMessagesForPair(
  senderEmail: string,
  receiverEmail: string,
  limit: number = 20,
  skip: number = 0
): Promise<ChatMessage[]> {
*/
async function getMessagesForPair(
  senderEmail,
  receiverEmail,
  limit,
  skip
){
  try {
    limit = limit || 20;
    skip = skip || 0;
    console.log(`getMessagesForPair: senderEmail=${senderEmail}, receiverEmail=${receiverEmail}, limit=${limit}, skip=${skip}`);
    const messages = await Message.find({
      $or: [
        {
          senderEmail: senderEmail,
          receiverEmail: receiverEmail
        },
        {
          senderEmail: receiverEmail,
          receiverEmail: senderEmail
        }
      ]
    })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .exec();

    const reversedMessages = messages.reverse();

    console.log(`getMessagesForPair: messages=${messages.length}`);
    return reversedMessages.map(message => ({
      content: message.message,
      senderEmail: message.senderEmail,
      receiverEmail: message.receiverEmail,
      timestamp: message.timestamp
    }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
}

export {saveMessage, getMessagesForPair};