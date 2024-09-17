import Styled from '@common/StyledComponents';
import Icons from '@icons/icons';
import {useTranslation} from 'react-i18next';

const LogOutButton = ({setLogoutModalOpen}) => {
  const {t} = useTranslation();

  return (
    <Styled.TouchableOpacity
      onPress={() => {
        setLogoutModalOpen(true);
      }}
      className="py-2 border-[1px] mx-5 border-[#FF8C03] justify-center items-center rounded-[24px]">
      <Styled.View className="flex-row">
        <Icons.LogOut />
        <Styled.Text
          className={`text-[#FF8C03] text-base font-poppi-semibold ml-2`}>
          {t('attributes.logout')}
        </Styled.Text>
      </Styled.View>
    </Styled.TouchableOpacity>
  );
};

export default LogOutButton;
