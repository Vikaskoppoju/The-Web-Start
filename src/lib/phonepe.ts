import crypto from "crypto";

const IS_PROD = process.env.PHONEPE_ENV === "PROD";
const BASE_URL = IS_PROD
  ? "https://api.phonepe.com/apis/hermes"
  : "https://api-preprod.phonepe.com/apis/pg-sandbox";

export const MERCHANT_ID  = process.env.PHONEPE_MERCHANT_ID ?? "";
const SALT_KEY   = process.env.PHONEPE_SALT_KEY ?? "";
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX ?? "1";

function sha256hex(str: string) {
  return crypto.createHash("sha256").update(str).digest("hex");
}

function makeChecksum(data: string, endpoint: string) {
  return sha256hex(data + endpoint + SALT_KEY) + "###" + SALT_INDEX;
}

export interface InitiatePaymentOptions {
  merchantTransactionId: string;
  merchantUserId: string;
  amountPaise: number;          // amount in paise (₹1 = 100 paise)
  redirectUrl: string;
  callbackUrl: string;
  mobileNumber?: string;
}

export async function initiatePayment(opts: InitiatePaymentOptions) {
  const payload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: opts.merchantTransactionId,
    merchantUserId: opts.merchantUserId,
    amount: opts.amountPaise,
    redirectUrl: opts.redirectUrl,
    redirectMode: "REDIRECT",
    callbackUrl: opts.callbackUrl,
    ...(opts.mobileNumber && { mobileNumber: opts.mobileNumber }),
    paymentInstrument: { type: "PAY_PAGE" },
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
  const xVerify = makeChecksum(base64Payload, "/pg/v1/pay");

  const res = await fetch(`${BASE_URL}/pg/v1/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-VERIFY": xVerify },
    body: JSON.stringify({ request: base64Payload }),
  });

  return res.json() as Promise<PhonePeInitiateResponse>;
}

export async function getPaymentStatus(merchantTransactionId: string) {
  const endpoint = `/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}`;
  const xVerify = sha256hex(endpoint + SALT_KEY) + "###" + SALT_INDEX;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": xVerify,
      "X-MERCHANT-ID": MERCHANT_ID,
    },
  });

  return res.json() as Promise<PhonePeStatusResponse>;
}

export function verifyCallbackSignature(base64Response: string, xVerifyHeader: string): boolean {
  const [receivedHash] = xVerifyHeader.split("###");
  const expected = sha256hex(base64Response + SALT_KEY);
  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(receivedHash, "hex")
  );
}

// ── Types ──────────────────────────────────────────────────────────────────────

export interface PhonePeInitiateResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    merchantId: string;
    merchantTransactionId: string;
    instrumentResponse?: {
      type: string;
      redirectInfo?: { url: string; method: string };
    };
  };
}

export interface PhonePeStatusResponse {
  success: boolean;
  code: string;
  message: string;
  data?: {
    merchantId: string;
    merchantTransactionId: string;
    transactionId: string;
    amount: number;
    state: "COMPLETED" | "PENDING" | "FAILED";
    responseCode: string;
    paymentInstrument?: {
      type: string;
      utr?: string;
      upiTransactionId?: string;
    };
  };
}
