const headers = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT',
};

export function createResponse(statusCode, customBody) {
  const body = customBody || getStandardBody(statusCode);
  return {
    statusCode,
    body,
    headers,
    isBase64Encoded: false,
  };
}

function getStandardBody(statusCode) {
  switch (statusCode) {
    case 400:
      return { error: 'Bad request' };
    case 500:
      return { error: 'Internal server error' };
    default:
      return { message: 'No response' };
  }
}
