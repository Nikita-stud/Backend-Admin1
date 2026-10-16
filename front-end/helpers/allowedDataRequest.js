function allowedDataRequest(method = 'GET', token, data) {
  const request = {
    method: `${method}`,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  if (data) {
    request.body = JSON.stringify(data);
  }
  return request;
}

module.exports = allowedDataRequest;
