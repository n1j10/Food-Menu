import { randomUUID } from 'crypto';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import db from '@/utils/db';

const SUCCESS = 'SUCCESS';
const UAT_BASE_URL = 'https://pg-api-uat.zaincash.iq';

type JsonRecord = Record<string, unknown>;

export class ZainCashError extends Error {}

let accessTokenCache: { token: string; expiresAt: number } | undefined;

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new ZainCashError(`Missing required environment variable: ${name}`);
  return value;
}

function baseUrl() {
  const url = (process.env.ZAINCASH_BASE_URL || UAT_BASE_URL).replace(/\/$/, '');
  if (!/^https:\/\//.test(url)) throw new ZainCashError('ZAINCASH_BASE_URL must use HTTPS');
  return url;
}

export function websiteUrl() {
  const url = requiredEnv('WEBSITE_URL').replace(/\/$/, '');
  if (!/^https:\/\//.test(url)) {
    throw new ZainCashError('WEBSITE_URL must be an HTTPS URL');
  }
  return url;
}

function asRecord(value: unknown): JsonRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ZainCashError('Unexpected response from ZainCash');
  }
  return value as JsonRecord;
}

function asOptionalRecord(value: unknown): JsonRecord | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as JsonRecord)
    : undefined;
}

function zainCashErrorMessage(payload: JsonRecord) {
  const err = asOptionalRecord(payload.err);
  const msg = err && typeof err.msg === 'string' ? err.msg : undefined;
  if (msg) return msg;
  const detail = typeof payload.detail === 'string' ? payload.detail : undefined;
  if (detail) return detail;
  const title = typeof payload.title === 'string' ? payload.title : undefined;
  if (title && payload.status) return title;
  return undefined;
}

export function getString(payload: JsonRecord, ...keys: string[]) {
  // ZainCash v2 uses different envelopes depending on the endpoint: payment
  // creation returns `transactionDetails`, while callbacks put values in `data`.
  const nested = [
    payload,
    asOptionalRecord(payload.data),
    asOptionalRecord(payload.transaction),
    asOptionalRecord(payload.transactionDetails),
    asOptionalRecord(payload.customer),
  ];
  for (const source of nested) {
    if (!source) continue;
    for (const key of keys) {
      const value = source[key];
      if (typeof value === 'string' && value) return value;
    }
  }
  return undefined;
}

export function verifyCallbackToken(token: string): JsonRecord {
  const decoded = jwt.verify(token, requiredEnv('ZAINCASH_API_KEY'), {
    algorithms: ['HS256'],
  });
  if (typeof decoded === 'string') throw new ZainCashError('Invalid ZainCash callback token');
  return decoded as JwtPayload as JsonRecord;
}

/** ZainCash appends ?token= to the redirect URL; tolerate legacy URLs that included ?result=... */
export function extractCallbackToken(search: string) {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const direct = params.get('token');
  if (direct) return direct;

  for (const value of params.values()) {
    const embedded = value.match(/(?:^|\?)token=(.+)$/);
    if (embedded?.[1]) return embedded[1];
  }

  const fromQuery = search.match(/[?&]token=([^&]+)/);
  return fromQuery?.[1] ?? null;
}

async function getAccessToken() {
  if (accessTokenCache && accessTokenCache.expiresAt > Date.now()) return accessTokenCache.token;

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: requiredEnv('ZAINCASH_CLIENT_ID'),
    client_secret: requiredEnv('ZAINCASH_CLIENT_SECRET'),
    scope: process.env.ZAINCASH_SCOPE || 'payment:read payment:write',
  });
  const response = await fetch(`${baseUrl()}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    cache: 'no-store',
  });
  const data = asRecord(await response.json().catch(() => null));
  if (!response.ok || typeof data.access_token !== 'string') {
    throw new ZainCashError('Could not authenticate with ZainCash');
  }

  const expiresIn = typeof data.expires_in === 'number' ? data.expires_in : 300;
  accessTokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + Math.max(30, expiresIn - 60) * 1000,
  };
  return accessTokenCache.token;
}

async function zainCashRequest(path: string, init: RequestInit = {}) {
  const response = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${await getAccessToken()}`,
      'Content-Type': 'application/json',
      ...init.headers,
    },
    cache: 'no-store',
  });
  const data = await response.json().catch(() => null);
  const payload = asRecord(data);
  if (!response.ok) {
    throw new ZainCashError(zainCashErrorMessage(payload) || 'ZainCash rejected the payment request');
  }
  const apiError = zainCashErrorMessage(payload);
  if (apiError) throw new ZainCashError(apiError);
  return payload;
}

