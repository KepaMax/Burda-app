import Styled from '@common/StyledComponents';
import Icons from '@icons/icons';
import {useTranslation} from 'react-i18next';
import storage from '@utils/MMKVStore';
import {useMMKVString} from 'react-native-mmkv';

const LogOutButton = () => {
  const {t} = useTranslation();
  const [buttonType, setButtonType] = useMMKVString('buttonType');

  return (
    <Styled.TouchableOpacity
      onPress={() => {
        setButtonType('#FF8C03');
        alert(
          t('wantToLogout'),
          t('logoutDescription'),

          {
            textConfirm: t('yes'),
            textCancel: t('no'),
            onConfirm: () => storage.clearAll(),
          },
        );
      }}
      className="py-2 border-[1px] mx-5 border-[#FF8C03] justify-center items-center rounded-[24px]">
      <Styled.View className="flex-row">
        <Icons.LogOut />
        <Styled.Text
          className={`text-[#FF8C03] text-base font-poppins-semibold ml-2`}>
          {t('logout')}
        </Styled.Text>
      </Styled.View>
    </Styled.TouchableOpacity>
  );
};

export default LogOutButton;
