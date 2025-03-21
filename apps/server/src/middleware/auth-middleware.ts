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
  const authHeader = req.headers.authorization;
  const encodedToken = authHeader?.split(' ')[1]; // Bearer TOKEN

  if (!encodedToken) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const accessToken = Buffer.from(encodedToken, 'base64').toString();
    const command = new GetUserCommand({ AccessToken: accessToken });
    const response = await client.send(command);
    
    console.log('[Auth Middleware] Authenticated user:', response?.Username);
    next();
  } catch (error: any) {
    console.error('[Auth Middleware] error:', error);
    
    const errorResponses = {
      NotAuthorizedException: { status: 401, message: 'Invalid or expired token' },
      InvalidTokenException: { status: 401, message: 'Invalid token format' },
      default: { status: 500, message: 'Authentication error' }
    };

    const errorConfig = errorResponses[error.name as keyof typeof errorResponses] || errorResponses.default;
    return res.status(errorConfig.status).json({ message: errorConfig.message });
  }
}; 