// Create clients and set shared const values outside of the handler.

// Load the AWS SDK
const AWS = require("aws-sdk");

const region = "us-east-1";
const secretName = "OCTODASH_SECRETS";

const headers = {
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "https://octodash.mikejancar.com",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
};

/**
 * Creates an octodash client session
 */
exports.createSession = async (event) => {
  console.info("received:", event);

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 400,
      headers,
      body: "Bad request",
    };
  }

  var secretsManager = new AWS.SecretsManager({
    region: region,
  });

  secretsManager.getSecretValue({ SecretId: secretName }, function (err, data) {
    if (err) {
      console.log(err);
      return {
        statusCode: 500,
        headers,
        body: "Internal server error",
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data),
      };
    }
  });
};
