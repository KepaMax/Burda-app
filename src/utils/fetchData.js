import {refreshTokens} from './authUtils.js';
import storage from './MMKVStore.js';

export const fetchData = async ({
  url,
  headers,
  method = 'GET',
  body = null,
  returnsData = true,
}) => {
  try {
    storage.set('loading', true);

    const options = {
      headers,
      method,
      ...(body && {body: JSON.stringify(body)}),
    };

    const response = await fetch(url, options);
    const data = returnsData ? await response?.json() : null;

    if (response.ok) {
      return {
        success: true,
        status: response.status,
        data: data,
      };
    } else if (response.status === 403) {
      const tokensRefreshed = await refreshTokens();

      if (tokensRefreshed) {
        return await fetchData(
          url,
          headers,
          (method = 'GET'),
          (body = null),
          (returnsData = true),
        );
      }
    } else {
      console.error(`Fetch error: ${response.status} ${response.statusText}`);

      return {
        success: false,
        status: response.status,
        error: data.error,
      };
    }
  } catch (error) {
    console.error('Error in fetchData:', error);
  } finally {
    storage.set('loading', false);
  }
};
