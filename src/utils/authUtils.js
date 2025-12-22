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

      console.log(response);

      const data = await response.json();
      data;
      if (response.ok) {
        storage.set('accessToken', data.access);
        storage.set('refreshToken', data.refresh);
        storage.set('initBasket', true);
      } else {
        setErrors(data.errors);
        const selectedLanguage = storage.getString('selectedLanguage');
        selectedLanguage === 'az'
          ? alert(
              'Xəta',
              'Göstərilən giriş məlumatları ilə aktiv hesab tapılmadı',
            )
          : selectedLanguage === 'en'
          ? alert('Error', 'No active account found with the given credentials')
          : alert(
              'Ошибка',
              'Не найдено активной учетной записи с указанными учетными данными',
            );
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
  try {
    const accessToken = storage.getString('accessToken');
    const selectedLanguage = storage.getString('selectedLanguage');
    
    const response = await fetch(`${API_URL}/users/me/`, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    // Her durumda storage'ı temizle (logout)
    // Önce selectedLanguage'ı sakla çünkü clearAll() onu da silecek
    storage.clearAll();
    
    // accessToken ve isPinVerified'ı açıkça temizle (Navigation.jsx için)
    storage.set('accessToken', '');
    storage.set('isPinVerified', false);
    
    // selectedLanguage'ı geri kaydet (alert mesajları için gerekli)
    if (selectedLanguage) {
      storage.set('selectedLanguage', selectedLanguage);
    }

    if (response.ok) {
      selectedLanguage === 'az'
        ? alert('Uğurlu əməliyyat', 'Hesabınız uğurla silindi', {
            textConfirm: 'Davam et',
            onConfirm: () => {},
          })
        : selectedLanguage === 'en'
        ? alert('Success', 'Your account was successfully deleted', {
            textConfirm: 'Continue',
            onConfirm: () => {},
          })
        : alert('Uğurlu əməliyyat', 'Hesabınız uğurla silindi', {
            textConfirm: 'Davam et',
            onConfirm: () => {},
          });
    } else {
      selectedLanguage === 'az'
        ? alert('Xəta', 'Hesabınız silinə bilmədi', {
            textConfirm: 'Davam et',
            onConfirm: () => {},
          })
        : selectedLanguage === 'en'
        ? alert('Error', 'Your account could not be deleted', {
            textConfirm: 'Continue',
            onConfirm: () => {},
          })
        : alert('Xəta', 'Hesabınız silinə bilmədi', {
            textConfirm: 'Davam et',
            onConfirm: () => {},
          });
    }
  } catch (error) {
    console.error('Delete account error:', error);
    const selectedLanguage = storage.getString('selectedLanguage');
    // Hata durumunda da storage'ı temizle
    storage.clearAll();
    
    // accessToken ve isPinVerified'ı açıkça temizle (Navigation.jsx için)
    storage.set('accessToken', '');
    storage.set('isPinVerified', false);
    
    // selectedLanguage'ı geri kaydet
    if (selectedLanguage) {
      storage.set('selectedLanguage', selectedLanguage);
    }
    selectedLanguage === 'az'
      ? alert('Xəta', 'Xəta baş verdi', {
          textConfirm: 'Təsdiqlə',
          onConfirm: () => {},
        })
      : selectedLanguage === 'en'
      ? alert('Error', 'An error occurred', {
          textConfirm: 'OK',
          onConfirm: () => {},
        })
      : alert('Ошибка', 'Произошла ошибка', {
          textConfirm: 'OK',
          onConfirm: () => {},
        });
  }
};
