const API_BASE_URL = 'http://localhost:9000/demoapp/v1.0/HLF';

export const submitPrivateTransaction = async (requestData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submitTransactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const privateQuery = async (queryParams) => {
  try {
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    const response = await fetch(`${API_BASE_URL}/getTransactions?${queryString}`, {
      method: 'GET',
    });

    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const submitPublicTransaction = async (requestData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/submitTransactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const publicQuery = async (queryParams) => {
  try {
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    const response = await fetch(`${API_BASE_URL}/getTransactions?${queryString}`, {
      method: 'GET',
    });

    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getBlockHeight = async (channelName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/getBlockHeight?channelName=${channelName}`, {
      method: 'GET',
    });

    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const subscribeEvent = async (eventData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/subscribeEvent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getSubscriptionList = async (channelName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/getSubscribeList`, {
      method: 'GET',
    });

    return response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};
