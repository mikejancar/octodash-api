import fetch from 'node-fetch';

const AWS = require('aws-sdk');

const region = 'us-east-1';
const secretName = 'OCTODASH_SECRETS';

const headers = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST',
};

/**
 * Acquires a GitHub access token for the current session
 */
exports.acquireToken = async (event) => {
  if (event.httpMethod !== 'POST') {
    console.log(`Invalid method: ${event.httpMethod}`);
    return {
      statusCode: 400,
      headers,
      body: 'Bad request',
    };
  }

  if (!event.body) {
    console.log(`Missing body`);
    return {
      statusCode: 400,
      headers,
      body: 'Bad request',
    };
  }

  let sessionCode = '';
  try {
    const eventBody = JSON.parse(event.body);
    if (!eventBody.sessionCode) {
      console.log(`Missing sessionCode`);
      return {
        statusCode: 400,
        headers,
        body: 'Bad request',
      };
    }
    sessionCode = eventBody.sessionCode;
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      headers,
      body: 'Bad request',
    };
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

    return {
      statusCode: 200,
      headers,
      body: { accessToken },
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      headers,
      body: 'Internal server error',
    };
  }
};
