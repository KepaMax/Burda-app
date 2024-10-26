import {refreshTokens} from './authUtils.js';
import storage from './MMKVStore.js';

export const fetchData = async ({
  url,
  tokenRequired,
  method = 'GET',
  body = null,
  returnsData = true,
  // calledFrom,
}) => {
  try {
    storage.set('loading', true);

    const headers = {
      Accept: 'application/json',
      ...((method === 'POST' || method === 'PUT' || method === 'PATCH') && {
        'Content-Type': 'application/json',
      }),
      ...(tokenRequired && {
        Authorization: `Bearer ${storage.getString('accessToken')}`,
      }),
    };
    // console.log(JSON.stringify(body))

    const options = {
      headers,
      method,
      ...(body && {body: JSON.stringify(body)}),
    };

    const response = await fetch(url, options);
    // console.log(response)
    const data = returnsData ? await response?.json() : null;
    // console.log(data);

    if (response.ok) {
      return {
        success: true,
        status: response.status,
        data: data,
      };
    } else if (response.status === 403) {
      const tokensRefreshed = await refreshTokens();

      if (tokensRefreshed) {
        fetchData(url, tokenRequired, method, body, returnsData);
      }
    } else {
      console.error(`Fetch error: ${response.status} ${response.statusText}`);

      return {
        success: false,
        status: response.status,
        data: data.errors,
      };
    }
  } catch (error) {
    console.error('Error in fetchData:', error);
  } finally {
    storage.set('loading', false);
  }
};
