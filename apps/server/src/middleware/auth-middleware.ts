import { 
  CognitoIdentityProviderClient, 
  GetUserCommand 
} from "@aws-sdk/client-cognito-identity-provider";
import { type Request, type Response, type NextFunction } from 'express';

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const encodedToken = authHeader?.split(' ')[1]; // Bearer TOKEN

    //console.log('[Auth Middleware] Encoded token:', encodedToken);

    if (!encodedToken) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      // Decode the base64 token
      const accessToken = Buffer.from(encodedToken, 'base64').toString();

      // Verify the token is valid with Cognito
      const command = new GetUserCommand({
        AccessToken: accessToken
      });

      const response = await client.send(command);
      console.log('[Auth Middleware] Authenticated user:', response?.Username);
      next();
    } catch (decodeError) {
      console.error('[Auth Middleware] Token decode error:', decodeError);
      return res.status(401).json({ message: 'Invalid token format' });
    }
    
  } catch (error: any) {
    console.error('[Auth Middleware] error:', error);
    
    if (error.name === 'NotAuthorizedException') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    return res.status(500).json({ message: 'Authentication error' });
  }
}; 