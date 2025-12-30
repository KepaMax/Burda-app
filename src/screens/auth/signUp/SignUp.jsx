import Styled from '@common/StyledComponents';
import Images from '@images/images.js';
import CustomComponents from '@common/CustomComponents';
import {useState, useEffect, useCallback} from 'react';
import {Dimensions} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {useMMKVBoolean} from 'react-native-mmkv';
import {fetchData} from '@utils/fetchData';
import {API_URL} from '@env';
import Icons from '@icons/icons.js';
import {prefixData} from '@utils/staticData';

const SignUp = () => {
  const {t} = useTranslation();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useMMKVBoolean('loading');
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const route = useRoute();
  const screenWidth = Dimensions.get('screen').width;
  
  // Modal states
  const [companyModalVisible, setCompanyModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState({});
  const [companyData, setCompanyData] = useState([]);
  const [companySearchValue, setCompanySearchValue] = useState('');
  
  // Prefix modal states
  const [prefixModalVisible, setPrefixModalVisible] = useState(false);
  const [selectedPrefix, setSelectedPrefix] = useState({});
  const [phoneInputValue, setPhoneInputValue] = useState('');

  // İlk prefix'i default olarak seç
  useEffect(() => {
    if (!selectedPrefix.value && prefixData.length > 0) {
      setSelectedPrefix(prefixData[0]);
    }
  }, []);

  // Route params'dan telefon numarasını al
  useEffect(() => {
    if (route.params?.phone) {
      const phone = route.params.phone;
      setFormData(prev => ({...prev, phone_number: phone}));
      // Telefon numarasını parse et
      if (phone && phone.startsWith('+994')) {
        const prefixValue = phone.slice(4, 6);
        const phoneValue = phone.slice(6);
        const prefix = prefixData.find(p => p.value === prefixValue);
        if (prefix) {
          setSelectedPrefix(prefix);
          setPhoneInputValue(phoneValue);
        }
      }
    }
  }, [route.params?.phone]);

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({...prevState, [name]: value}));
  };

  // Handle phone input change
  const handlePhoneInputChange = (value) => {
    if (value.length <= 7) {
      setPhoneInputValue(value);
      if (selectedPrefix.value) {
        handleInputChange(
          'phone_number',
          `+994${selectedPrefix.value}${value}`,
        );
      }
    }
  };

  // Update phone number when prefix or phone input changes
  useEffect(() => {
    if (selectedPrefix.value && phoneInputValue) {
      handleInputChange(
        'phone_number',
        `+994${selectedPrefix.value}${phoneInputValue}`,
      );
    } else if (selectedPrefix.value && !phoneInputValue) {
      // Clear phone number if phone input is empty
      handleInputChange('phone_number', '');
    }
  }, [selectedPrefix, phoneInputValue]);

  // Register API call
  const handleRegister = async () => {
    // Form validation
    const newErrors = {};
    
    if (!formData.first_name) {
      newErrors.first_name = t('fieldRequired');
    }
    if (!formData.last_name) {
      newErrors.last_name = t('fieldRequired');
    }
    if (!formData.phone_number || formData.phone_number.length < 13) {
      newErrors.phone_number = t('phoneNumberRequired');
    }
    if (!formData.email) {
      newErrors.email = t('fieldRequired');
    }
    if (!formData.company) {
      newErrors.company = t('fieldRequired');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const result = await fetchData({
        url: `${API_URL}/register/`,
        method: 'POST',
        body: {
          phone_number: formData.phone_number,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          company: formData.company,
        },
      });

      console.log('Register result:', result);

      if (result?.success) {
        // OTP sayfasına yönlendir
        navigation.navigate('OtpLogin', {
          phone: formData.phone_number,
          userId: result.data?.user_id,
          isNewUser: true,
        });
      } else {
        // API hatası
        if (result?.data) {
          setErrors(result.data);
        } else {
          setErrors({general: t('somethingWentWrong')});
        }
      }
    } catch (error) {
      console.error('Register error:', error);
      setErrors({general: t('somethingWentWrong')});
    } finally {
      setLoading(false);
    }
  };

  // Fetch company data
  useEffect(() => {
    const getCompanyData = async () => {
      try {
        const result = await fetchData({
          url: `${API_URL}/companies/`,
        });

        if (result?.success) {
          const formattedCompanyData = result?.data.results.map(company => ({
            label: company.name,
            value: company.id,
          }));
          setCompanyData(formattedCompanyData);
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    getCompanyData();
  }, []);

  // Handle initial company selection
  useEffect(() => {
    if (formData?.company && !selectedCompany.value && companyData.length > 0) {
      const company = companyData.find(c => c.value === formData.company);
      if (company) {
        setSelectedCompany(company);
      }
    }
  }, [formData?.company, companyData]);

  // Handle company selection
  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setFormData(prevState => ({...prevState, company: company.value}));
    setCompanyModalVisible(false);
    setCompanySearchValue('');
  };


  // Handle prefix selection
  const handlePrefixSelect = useCallback((prefix) => {
    setSelectedPrefix(prefix);
    setPrefixModalVisible(false);
    // Update phone number with new prefix
    if (phoneInputValue) {
      handleInputChange(
        'phone_number',
        `+994${prefix.value}${phoneInputValue}`,
      );
    }
  }, [phoneInputValue]);

  // Memoized close handler
  const handleCloseCompanyModal = useCallback(() => {
    setCompanyModalVisible(false);
    setCompanySearchValue('');
  }, []);


  return (
    <KeyboardAwareScrollView
      nestedScrollEnabled={true}
      style={{backgroundColor: '#FAFAFA'}}>
      <CustomComponents.Header overlay={true} />
      <Styled.Image
        style={{width: screenWidth}}
        className="h-[316px]"
        source={Images.SignInHeader}
      />
      <Styled.View className="px-5 pb-14">
        <Styled.Text className="text-[#184639] text-[32px] font-poppins-semibold mb-4">
          {t('signUp')}
        </Styled.Text>

        <Styled.View className="flex-row justify-between items-center">
          <CustomComponents.Input
            width="w-[49%]"
            inputName="first_name"
            inputValue={formData?.first_name}
            handleInputChange={handleInputChange}
            placeholder={t('firstname')}
            error={errors?.first_name}
          />

          <CustomComponents.Input
            width="w-[49%]"
            inputName="last_name"
            inputValue={formData?.last_name}
            handleInputChange={handleInputChange}
            placeholder={t('lastname')}
            error={errors?.last_name}
          />
        </Styled.View>

        {/* Phone Input with Prefix Modal */}
        <Styled.View className="w-full mb-3">
          <Styled.View className="flex-row justify-between items-center">
            {/* Prefix Selection Button */}
            <Styled.TouchableOpacity
              onPress={() => setPrefixModalVisible(true)}
              className={`w-[29%] h-[44px] ${
                errors?.phone_number ? 'border-[1px] border-red-400 bg-red-50' : 'bg-white'
              } shadow shadow-zinc-300 rounded-[8px] justify-center pl-4`}>
              <Styled.Text
                className={`w-full ${
                  errors?.phone_number ? 'text-[#FF3115]' : 'text-[#868782]'
                } text-base text-left font-poppins`}>
                {selectedPrefix.label || t('prefix')}
              </Styled.Text>
              <Styled.View className="absolute right-3 top-3">
                <Icons.ArrowDown />
              </Styled.View>
            </Styled.TouchableOpacity>
            
            {/* Phone Number Input */}
            <CustomComponents.PhoneNumberInput
              inputName="phone_number"
              width="w-[69%]"
              margin="m-0"
              inputValue={phoneInputValue}
              handleInputChange={(name, value) => handlePhoneInputChange(value)}
              placeholder={t('phoneNumber')}
              error={errors?.phone_number ? 'ref' : null}
            />
          </Styled.View>
          
          <Styled.Text
            className={`text-red-400 text-xs font-poppins mt-1 ${
              errors?.phone_number ? 'block' : 'hidden'
            }`}>
            {errors?.phone_number}
          </Styled.Text>
        </Styled.View>

        {/* Company Selection with Modal */}
        <Styled.TouchableOpacity
          onPress={() => setCompanyModalVisible(true)}
          className={`w-full h-[44px] mb-3 ${
            errors?.company ? 'border-[1px] border-red-400 bg-red-50' : 'bg-white'
          } shadow shadow-zinc-300 rounded-[8px] justify-center pl-4`}>
          <Styled.Text
            className={`w-full ${
              errors?.company ? 'text-[#FF3115]' : 'text-[#868782]'
            } text-base text-left font-poppins`}>
            {selectedCompany.label || t('companyName')}
          </Styled.Text>
          <Styled.View className="absolute right-3 top-3">
            <Icons.ArrowDown />
          </Styled.View>
        </Styled.TouchableOpacity>

        <CustomComponents.Input
          inputName="email"
          inputValue={formData?.email}
          handleInputChange={handleInputChange}
          placeholder={t('cooperativEmail')}
          error={errors?.email}
          keyboardType="email-address"
        />

        <CustomComponents.Link
          title={t('alreadyHaveAccount')}
          margin="mb-4 mt-2"
          textColor="text-[#184639]"
          fontWeight="font-regular"
          linkAction={() => {
            navigation.navigate('SignIn');
          }}
        />

        <CustomComponents.Button
          borderRadius="rounded-[24px]"
          padding="p-2.5"
          bgColor="bg-[#66B600]"
          textSize="text-lg"
          title={t('continue')}
          extraTxtStyling="text-left"
          buttonAction={handleRegister}
        />
      </Styled.View>

      {/* Modals */}
      <CustomComponents.CompanyModal
        visible={companyModalVisible}
        onClose={handleCloseCompanyModal}
        selectedCompany={selectedCompany}
        onSelect={handleCompanySelect}
        companyData={companyData}
        searchValue={companySearchValue}
        onSearchChange={setCompanySearchValue}
      />
      <CustomComponents.PrefixModal
        visible={prefixModalVisible}
        onClose={() => setPrefixModalVisible(false)}
        selectedPrefix={selectedPrefix}
        onSelect={handlePrefixSelect}
      />
    </KeyboardAwareScrollView>
  );
};

export default SignUp;
