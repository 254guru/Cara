/**
 * M-Pesa Daraja API integration for STK Push (Lipa Na M-Pesa Online).
 *
 * Register at https://developer.safaricom.co.ke to get credentials.
 * Set MPESA_ENV=sandbox for testing, MPESA_ENV=production for live.
 */

const SANDBOX_URL = 'https://sandbox.safaricom.co.ke';
const PRODUCTION_URL = 'https://api.safaricom.co.ke';

function getBaseUrl(): string {
  return process.env.MPESA_ENV === 'production' ? PRODUCTION_URL : SANDBOX_URL;
}

/** Get an OAuth token from Safaricom */
async function getAccessToken(): Promise<string> {
  const key = process.env.MPESA_CONSUMER_KEY;
  const secret = process.env.MPESA_CONSUMER_SECRET;

  if (!key || !secret) throw new Error('M-Pesa credentials not configured');

  const auth = Buffer.from(`${key}:${secret}`).toString('base64');

  const res = await fetch(
    `${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` } },
  );

  if (!res.ok) throw new Error(`M-Pesa auth failed: ${res.statusText}`);

  const data = await res.json();
  return data.access_token;
}

/** Generate the password for STK push */
function generatePassword(timestamp: string): string {
  const shortcode = process.env.MPESA_SHORTCODE || '174379';
  const passkey = process.env.MPESA_PASSKEY || '';
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
}

/** Format a timestamp for M-Pesa: YYYYMMDDHHmmss */
function getTimestamp(): string {
  const now = new Date();
  return now
    .toISOString()
    .replace(/[-T:.Z]/g, '')
    .slice(0, 14);
}

export interface StkPushRequest {
  phone: string; // e.g. "254712345678"
  amount: number;
  orderId: string;
  description?: string;
}

export interface StkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

/** Initiate an STK Push (Lipa Na M-Pesa Online) */
export async function initiateSTKPush(req: StkPushRequest): Promise<StkPushResponse> {
  const token = await getAccessToken();
  const timestamp = getTimestamp();
  const shortcode = process.env.MPESA_SHORTCODE || '174379';

  const payload = {
    BusinessShortCode: shortcode,
    Password: generatePassword(timestamp),
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.ceil(req.amount),
    PartyA: req.phone,
    PartyB: shortcode,
    PhoneNumber: req.phone,
    CallBackURL: process.env.MPESA_CALLBACK_URL || '',
    AccountReference: req.orderId,
    TransactionDesc: req.description || `Payment for order ${req.orderId}`,
  };

  const res = await fetch(`${getBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`STK Push failed: ${err}`);
  }

  return res.json();
}

/** Query the status of an STK Push transaction */
export async function querySTKStatus(checkoutRequestId: string) {
  const token = await getAccessToken();
  const timestamp = getTimestamp();
  const shortcode = process.env.MPESA_SHORTCODE || '174379';

  const res = await fetch(`${getBaseUrl()}/mpesa/stkpushquery/v1/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BusinessShortCode: shortcode,
      Password: generatePassword(timestamp),
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    }),
  });

  if (!res.ok) throw new Error(`STK query failed: ${res.statusText}`);
  return res.json();
}
