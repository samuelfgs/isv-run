import crypto from 'crypto';

/**
 * Verifies the authenticity of a Mercado Pago webhook notification
 * @param body - Raw request body as string
 * @param signature - x-signature header from the request
 * @param requestId - x-request-id header from the request
 * @param secret - Webhook secret from Mercado Pago dashboard
 * @returns boolean indicating if the signature is valid
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  requestId: string,
  secret: string
): boolean {
  try {
    // Mercado Pago webhook signature format: HMAC-SHA256(request_id:body, secret)
    const dataToSign = `${requestId}:${body}`;

    // Create HMAC using SHA256
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(dataToSign);
    const computedSignature = hmac.digest('hex');

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(computedSignature)
    );
  } catch (error) {
    console.error('Webhook signature verification error:', error);
    return false;
  }
}
