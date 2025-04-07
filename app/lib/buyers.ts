import Message from '../../serverLib/models/message.mjs';

export interface Buyer {
  email: string;
  name: string;
  lastMessageAt: Date;
}

export async function getBuyersForProvider(providerEmail: string): Promise<Buyer[]> {
  try {
    console.log('getBuyersForProvider::providerEmail:', providerEmail);
    const buyers = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderEmail: providerEmail },
            { receiverEmail: providerEmail }
          ]
        }
      },
      {
        $project: {
          buyerEmail: {
            $cond: [
              { $ne: ['$senderEmail', providerEmail] },
              '$senderEmail',
              '$receiverEmail'
            ]
          },
          buyerName: {
            $cond: [
              { $ne: ['$senderEmail', providerEmail] },
              '$senderName',
              '$receiverName'
            ]
          },
          timestamp: 1
        }
      },
      {
        $group: {
          _id: '$buyerEmail',
          name: { $first: '$buyerName' },
          lastMessageAt: { $max: '$timestamp' }
        }
      },
      {
        $match: {
          _id: { $ne: providerEmail }
        }
      },
      {
        $sort: { lastMessageAt: -1 }
      },
      {
        $project: {
          email: '$_id',
          name: 1,
          lastMessageAt: 1,
          _id: 0
        }
      }
    ]);

    return buyers;
  } catch (error) {
    console.error('Error fetching buyers:', error);
    throw error;
  }
}