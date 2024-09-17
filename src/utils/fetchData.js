import {refreshTokens} from './authUtils.js';
import {API_URL} from '@env';

export const fetchData = async ({
  url,
  headers,
  method = 'GET',
  body = null,
  setLoading,
  returnsData = true,
}) => {
  try {
    setLoading(true);

    const options = {
      headers,
      method,
      ...(body && {body: JSON.stringify(body)}),
    };

    const response = await fetch(`${API_URL}${url}`, options);
    // console.log(response);
    const data = returnsData ? await response?.json() : null;

    if (response.ok) {
      return {
        success: true,
        status: response.status,
        data: data,
      };
    } else if (response.status === 401) {
      const tokensRefreshed = await refreshTokens();

      if (tokensRefreshed) {
        return await fetchData(
          url,
          headers,
          (method = 'GET'),
          (body = null),
          setLoading,
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
    console.error(error);
  } finally {
    setLoading(false);
  }
};
