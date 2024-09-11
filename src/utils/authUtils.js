import {API_URL} from '@env';
import storage from './MMKVStore';

export const refreshTokens = async () => {
  const refreshToken = storage.getString('refreshToken');

  if (refreshToken) {
    const userType = storage.getString('userType');
    const url = `${API_URL}/${userType}/token/refresh/`;
    const body = JSON.stringify({refresh: refreshToken});

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body,
      });

      if (response.ok) {
        const access = await response.json();
        storage.set('accessToken', access.access);
        return true;
      } else {
        const selectedLanguage = storage.getString('selectedLanguage');
        alert(
          selectedLanguage === 'en'
            ? 'Session expired, please sign in again'
            : selectedLanguage === 'az'
            ? 'Sessiyanın vaxtı bitdi, zəhmət olmasa yenidən daxil olun'
            : 'Срок сеанса истек, пожалуйста, войдите снова',
        );
        storage.clearAll();
      }
    } catch (error) {
      console.error(error);
    }
  }
};

export const login = async (formData, setLoading, setErrors) => {
  const userType = storage.getString('userType');
  const url = `${API_URL}/${userType}/login/`;

  try {
    if (formData.email && formData.password) {
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
      } else {
        setErrors(data.error);
      }
    } else {
      const selectedLanguage = storage.getString('selectedLanguage');
      selectedLanguage === 'az'
        ? alert('Xəta', 'İstifadəçi adı və ya parol boş ola bilməz')
        : selectedLanguage === 'en'
        ? alert('Error', 'Username or password cannot be empty')
        : alert('Ошибка', 'Имя пользователя или пароль не могут быть пустыми');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

export const logout = () => {
  storage.clearAll();
};

export const createAccount = async ({
  formData,
  setErrors,
  termsConditionsAccepted,
  selectedPrefix,
  setLoading,
}) => {
  const userType = storage.getString('userType');
  const url = `${API_URL}/${userType}/register/`;
  const selectedLanguage = storage.getString('selectedLanguage');

  try {
    setLoading(true);
    if (termsConditionsAccepted) {
      if (selectedPrefix) {
        if (
          formData.password &&
          formData.password_confirm !== formData.password
        ) {
          setErrors(prevState => ({
            ...prevState,
            password:
              selectedLanguage === 'az'
                ? 'Daxil edilmiş şifrələr eyni deyil'
                : selectedLanguage === 'en'
                ? 'Entered passwords do not match'
                : 'Введенные пароли не совпадают',
          }));
        } else {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });

          const data = await response.json();

          if (response.ok) {
            setErrors(null);
            storage.set('accessToken', data.token.access);
            storage.set('refreshToken', data.token.refresh);
            return {success: true};
          } else {
            setErrors(data);
          }
        }
      } else {
        selectedLanguage === 'az'
          ? alert('Xəta', 'Zəhmət olmasa öncə prefiks seçin')
          : selectedLanguage === 'en'
          ? alert('Error', 'You must choose a prefix first')
          : alert('Ошибка', 'Сначала необходимо выбрать префикс');
      }
    } else {
      selectedLanguage === 'az'
        ? alert(
            'Xəta',
            'Zəhmət olmasa əvvəlcə istifadə qaydaları oxuyun və razılaşın',
          )
        : selectedLanguage === 'en'
        ? alert(
            'Error',
            'Please first read and agree with terms and conditions',
          )
        : alert(
            'Ошибка',
            'Пожалуйста, сначала прочитайте и согласитесь с условиями использования',
          );
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};

export const deleteAccount = async () => {
  const accessToken = storage.getString('accessToken');
  const userType = storage.getString('userType');
  const selectedLanguage = storage.getString('selectedLanguage');
  const response = await fetch(`${API_URL}/${userType}/profile/`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.ok) {
    selectedLanguage === 'az'
      ? alert('Hesabınız uğurla silindi')
      : selectedLanguage === 'en'
      ? alert('Your account was successfully deleted')
      : alert('Ваш аккаунт был успешно удален');
  } else {
    selectedLanguage === 'az'
      ? alert('Xəta', 'Xəta baş verdi')
      : selectedLanguage === 'en'
      ? alert('Error', 'An error occurred')
      : alert('Ошибка', 'Произошла ошибка');
  }

  storage.clearAll();
};
