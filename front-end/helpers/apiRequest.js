const allowedDataRequest = require('./allowedDataRequest');

async function apiRequest(req, method, endpoint, data = null) {
  try {
    const token = req.session.token || null;
    const postData = allowedDataRequest(method, token, data);
    const response = await fetch(`http://localhost:3000${endpoint}`, postData);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.data?.result || 'Request failed');
    }

    return json.data;
  } catch (error) {
    throw error instanceof Error ? error : new Error('Request failed');
  }
}
module.exports = apiRequest;
