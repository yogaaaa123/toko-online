import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const secretKey = process.env.JWT_SECRET || 'default-secret-key-change-in-production';
const verifiedSecret = new TextEncoder().encode(secretKey);

export async function signToken(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // Token expires in 1 day
    .sign(verifiedSecret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, verifiedSecret);
    return payload;
  } catch {
    return null;
  }
}
