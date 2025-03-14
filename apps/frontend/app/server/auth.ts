import {
    CognitoIdentityProviderClient,
    ConfirmSignUpCommand,
    SignUpCommand,
    InitiateAuthCommand,
  } from "@aws-sdk/client-cognito-identity-provider";

type RegisterActionArgs = {
  email: string;
  password: string;
};

// Taken from: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_cognito-identity-provider_code_examples.html

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export async function RegisterAction({ email, password }: RegisterActionArgs) {
  const command = new SignUpCommand({
    ClientId: process.env.AWS_COGNITO_CLIENT_ID!,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
    ],
  });
  try {
    const response = await client.send(command);
    console.log("[Register Action] response status: ", response.$metadata.httpStatusCode);
    if (response.$metadata.httpStatusCode !== 200) {
      throw new Error("[Register Action] Failed to register user");
    }
    return { success: true };
  } catch (error) {
    console.error("[Register Action] error: ", error);
    return { success: false, error: error };
  }
}

type ConfirmRegistrationActionArgs = {
  email: string;
  code: string;
};
export async function ConfirmRegistrationAction({ email, code }: ConfirmRegistrationActionArgs) {
  const command = new ConfirmSignUpCommand({
    ClientId: process.env.AWS_COGNITO_CLIENT_ID!,
    Username: email,
    ConfirmationCode: code,
  });
  try {
    const response = await client.send(command);
    console.log("[Confirm Registration Action] response status: ", response.$metadata.httpStatusCode);
    if (response.$metadata.httpStatusCode !== 200) {
      throw new Error("[Confirm Registration Action] Failed to confirm user");
    }
    return { success: true };
  } catch (error) {
    console.error("[Confirm Registration Action] error: ", error);
    return { success: false, error: error };
  }
}

type LoginActionArgs = {
  email: string;
  password: string;
};

export async function LoginAction({ email, password }: LoginActionArgs) {
  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.AWS_COGNITO_CLIENT_ID!,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });

  try {
    const response = await client.send(command);
    
    if (response.$metadata.httpStatusCode !== 200) {
      throw new Error("[Login Action] Failed to login user");
    }

    if (!response.AuthenticationResult?.IdToken) {
      throw new Error("[Login Action] No ID token received");
    }

    // Decode the ID token to get user info
    const idToken = response.AuthenticationResult.IdToken;
    const tokenPayload = JSON.parse(atob(idToken.split('.')[1]));
    
    return { 
      success: true, 
      tokens: response.AuthenticationResult,
      user: {
        email,
        sub: tokenPayload.sub,
        // Add any other user details from tokenPayload if needed
      }
    };
  } catch (error) {
    console.error("[Login Action] error: ", error);
    return { success: false, error: error };
  }
}
