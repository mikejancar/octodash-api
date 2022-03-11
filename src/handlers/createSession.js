import { createResponse } from '../core/response';

const AWS = require('aws-sdk');

const region = 'us-east-1';
const secretName = 'OCTODASH_SECRETS';

/**
 * Creates an octodash client session
 */
exports.createSession = async (event) => {
  if (event.httpMethod !== 'POST') {
    console.log(`Invalid method: ${event.httpMethod}`);
    return createResponse(400);
  }

  var secretsManager = new AWS.SecretsManager({
    region: region,
  });

  try {
    const secretData = await secretsManager.getSecretValue({ SecretId: secretName }).promise();

    return createResponse(200, { githubClientId: secretData.SecretString.githubClientId });
  } catch (error) {
    console.log(error);
    return createResponse(500);
  }
};
