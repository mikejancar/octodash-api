const headers = {
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT',
};

exports.createResponse = (status, customBody) => {
  const body = customBody || getStandardBody(status);
  return {
    status,
    body,
    headers,
    isBase64Encoded: false,
  };
};

getStandardBody = (status) => {
  switch (status) {
    case '400':
      return { error: 'Bad request' };
    case '500':
      return { error: 'Internal server error' };
    default:
      return { message: 'No response' };
  }
};
