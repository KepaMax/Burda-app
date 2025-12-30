import {refreshTokens} from './authUtils.js';
import storage from './MMKVStore.js';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 saniye

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export const fetchData = async ({
  url,
  tokenRequired,
  method = 'GET',
  body = null,
  returnsData = true,
  retryCount = 0,
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

    const options = {
      headers,
      method,
      ...(body && {body: JSON.stringify(body)}),
    };

    const response = await fetch(url, options);
    
    // 204 No Content veya boş response için JSON parse etme
    let data = null;
    if (returnsData && response.status !== 204) {
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : null;
      } catch (parseError) {
        console.warn('JSON parse warning:', parseError.message);
        data = null;
      }
    }

    if (response.ok) {
      return {
        success: true,
        status: response.status,
        data: data,
      };
    } else if (response.status === 403) {
      const tokensRefreshed = await refreshTokens();

      if (tokensRefreshed) {
        // Token yenilendi, isteği tekrar dene
        return await fetchData({
          url,
          tokenRequired,
          method,
          body,
          returnsData,
          retryCount: 0, // Token yenilendikten sonra retry sayacını sıfırla
        });
      } else {
        return {
          success: false,
          status: 403,
          data: null,
          error: 'Token refresh failed',
        };
      }
    } else {
      console.error(`Fetch error: ${response.status} ${response.statusText}`);
      return {
        success: false,
        status: response.status,
        data: data?.errors || data,
      };
    }
  } catch (error) {
    console.error('Error in fetchData:', error);

    // Network hatası - retry mekanizması
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying request... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
      await delay(RETRY_DELAY * (retryCount + 1)); // Exponential backoff
      
      return await fetchData({
        url,
        tokenRequired,
        method,
        body,
        returnsData,
        retryCount: retryCount + 1,
      });
    }

    // Tüm retry'lar başarısız olduysa hata döndür
    return {
      success: false,
      status: 0,
      data: null,
      error: error.message || 'Network request failed',
    };
  } finally {
    storage.set('loading', false);
  }
};
