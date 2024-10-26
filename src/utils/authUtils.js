import {API_URL} from '@env';
import storage from './MMKVStore';
import {openInbox} from 'react-native-email-link';

export const refreshTokens = async () => {
  const refreshToken = storage.getString('refreshToken');

  if (refreshToken) {
    const url = `${API_URL}/jwt/refresh/`;
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
      const data = await response.json();

      if (response.ok) {
        storage.set('accessToken', data.access);
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
      // console.error('Error on refreshTokens', error);
    }
  }
};

export const login = async ({formData, setErrors}) => {
  const url = `${API_URL}/jwt/create/`;

  try {
    if (formData.email && formData.password) {
      storage.set('loading', true);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      // console.log(data);
      if (response.ok) {
        storage.set('accessToken', data.access);
        storage.set('refreshToken', data.refresh);
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
    storage.set('loading', false);
  }
};

export const logout = () => {
  storage.clearAll();
};

export const createAccount = async ({
  formData,
  setErrors,
  // termsConditionsAccepted,
  // selectedPrefix,
  setLoading,
  navigate,
}) => {
  const url = `${API_URL}/users/`;
  const selectedLanguage = storage.getString('selectedLanguage');

  try {
    setErrors(null);
    setLoading(true);
    // if (termsConditionsAccepted) {
    // if (selectedPrefix) {
    if (formData.repeat_password !== formData.password) {
      setErrors(prevState => ({
        ...prevState,
        password:
          selectedLanguage === 'az'
            ? 'Daxil edilmiş şifrələr eyni deyil'
            : // : selectedLanguage === 'en'
              // ?
              'Entered passwords do not match',
        // : 'Введенные пароли не совпадают',
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
        alert(
          selectedLanguage === 'az' ? 'Uğurlu əməliyyat' : 'Success',
          selectedLanguage === 'az'
            ? 'Zəhmət olmasa, e-poçtunuza göndərilən linkə keçid edərək qeydiyyatı tamamlayın.'
            : 'Please click on the link sent to your email to complete the registration.',
          {
            textConfirm: selectedLanguage === 'az' ? 'Təsdiqlə' : 'Confirm',
            onConfirm: () => navigate(),
          },
        );

        // storage.set('accessToken', data.token.access);
        // storage.set('refreshToken', data.token.refresh);
        // return {success: true};
      } else {
        const fields = [
          'first_name',
          'last_name',
          'phone_number',
          'company',
          'email',
          'password',
          'repeat_password',
          'non_field_errors',
        ];

        const output = fields.reduce((acc, field) => {
          const error = data.errors.find(e => e.attr === field);
          acc[field] = error ? error.detail : '';
          return acc;
        }, {});

        output.non_field_errors && alert(output.non_field_errors);

        setErrors(output);
      }
    }
    // } else {
    //   selectedLanguage === 'az'
    //     ? alert('Xəta', 'Zəhmət olmasa öncə prefiks seçin')
    //     : selectedLanguage === 'en'
    //     ? alert('Error', 'You must choose a prefix first')
    //     : alert('Ошибка', 'Сначала необходимо выбрать префикс');
    // }
    // } else {
    //   selectedLanguage === 'az'
    //     ? alert(
    //         'Xəta',
    //         'Zəhmət olmasa əvvəlcə istifadə qaydaları oxuyun və razılaşın',
    //       )
    //     : selectedLanguage === 'en'
    //     ? alert(
    //         'Error',
    //         'Please first read and agree with terms and conditions',
    //       )
    //     : alert(
    //         'Ошибка',
    //         'Пожалуйста, сначала прочитайте и согласитесь с условиями использования',
    //       );
    // }
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
