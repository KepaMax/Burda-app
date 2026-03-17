import Styled from '@common/StyledComponents';
import CustomComponents from '@common/CustomComponents';
import {useState, useEffect, useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {fetchData} from '@utils/fetchData';
import {API_URL} from '@env';
import Icons from '@icons/icons.js';

const EditProfile = () => {
  const [formData, setFormData] = useState({});
  const [userId, setUserId] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const {t} = useTranslation();

  // Company modal (same as SignUp)
  const [companyModalVisible, setCompanyModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState({});
  const [companyData, setCompanyData] = useState([]);
  const [companySearchValue, setCompanySearchValue] = useState('');
  const [companyPage, setCompanyPage] = useState(1);
  const [companyHasMore, setCompanyHasMore] = useState(true);
  const [companyLoadingMore, setCompanyLoadingMore] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({...prevState, [name]: value}));
    console.log(formData);
  };

  const getUserData = async () => {
    setLoadError(false);
    const result = await fetchData({
      url: `${API_URL}/users/me/`,
      tokenRequired: true,
    });

    if (result?.success) {
      setUserId(result.data.id);
      setFormData({
        company: result.data.company,
        email: result.data.email,
        phone_number: result.data.phone_number,
        first_name: result.data.first_name,
        last_name: result.data.last_name,
      });
    } else {
      setLoadError(true);
    }
  };

  const editProfile = async () => {
    if (
      formData.company !== null &&
      typeof formData.company === 'object' &&
      !Array.isArray(formData.company)
    ) {
      console.log("asdasdasda")
      const result = await fetchData({
        url: `${API_URL}/users/${userId}/`,
        tokenRequired: true,
        method: 'PATCH',
        body: {...formData, company: formData.company.id},
      });

      result?.success && alert(t('userSuccessfullyUpdated'));
    }
    const result = await fetchData({
      url: `${API_URL}/users/${userId}/`,
      tokenRequired: true,
      method: 'PATCH',
      body: {...formData, company: formData.company},
    });
    result?.success && alert(t('userSuccessfullyUpdated'));
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Sync selectedCompany from formData when user data is loaded (company can be object { id, name })
  useEffect(() => {
    const company = formData?.company;
    if (company && typeof company === 'object' && !Array.isArray(company) && company.id != null) {
      setSelectedCompany({ label: company.name ?? '', value: company.id });
    }
  }, [formData?.company]);

  // Fetch companies (paginated) for modal
  const fetchCompaniesPage = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) setCompanyData([]);
      if (append) setCompanyLoadingMore(true);
      const result = await fetchData({
        url: `${API_URL}/companies/?page=${page}&page_size=50`,
      });
      if (append) setCompanyLoadingMore(false);
      if (result?.success && result?.data?.results) {
        const formatted = result.data.results.map(company => ({
          label: company.name,
          value: company.id,
        }));
        setCompanyData(prev => (append ? [...prev, ...formatted] : formatted));
        setCompanyHasMore(!!result.data.next);
        setCompanyPage(page + 1);
      }
    } catch (error) {
      if (append) setCompanyLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setCompanyPage(1);
    setCompanyHasMore(true);
    fetchCompaniesPage(1, false);
  }, [fetchCompaniesPage]);

  const loadMoreCompanies = useCallback(() => {
    if (!companyHasMore || companyLoadingMore) return;
    setCompanyLoadingMore(true);
    fetchCompaniesPage(companyPage, true);
  }, [companyHasMore, companyLoadingMore, companyPage, fetchCompaniesPage]);

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    handleInputChange('company', company.value);
    setCompanyModalVisible(false);
    setCompanySearchValue('');
  };

  const handleCloseCompanyModal = useCallback(() => {
    setCompanyModalVisible(false);
    setCompanySearchValue('');
  }, []);

  return (
    <>
      <CustomComponents.Header bgColor="bg-white" title={t('editProfile')} />
      <Styled.ScrollView className="bg-[#F8F8F8] h-full px-4 pt-5">
        {loadError && (
          <Styled.View className="bg-red-50 p-4 rounded-lg mb-4">
            <Styled.Text className="text-red-600 text-center font-poppins-medium mb-2">
              {t('somethingWentWrong')}
            </Styled.Text>
            <Styled.TouchableOpacity
              onPress={getUserData}
              className="bg-red-500 py-2 px-4 rounded-lg self-center">
              <Styled.Text className="text-white font-poppins-medium">
                {t('resend')}
              </Styled.Text>
            </Styled.TouchableOpacity>
          </Styled.View>
        )}
        <Styled.View className="flex-row justify-between">
          <CustomComponents.Input
            inputName="first_name"
            inputValue={formData?.first_name}
            placeholder={t('firstname')}
            width="w-[49%]"
            handleInputChange={handleInputChange}
          />
          <CustomComponents.Input
            inputName="last_name"
            inputValue={formData?.last_name}
            placeholder={t('lastname')}
            width="w-[49%]"
            handleInputChange={handleInputChange}
          />
        </Styled.View>

        <CustomComponents.PhoneInput
          inputValue={formData?.phone_number}
          handleInputChange={handleInputChange}
        />

        {/* Company Selection with Modal (same as SignUp) */}
        <Styled.TouchableOpacity
          onPress={() => setCompanyModalVisible(true)}
          className="w-full h-[44px] mb-3 bg-white shadow shadow-zinc-300 rounded-[8px] justify-center pl-4">
          <Styled.Text className="w-full text-[#868782] text-base text-left font-poppins">
            {selectedCompany.label || formData?.company?.name || t('companyName')}
          </Styled.Text>
          <Styled.View className="absolute right-3 top-3">
            <Icons.ArrowDown />
          </Styled.View>
        </Styled.TouchableOpacity>

        <CustomComponents.Input
          inputName="email"
          inputValue={formData?.email}
          placeholder={t('email')}
          handleInputChange={handleInputChange}
          editable={false}
        />

        <CustomComponents.Button
          bgColor="bg-[#66B600]"
          borderRadius="rounded-[24px]"
          padding="py-3"
          margin="mt-4"
          title={t('save')}
          buttonAction={editProfile}
        />
      </Styled.ScrollView>

      <CustomComponents.CompanyModal
        visible={companyModalVisible}
        onClose={handleCloseCompanyModal}
        selectedCompany={selectedCompany}
        onSelect={handleCompanySelect}
        companyData={companyData}
        searchValue={companySearchValue}
        onSearchChange={setCompanySearchValue}
        onLoadMore={loadMoreCompanies}
        hasMore={companyHasMore}
        loadingMore={companyLoadingMore}
      />
    </>
  );
};

export default EditProfile;
