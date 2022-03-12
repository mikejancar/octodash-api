import { SecretsManager } from '@aws-sdk/client-secrets-manager';
import fetch from 'node-fetch';
import { createResponse } from '../core/response.js';

const region = 'us-east-1';
const secretName = 'OCTODASH_SECRETS';

/**
 * Acquires a GitHub access token for the current session
 */
export async function acquireToken(event) {
  if (event.httpMethod !== 'POST') {
    console.log(`Invalid method: ${event.httpMethod}`);
    return createResponse(400);
  }

  if (!event.body) {
    console.log(`Missing body`);
    return createResponse(400);
  }

  let sessionCode = '';
  try {
    const eventBody = JSON.parse(event.body);
    if (!eventBody.sessionCode) {
      console.log(`Missing sessionCode`);
      return createResponse(400);
    }
    sessionCode = eventBody.sessionCode;
  } catch (error) {
    console.log(error);
    return createResponse(400);
  }

  var secretsManager = new SecretsManager({
    region: region,
  });

  try {
    const secretData = await secretsManager.getSecretValue({ SecretId: secretName });
    const secretJson = JSON.parse(secretData.SecretString);

    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      body: { client_id: secretJson.githubClientId, client_secret: secretJson.githubClientSecret, code: sessionCode },
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      const responseText = await response.text();
      console.log(`Failed to acquire token: ${response.status} - ${responseText}`);
      return createResponse(response.status, { error: 'Failed to acquire token' });
    }

    const accessToken = await response.json();
    return createResponse(200, { accessToken });
  } catch (error) {
    console.log(error);
    return createResponse(500);
  }
}