export async function createZainCashPayment(input: {
  externalReferenceId: string;
  orderId: string;
  amount: number;
}) {
  const data = await zainCashRequest('/api/v2/payment-gateway/transaction/init', {
    method: 'POST',
    body: JSON.stringify({
      language: (process.env.ZAINCASH_LANGUAGE || 'ar').toLowerCase(),
      externalReferenceId: input.externalReferenceId,
      orderId: input.orderId,
      serviceType: process.env.ZAINCASH_SERVICE_TYPE || 'ECOMMERCE',
      amount: { value: input.amount, currency: 'IQD' },
      redirectUrls: {
        successUrl: `${websiteUrl()}/api/payment/callback`,
        failureUrl: `${websiteUrl()}/api/payment/callback`,
      },
    }),
  });
  const redirectUrl = getString(data, 'redirectUrl', 'redirect_url');
  const transactionId = getString(data, 'transactionId', 'transaction_id');
  if (!redirectUrl || !transactionId) throw new ZainCashError('ZainCash did not return a payment URL');
  return { redirectUrl, transactionId };
}

export async function startZainCashCheckout(input: {
  clerkId: string;
  orderId: string;
  cartId: string;
}) {
  const [order, cart] = await Promise.all([
    db.order.findFirst({ where: { id: input.orderId, clerkId: input.clerkId } }),
    db.cart.findFirst({ where: { id: input.cartId, clerkId: input.clerkId } }),
  ]);
  if (!order || !cart) throw new ZainCashError('Order not found');
  if (order.isPaid) throw new ZainCashError('Order has already been paid');
  if (!Number.isSafeInteger(order.orderTotal) || order.orderTotal <= 0) {
    throw new ZainCashError('Invalid order amount');
  }

  const existing = await db.zainCashPayment.findFirst({
    where: {
      orderId: input.orderId,
      status: { in: ['INITIATING', 'PENDING', 'OTP_SENT', 'CUSTOMER_AUTHENTICATION_REQUIRED'] },
    },
    orderBy: { createdAt: 'desc' },
  });
  if (existing?.redirectUrl) return { redirectUrl: existing.redirectUrl };

  const payment = await db.zainCashPayment.create({
    data: {
      orderId: input.orderId,
      cartId: input.cartId,
      externalReferenceId: randomUUID(),
      amount: order.orderTotal,
    },
  });

  try {
    const result = await createZainCashPayment({
      externalReferenceId: payment.externalReferenceId,
      orderId: input.orderId,
      amount: order.orderTotal,
    });
    await db.zainCashPayment.update({
      where: { id: payment.id },
      data: { status: 'PENDING', transactionId: result.transactionId, redirectUrl: result.redirectUrl },
    });
    return { redirectUrl: result.redirectUrl };
  } catch (error) {
    const message = error instanceof ZainCashError ? error.message : 'Unable to start payment';
    await db.zainCashPayment.update({
      where: { id: payment.id },
      data: { status: 'INIT_FAILED', failureReason: message },
    });
    throw error instanceof ZainCashError ? error : new ZainCashError(message);
  }
}

export async function inquireZainCashPayment(transactionId: string) {
  const data = await zainCashRequest(
    `/api/v2/payment-gateway/transaction/inquiry/${encodeURIComponent(transactionId)}`
  );
  const status = getString(data, 'status', 'currentStatus', 'transactionStatus', 'paymentStatus');
  if (!status) throw new ZainCashError('ZainCash inquiry did not return a status');
  return {
    status,
    walletPhone: getString(data, 'walletNumber', 'walletPhone', 'phone', 'customerPhone', 'customerMsisdn'),
  };
}

export async function settleZainCashPayment(input: {
  transactionId: string;
  status: string;
  walletPhone?: string;
}) {
  const status = input.status.toUpperCase();
  return db.$transaction(
    async (tx) => {
      const payment = await tx.zainCashPayment.findUnique({
        where: { transactionId: input.transactionId },
        include: { order: true },
      });
      if (!payment) throw new ZainCashError('Payment transaction was not found');
      if (payment.status === SUCCESS) return payment;

      const updated = await tx.zainCashPayment.update({
        where: { id: payment.id },
        data: { status, walletPhone: input.walletPhone },
      });
      if (status === SUCCESS && !payment.order.isPaid) {
        await tx.order.update({ where: { id: payment.orderId }, data: { isPaid: true } });
        await tx.cart.deleteMany({
          where: { id: payment.cartId, clerkId: payment.order.clerkId },
        });
      }
      return updated;
    },
    { isolationLevel: 'Serializable' }
  );
}
