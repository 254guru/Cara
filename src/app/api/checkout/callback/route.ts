import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/checkout/callback
 * M-Pesa sends payment confirmation here.
 * This endpoint must be publicly accessible (use ngrok for local dev).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const callback = body?.Body?.stkCallback;

    if (!callback) {
      return NextResponse.json({ ResultCode: 1, ResultDesc: 'Invalid payload' });
    }

    const { ResultCode, CallbackMetadata } = callback;
    const accountRef = callback.AccountReference || '';

    // Find the order by its ID (passed as AccountReference in STK push)
    // If the AccountReference doesn't match, try to find by CheckoutRequestID
    let orderId = accountRef;

    if (ResultCode === 0 && CallbackMetadata?.Item) {
      // Payment successful — extract receipt number
      const items: { Name: string; Value: string | number }[] = CallbackMetadata.Item;
      const receipt = items.find((i) => i.Name === 'MpesaReceiptNumber')?.Value;

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'PAID',
            mpesaReceiptNo: receipt ? String(receipt) : null,
          },
        });
      }
    } else if (orderId) {
      // Payment failed or cancelled
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
      });
    }

    // Safaricom expects a success acknowledgement
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch {
    return NextResponse.json({ ResultCode: 1, ResultDesc: 'Server error' });
  }
}
