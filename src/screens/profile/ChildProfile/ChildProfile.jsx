import FastImage from 'react-native-fast-image';
import {
  StyledText,
  StyledTouchableOpacity,
  StyledView,
  StyledScrollView,
  StyledTextInput,
} from '@common/StyledComponents';
import PhoneIcon from '@icons/child-profile-phone.svg';
import MessageIcon from '@icons/child-profile-message.svg';
import {Linking} from 'react-native';
import {useTranslation} from 'react-i18next';
import {format} from 'date-fns';

const ChildProfile = () => {
  const {t} = useTranslation();

  const InfoInput = ({title, value}) => (
    <StyledView className="w-full">
      <StyledText className="text-[15px] font-poppi-medium text-[#C0C0BF]">
        {title}
      </StyledText>
      <StyledTextInput
        className="border-[1px] text-black text-base font-poppi border-[#EDEFF3] rounded-[18px] px-4 py-2 my-2"
        value={value}
      />
    </StyledView>
  );

  return (
    <StyledScrollView
      contentContainerStyle={{
        alignItems: 'center',
        padding: 16,
        paddingBottom: 40,
      }}
      className="bg-white flex-1">
      <FastImage
        style={{
          width: 120,
          height: 120,
          borderRadius: 100,
          marginVertical: 16,
        }}
        source={{
          uri: 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
        }}
      />

      <StyledView className="w-full flex-row justify-between items-center p-[10px] px-4 border-[1px] border-[#EDEFF3] rounded-[18px]">
        <StyledView>
          <StyledText className="text-base text-black font-poppi-bold">
            Aynur Mammadova
          </StyledText>
          <StyledText className="text-base font-poppi text-[#868782]">
            +994 55 555 55 55
          </StyledText>
        </StyledView>
        <StyledTouchableOpacity
          onPress={() => Linking.openURL('tel:7777777777')}>
          <PhoneIcon />
        </StyledTouchableOpacity>
      </StyledView>

      <StyledView className="w-full flex-row justify-between my-2 items-center p-[10px] px-4 border-[1px] border-[#EDEFF3] rounded-[18px]">
        <StyledView>
          <StyledText className="text-base text-black font-poppi-bold">
            Aytac Mammadova
          </StyledText>
          <StyledText className="text-base font-poppi text-[#868782]">
            +994 55 555 55 55
          </StyledText>
        </StyledView>
        <StyledView className="flex-row gap-2">
          <StyledTouchableOpacity
            onPress={() => Linking.openURL('tel:7777777777')}>
            <PhoneIcon />
          </StyledTouchableOpacity>
          <StyledTouchableOpacity
            onPress={() => Linking.openURL('sms:7777777777')}>
            <MessageIcon />
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>

      <StyledView>
        <StyledText className="text-base font-poppi-semibold text-[#7658F2]">
          {t('attributes.profileEmergencyContact')}
        </StyledText>
        <StyledView className="w-full flex-row my-2 justify-between items-center p-[10px] px-4 border-[1px] border-[#EDEFF3] rounded-[18px]">
          <StyledView>
            <StyledText className="text-base text-black font-poppi-bold">
              Rauf Mammadov
            </StyledText>
            <StyledText className="text-base font-poppi text-[#868782]">
              +994 55 555 55 55
            </StyledText>
          </StyledView>
          <StyledTouchableOpacity
            onPress={() => Linking.openURL('tel:7777777777')}>
            <PhoneIcon />
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>

      <InfoInput
        title={t('attributes.profileEmail')}
        value={'2school@example.com'}
      />

      <InfoInput
        title={t('attributes.profileBirthDate')}
        value={format(new Date(), 'dd/MM/yyyy')}
      />

      <InfoInput
        title={t('attributes.homeAddress')}
        value={'Uzeyir Hajibeyov 57'}
      />

      <InfoInput
        title={t('attributes.profileSchool')}
        value={' Gymnasium №27'}
      />

      <InfoInput
        title={t('attributes.profileSpecificComment')}
        value={'lorem ipsum'}
      />
    </StyledScrollView>
  );
};

export default ChildProfile;
