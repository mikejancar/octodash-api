import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { createResponse } from '../core/response.js';

const region = 'us-east-1';
const secretName = 'OCTODASH_SECRETS';

/**
 * Creates an octodash client session
 */
export async function createSession(event) {
  if (event.httpMethod !== 'POST') {
    console.log(`Invalid method: ${event.httpMethod}`);
    return createResponse(400);
  }

  var secretsManager = new SecretsManagerClient({
    region: region,
  });

  try {
    const secretData = await secretsManager.getSecretValue({ SecretId: secretName }).promise();

    return createResponse(200, { githubClientId: secretData.SecretString.githubClientId });
  } catch (error) {
    console.log(error);
    return createResponse(500);
  }
}
