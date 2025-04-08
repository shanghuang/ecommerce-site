import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { verifyToken } from '../auth/login/route';import {getMessagesForPair} from '../../../serverLib/messageUtils.mjs';

export async function GET(request: Request) {
  const headersList = await headers();
  const authToken = headersList.get('authorization')?.split(' ')[1];
  
  if (!authToken) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }
  const decoded = verifyToken(authToken);
  const myEmail = decoded?.email;
  const { searchParams } = new URL(request.url);
  const buyerEmail = searchParams.get('buyerEmail');
  const before = searchParams.get('before') || Date.now();
  
  if (!buyerEmail) {
    return NextResponse.json({ error: 'Buyer Email is required' }, { status: 400 });
  }

  try {
    const messages = await getMessagesForPair(buyerEmail, myEmail, before);
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
