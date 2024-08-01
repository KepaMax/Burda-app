import { API_URL } from '@env';
import { jwtDecode } from 'jwt-decode';
import { storage } from './MMKVStore';

export const refreshTokens = async () => {
  if (storage.contains("refreshToken")) {
    const refreshToken = storage.getString("refreshToken");
    const decode = jwtDecode(refreshToken);
    const type = decode.user_type === "driver" ? "drivers" : "nannies";

    const url = `${API_URL}/${type}/token/refresh/`;
    const body = JSON.stringify({ refresh: refreshToken })
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body
      })


      if (response.ok) {
        const access = await response.json();
        storage.set("accessToken", access.access);
        return true;
      }

      console.log(response);
      return false;
    } catch (error) {
      console.error(error)
      return false;
    }
  }
  return false;
}


export const login = async (loginType, formData, setLoading) => {
  const url = `${API_URL}/${loginType === 'driver' ? 'drivers' : 'nannies'
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

    return { status: response.ok, data: data };
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

export const createAccount = async (registerType, formData, setLoading) => {
  const url = `${API_URL}/${registerType === 'driver' ? 'drivers' : 'nannies'
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

    return { status: response.ok, data: data };
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

export const deleteAccount = async () => {
  const accessToken = storage.getString('accessToken');
  const userType = jwtDecode(accessToken).user_type;
  const response = await fetch(`${API_URL}/${userType == "nanny" ? "nannies" : "drivers"}/profile/`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  storage.set('accessToken', '');
  return response.ok;
};
