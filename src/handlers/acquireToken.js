import fetch from 'node-fetch';
import { createResponse } from '../core/response';

const AWS = require('aws-sdk');

const region = 'us-east-1';
const secretName = 'OCTODASH_SECRETS';

/**
 * Acquires a GitHub access token for the current session
 */
exports.acquireToken = async (event) => {
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

  var secretsManager = new AWS.SecretsManager({
    region: region,
  });

  try {
    const secretData = await secretsManager.getSecretValue({ SecretId: secretName }).promise();

    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      body: { clientId: secretData.githubClientId, clientSecret: secretData.githubClientSecret, sessionCode },
      headers: { Accept: 'application/json' },
    });
    const accessToken = response.json();

    return createResponse(200, { accessToken });
  } catch (error) {
    console.log(error);
    return createResponse(500);
  }
};
