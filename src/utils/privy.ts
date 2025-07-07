// import jwt from 'jsonwebtoken';
// import jwksClient from 'jwks-rsa';

// // Privy App configuration
// const PRIVY_APP_ID = process.env.PRIVY_APP_ID || 'cmc8ngwxy00cvlb0mqxp712qc';
// const PRIVY_ISSUER = process.env.PRIVY_ISSUER || 'https://auth.privy.io';
// const PRIVY_AUDIENCE = process.env.PRIVY_AUDIENCE || PRIVY_APP_ID;
// const PRIVY_JWKS_URI = `https://auth.privy.io/api/v1/apps/${PRIVY_APP_ID}/jwks.json`;

// // jwks-rsa client with caching and rate limiting
// const client = jwksClient({
//   jwksUri: PRIVY_JWKS_URI,
//   cache: true,
//   cacheMaxEntries: 5,
//   cacheMaxAge: 10 * 60 * 1000, // 10 minutes
//   rateLimit: true,
//   jwksRequestsPerMinute: 10,
// });

// // Callback to retrieve the signing key
// export function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
//   client.getSigningKey(header.kid as string, (err, key: any) => {
//     if (err) return callback(err, undefined);
//     const signingKey = key.getPublicKey();
//     callback(null, signingKey);
//   });
// }

// // Verify a Privy ID token using JWKS
// export function verifyPrivyIdToken(idToken: string): Promise<any> {
//   return new Promise((resolve, reject) => {
//     jwt.verify(
//       idToken,
//       getKey,
//       {
//         issuer: PRIVY_ISSUER,
//         audience: PRIVY_AUDIENCE,
//         algorithms: ['ES256'],
//       },
//       (err, decoded) => {
//         if (err) return reject(err);
//         resolve(decoded);
//       }
//     );
//   });
// }

// import { PrivyClient } from '@privy-io/server-auth';

// // Initialize Privy client with App ID and App Secret
// const PRIVY_APP_ID     = process.env.PRIVY_APP_ID!;
// const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET!;

// if (!PRIVY_APP_ID || !PRIVY_APP_SECRET) {
//   throw new Error('Missing PRIVY_APP_ID or PRIVY_APP_SECRET');
// }

// export const privy = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET);