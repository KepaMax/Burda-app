import Styled from '@common/StyledComponents';
import Images from '@images/images.js';
import CustomComponents from '@common/CustomComponents';
import {useState, useEffect} from 'react';
import {Dimensions, Modal, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import {createAccount} from '@utils/authUtils';
import {useMMKVBoolean} from 'react-native-mmkv';
import {prefixData} from '@utils/staticData';
import {fetchData} from '@utils/fetchData';
import {API_URL} from '@env';
import Icons from '@icons/icons.js';

const SignUp = () => {
  const {t} = useTranslation();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useMMKVBoolean('loading');
  const [errors, setErrors] = useState({});
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('screen').width;
  
  // Modal states
  const [prefixModalVisible, setPrefixModalVisible] = useState(false);
  const [companyModalVisible, setCompanyModalVisible] = useState(false);
  const [selectedPrefix, setSelectedPrefix] = useState({});
  const [selectedCompany, setSelectedCompany] = useState({});
  const [companyData, setCompanyData] = useState([]);
  const [companySearchValue, setCompanySearchValue] = useState('');

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({...prevState, [name]: value}));
  };

  const navigate = () => {
    navigation.navigate('SignIn');
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

  // Handle initial phone number formatting
  useEffect(() => {
    if (formData?.phone_number && !selectedPrefix.value) {
      const phoneNumber = formData.phone_number;
      if (phoneNumber.startsWith('+994') && phoneNumber.length >= 6) {
        const prefixValue = phoneNumber.slice(4, 6);
        const prefix = prefixData.find(p => p.value === prefixValue);
        if (prefix) {
          setSelectedPrefix(prefix);
        }
      }
    }
  }, [formData?.phone_number]);

  // Handle initial company selection
  useEffect(() => {
    if (formData?.company && !selectedCompany.value && companyData.length > 0) {
      const company = companyData.find(c => c.value === formData.company);
      if (company) {
        setSelectedCompany(company);
      }
    }
  }, [formData?.company, companyData]);

  // Handle prefix selection
  const handlePrefixSelect = (prefix) => {
    setSelectedPrefix(prefix);
    setFormData(prevState => ({...prevState, prefix: prefix.value}));
    setPrefixModalVisible(false);
  };

  // Handle phone number input change
  const handlePhoneInputChange = (name, value) => {
    if (selectedPrefix.value) {
      const fullPhoneNumber = `+994${selectedPrefix.value}${value}`;
      setFormData(prevState => ({...prevState, phone_number: fullPhoneNumber}));
    } else {
      setFormData(prevState => ({...prevState, phone_number: value}));
    }
  };

  // Handle company selection
  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setFormData(prevState => ({...prevState, company: company.value}));
    setCompanyModalVisible(false);
    setCompanySearchValue('');
  };

  // Filter companies based on search
  const filteredCompanies = companyData.filter(company =>
    company.label.toLowerCase().includes(companySearchValue.toLowerCase())
  );

  // Prefix Modal
  const PrefixModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={prefixModalVisible}
      onRequestClose={() => setPrefixModalVisible(false)}>
      <Styled.View className="flex-1 justify-center items-center bg-black/50">
        <Styled.View className="bg-white rounded-[16px] w-[90%] max-h-[400px]">
          {/* Header */}
          <Styled.View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Styled.Text className="text-[#184639] text-lg font-poppins-semibold">
              {t('prefix')}
            </Styled.Text>
            <Styled.TouchableOpacity
              onPress={() => setPrefixModalVisible(false)}>
              <Icons.X />
            </Styled.TouchableOpacity>
          </Styled.View>
          
          {/* Prefix List */}
          <FlatList
            data={prefixData}
            keyExtractor={(item) => item.value}
            renderItem={({item}) => (
              <Styled.TouchableOpacity
                className={`p-4 border-b border-gray-100 ${
                  selectedPrefix.value === item.value ? 'bg-[#76F5A4]' : 'bg-transparent'
                }`}
                onPress={() => handlePrefixSelect(item)}>
                <Styled.Text className="text-[#868782] text-base font-poppins">
                  {item.label}
                </Styled.Text>
              </Styled.TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        </Styled.View>
      </Styled.View>
    </Modal>
  );

  // Company Modal
  const CompanyModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={companyModalVisible}
      onRequestClose={() => setCompanyModalVisible(false)}>
      <Styled.View className="flex-1 justify-center items-center bg-black/50">
        <Styled.View className="bg-white rounded-[16px] w-[90%] max-h-[400px]">
          {/* Header */}
          <Styled.View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Styled.Text className="text-[#184639] text-lg font-poppins-semibold">
              {t('companyName')}
            </Styled.Text>
            <Styled.TouchableOpacity
              onPress={() => {
                setCompanyModalVisible(false);
                setCompanySearchValue('');
              }}>
              <Icons.X />
            </Styled.TouchableOpacity>
          </Styled.View>
          
          {/* Search Bar */}
          <Styled.View className="p-4 border-b border-gray-200">
            <Styled.TextInput
              value={companySearchValue}
              onChangeText={setCompanySearchValue}
              placeholder={t('searchCompany')}
              placeholderTextColor="#868782"
              className="border border-gray-300 rounded-[8px] px-4 py-3 text-[#184639] font-poppins text-left"
            />
          </Styled.View>
          
          {/* Company List */}
          <FlatList
            data={filteredCompanies}
            keyExtractor={(item) => item.value}
            renderItem={({item}) => (
              <Styled.TouchableOpacity
                className={`p-4 border-b border-gray-100 ${
                  selectedCompany.value === item.value ? 'bg-[#76F5A4]' : 'bg-transparent'
                }`}
                onPress={() => handleCompanySelect(item)}>
                <Styled.Text className="text-[#868782] text-base font-poppins">
                  {item.label}
                </Styled.Text>
              </Styled.TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Styled.View className="p-4">
                <Styled.Text className="text-gray-500 text-base font-poppins text-center">
                  {companySearchValue ? t('noCompaniesFound') : t('loadingCompanies')}
                </Styled.Text>
              </Styled.View>
            }
          />
        </Styled.View>
      </Styled.View>
    </Modal>
  );

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
        <Styled.View className="z-30 w-full mb-3">
          <Styled.View className="flex-row justify-between items-center">
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
            
            <CustomComponents.Input
              width="w-[69%]"
              margin="m-0"
              inputName="phone_number"
              inputValue={formData?.phone_number && selectedPrefix.value ? formData.phone_number.replace(`+994${selectedPrefix.value}`, '') : formData?.phone_number || ''}
              handleInputChange={handlePhoneInputChange}
              placeholder={t('phoneNumber')}
              error={errors?.phone_number ? 'ref' : null}
            />
          </Styled.View>

          <Styled.Text
            className={`-z-10 text-red-400 text-xs font-poppins mt-1 ${
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
        />

        <CustomComponents.PasswordInput
          inputName="password"
          inputValue={formData?.password}
          handleInputChange={handleInputChange}
          placeholder={t('password')}
          error={errors?.password}
        />

        <CustomComponents.PasswordInput
          inputName="repeat_password"
          inputValue={formData?.repeat_password}
          handleInputChange={handleInputChange}
          placeholder={t('repeatPassword')}
          error={errors?.repeat_password}
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
          title={t('completeSignup')}
          extraTxtStyling="text-left"
          buttonAction={() => {
            createAccount({
              formData,
              setErrors,
              setLoading,
              navigate
            });
          }}
        />
      </Styled.View>

      {/* Modals */}
      <PrefixModal />
      <CompanyModal />
    </KeyboardAwareScrollView>
  );
};

export default SignUp;
