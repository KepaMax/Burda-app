import { StyledText, StyledTextInput, StyledTouchableOpacity, StyledView } from '../common/components/StyledComponents';
import FastImage from 'react-native-fast-image';
import EditProfileIcon from "../../assets/icons/edit-profile.svg"
import { useEffect, useState, useContext } from 'react';
import InfoProfileIcon from "../../assets/icons/info-profile.svg"
import CustomSelect from '../common/components/CustomSelect';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import AuthContext from '../common/TokenManager';
import { API_URL } from '@env';
import { PERMISSIONS, request } from 'react-native-permissions';
import { Alert } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';

const EditProfile = () => {

    const [toolTipVisible, setToolTipVisible] = useState(false);
    const navigation = useNavigation();
    const { getStudentAccessTokenFromMemory, getSupervisorAccessTokenFromMemory } =
        useContext(AuthContext);
    const route = useRoute();
    const triggerParent = route.params.triggerParent;
    const setTriggerParent = route.params.setTriggerParent;
    const [trigger, setTrigger] = useState(false);
    const [data, setData] = useState(null);
    const [editActive, setEditActive] = useState(false);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const [selectedPrefix, setSelectedPrefix] = useState(null);
    const [phoneNumValue, setPhoneNumValue] = useState();
    const [isParent, setIsParent] = useState(false);
    const [processFinished, setProcessFinished] = useState(false);
    const prefixData = [
        {
            label: '010',
            value: '10',
        },
        {
            label: '050',
            value: '50',
        },
        {
            label: '051',
            value: '51',
        },
        {
            label: '055',
            value: '55',
        },
        {
            label: '060',
            value: '60',
        },
        {
            label: '070',
            value: '70',
        },
        {
            label: '077',
            value: '77',
        },
        {
            label: '099',
            value: '99',
        },
    ];

    useEffect(() => {
        const findIfSupervisor = async () => {
            const supervisorToken = await getSupervisorAccessTokenFromMemory();
            setIsParent(supervisorToken ? true : false);
            setProcessFinished(true);
        };

        findIfSupervisor();
    }, []);

    const [formData, setFormData] = useState();

    const handleProfilePictureUpload = async img => {
        try {
            const supervisorToken = await getSupervisorAccessTokenFromMemory();
            const studentToken = await getStudentAccessTokenFromMemory();

            const body = { profile_picture: `data:image/jpeg;base64,${img}` };

            const response = await fetch(`${API_URL}users/me/profile-picture/`, {
                method: 'PATCH',
                headers: {
                    Accept: '*/*;version=v2',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${studentToken ? studentToken : supervisorToken
                        }`,
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                Alert.alert('Success', 'Profile picture updated successfully');
                setTrigger(!trigger);
                setTriggerParent(!triggerParent);
            } else {
                Alert.alert('Error', 'Failed to update profile picture');
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            Alert.alert(
                'Error',
                'An error occurred while uploading the profile picture',
            );
        }
    };

    const handleInputChange = (name, value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        try {
            const supervisorToken = await getSupervisorAccessTokenFromMemory();

            const response = await fetch(`${API_URL}supervisors/me/`, {
                headers: {
                    Authorization: `Bearer ${supervisorToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                method: 'PATCH',
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert(
                    t('attributes.success'),
                    t('attributes.accountSuccesfullyUpdated'),
                );
            } else {
                Alert.alert(t('attributes.error'), t('attributes.errorOccurred'));
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const supervisorToken = await getSupervisorAccessTokenFromMemory();
                const studentToken = await getStudentAccessTokenFromMemory();
                const supervisorLink = `${API_URL}supervisors/me/`;
                const studentLink = `${API_URL}students/me/`;
                const headers = {
                    // Accept: '*/*;version=v2',
                    Authorization: `Bearer ${studentToken ? studentToken : supervisorToken
                        }`,
                };
                const response = await fetch(
                    studentToken ? studentLink : supervisorToken ? supervisorLink : null,
                    { headers },
                );
                const jsonData = await response.json();
                setData(jsonData);
                setLoading(false);
                const phoneNumber = isParent
                    ? jsonData?.phone_number
                    : jsonData?.user?.phone_number;
                const parts = phoneNumber?.match(/\+(\d{3})(\d{2})(\d{7})/);
                if (parts) {
                    const country_code = parts[1];
                    const mobile_network_code = parts[2];
                    const subscriber_number = parts[3];
                    setSelectedPrefix(mobile_network_code);
                    setPhoneNumValue(subscriber_number);
                }

                setFormData(
                    isParent
                        ? {
                            email: jsonData?.email,
                            phone_number: jsonData?.phone_number,
                        }
                        : {
                            email: jsonData.user.email,
                            phone_number: jsonData.user.phone_number,
                        },
                );
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        processFinished ? fetchData() : null;
    }, [trigger, processFinished]);

    useEffect(() => {
        setFormData(prevFormData => ({
            ...prevFormData,
            phone_number: `+994${selectedPrefix}${phoneNumValue}`,
        }));
    }, [phoneNumValue, selectedPrefix]);

    return (
        <StyledView className='flex-1 justify-between bg-white p-4'>
            <KeyboardAwareScrollView >
                <StyledView>
                    <StyledView className='w-full relative justify-center items-center'>
                        <StyledView>
                            <FastImage style={{ width: 120, height: 120, borderRadius: 9999 }} source={{
                                uri: data?.profile_picture
                                    ? data?.profile_picture
                                    : data?.user?.profile_picture,
                                priority: FastImage.priority.normal,
                            }} />
                            {editActive &&
                                <StyledTouchableOpacity onPress={() => {
                                    request(
                                        Platform.OS === 'ios'
                                            ? PERMISSIONS.IOS.PHOTO_LIBRARY
                                            : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
                                    ).then(result => {
                                        result === 'granted'
                                            ? launchImageLibrary(
                                                {
                                                    mediaType: 'photo',
                                                    includeBase64: true,
                                                },
                                                response => {
                                                    if (!response.didCancel && !response.error) {
                                                        handleProfilePictureUpload(response.assets[0].base64);
                                                    }
                                                },
                                            )
                                            : Alert.alert(
                                                t('attributes.error'),
                                                t('attributes.galleryErrorMessage'),
                                            );
                                    });
                                }} className='absolute border-[1px] border-[#EDEFF3] rounded-full right-1 bottom-0 z-50'>
                                    <EditProfileIcon />
                                </StyledTouchableOpacity>}
                        </StyledView>
                        {!editActive ?
                            <StyledTouchableOpacity onPress={() => setEditActive(!editActive)} className='my-3'>
                                <StyledText className='font-poppi-semibold text-[#204F50]'>Edit profile</StyledText>
                            </StyledTouchableOpacity> : <StyledView className='my-5' />}
                    </StyledView>

                    <StyledView className='gap-4'>
                        <StyledView>
                            <StyledText className='text-[15px] mb-2 text-[#C0C0BF] font-poppi-medium'>First name</StyledText>
                            <StyledTextInput value={
                                data?.hasOwnProperty('user') ? data?.user?.username : data?.username
                            } placeholder='Name' placeholderTextColor={"#7A7A7A"} editable={editActive} className={`w-max border-[1px] text-base font-poppi ${editActive ? "text-black" : "text-[#7A7A7A]"} border-[#EDEFF3] rounded-[18px] px-4 py-2`} />
                        </StyledView>
                        <StyledView>
                            <StyledText className='text-[15px] mb-2 text-[#C0C0BF] font-poppi-medium'>Last name</StyledText>
                            <StyledTextInput onChange={handleInputChange} placeholder='Surname' placeholderTextColor={"#7A7A7A"} editable={editActive} className={`w-max border-[1px] h-[45px] text-base font-poppi ${editActive ? "text-black" : "text-[#7A7A7A]"} border-[#EDEFF3] rounded-[18px] px-4 py-2`}></StyledTextInput>
                        </StyledView>
                        <StyledView>
                            <StyledText className='text-[15px] mb-2 text-[#C0C0BF] font-poppi-medium'>Email</StyledText>
                            <StyledTextInput value={isParent ? formData?.email : data?.user?.email} placeholder='Email' placeholderTextColor={"#7A7A7A"} editable={editActive} className={`w-max border-[1px] h-[45px] text-base font-poppi ${editActive ? "text-black" : "text-[#7A7A7A]"} border-[#EDEFF3] rounded-[18px] px-4 py-2`}></StyledTextInput>
                        </StyledView>

                        <StyledView>
                            <StyledText className='text-[15px] mb-2 text-[#C0C0BF] font-poppi-medium'>Phone number</StyledText>
                            <StyledView className='flex-row w-max'>
                                <CustomSelect disabled={!editActive} items={prefixData} placeholder={"Select"} selectedItem={selectedPrefix} setSelectedItem={setSelectedPrefix}></CustomSelect>

                                <StyledView className='w-[70%]'>
                                    <StyledTextInput
                                        value={phoneNumValue}
                                        maxLength={7}
                                        keyboardType="numeric"
                                        placeholder="Phone number"
                                        placeholderTextColor={"#7A7A7A"}
                                        editable={editActive}
                                        className={`border-[1px] h-[45px] text-base font-poppi ${editActive ? "text-black" : "text-[#7A7A7A]"} border-[#EDEFF3] rounded-r-[18px] px-4 py-[10px]`}
                                    />
                                </StyledView>
                            </StyledView>
                        </StyledView>
                        <StyledView>
                            <StyledText className='text-[15px] mb-2 text-[#C0C0BF] font-poppi-medium'>Work experience</StyledText>
                            <StyledView className='border-[1px] relative  items-start flex-row border-[#EDEFF3] rounded-[18px] p-4 min-h-[130px]'>

                                <StyledTextInput multiline={true} placeholder='Work experience' placeholderTextColor={"#7A7A7A"} editable={editActive} className={`w-[90%] text-base font-poppi ${editActive ? "text-black" : "text-[#7A7A7A]"} `} />
                                <StyledView className='absolute top-4 right-4'>
                                    <Tooltip
                                        onClose={() => setToolTipVisible(false)}
                                        isVisible={toolTipVisible}
                                        placement='center'
                                        backgroundColor={"rgba(0,0,0,0.5)"}
                                        content={
                                            <StyledView className=''>
                                                <StyledText className='text-[#7A7A7A]'>
                                                    Please indicate any specific information like allergies or other health concerns (if any) that we have to know about your child.
                                                </StyledText>
                                            </StyledView>
                                        }
                                    >
                                        <StyledTouchableOpacity onPress={() => setToolTipVisible(true)}>
                                            <InfoProfileIcon />
                                        </StyledTouchableOpacity>
                                    </Tooltip>
                                </StyledView>
                            </StyledView>
                        </StyledView>


                        <StyledView>
                            <StyledText className='text-[15px] mb-2 text-[#C0C0BF] font-poppi-medium'>Reference person</StyledText>
                            <StyledView className='border-[1px] relative  items-start flex-row border-[#EDEFF3] rounded-[18px] p-4 min-h-[60px]'>
                                <StyledTextInput multiline={true} placeholder='Reference person' placeholderTextColor={"#7A7A7A"} editable={editActive} className={`w-[90%] text-base font-poppi ${editActive ? "text-black" : "text-[#7A7A7A]"} `} />
                            </StyledView>
                        </StyledView>
                    </StyledView>

                </StyledView>

            </KeyboardAwareScrollView>
            {editActive &&
                <StyledTouchableOpacity onPress={() => setEditActive(false)} className='p-[10px] mt-4 items-center justify-center rounded-[18px] w-full bg-[#76F5A4]'>
                    <StyledText className='font-poppi-semibold text-base text-[#204F50]'>Save</StyledText>
                </StyledTouchableOpacity>}
        </StyledView>
    )
}

export default EditProfile