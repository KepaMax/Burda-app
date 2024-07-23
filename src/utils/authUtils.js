import {API_URL} from '@env';
import {storage} from '@utils/MMKVStore';
import {Alert} from 'react-native';

export const refreshTokens = async () => {
  const url = `${API_URL}jwt/refresh/`;
  const accessToken = await getAccessTokenFromMemory();
  const refreshT = await getInternetCredentials('refresh_token');
  const refreshToken = refreshT.password;

  const postData = {
    refresh: refreshToken,
  };

  if (accessToken) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      if (data.type !== 'client_error') {
        await setInternetCredentials(
          'access_token',
          'access_token',
          data.access,
        );
        await setInternetCredentials(
          'refresh_token',
          'refresh_token',
          data.refresh,
        );
        setIsLoggedIn(true);
      } else {
        Alert.alert(
          t('attributes.error'),
          t('attributes.sessionExpired'),
          [
            {
              text: 'OK',
              onPress: () => {
                logOut();
                setTrigger(!trigger);
              },
            },
          ],
          {cancelable: false},
        );
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoggedIn(false);
    }
  }
};

export const login = async (loginType, formData, setLoading) => {
  const url = `${API_URL}/${
    loginType === 'driver' ? 'drivers' : 'nannies'
  }/login/`;

  try {
    setLoading(true);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      storage.set('accessToken', data.token.access);
      storage.set('refreshToken', data.token.refresh);
    }

    return {status: response.ok, data: data};
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

export const createAccount = async (registerType, formData, setLoading) => {
  const url = `${API_URL}/${
    registerType === 'driver' ? 'drivers' : 'nannies'
  }/register/`;

  try {
    setLoading(true);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      storage.set('accessToken', data.token.access);
      storage.set('refreshToken', data.token.refresh);
    }

    return {status: response.ok, data: data};
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

export const deleteAccount = async () => {
  const accessToken = storage.getString('accessToken');
  const response = await fetch(`${API_URL}/drivers/profile/`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  storage.set('accessToken', '');
  return response.ok;
};
