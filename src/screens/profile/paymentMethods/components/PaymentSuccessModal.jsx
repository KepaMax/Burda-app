import React from 'react';
import {Modal, TouchableOpacity} from 'react-native';
import Styled from '@common/StyledComponents';
import {useTranslation} from 'react-i18next';

const PaymentSuccessModal = ({visible, onClose, onGoToTransactions}) => {
  const {t} = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <Styled.View className="flex-1 bg-black/50 justify-center items-center">
        <Styled.View className="bg-white rounded-[16px] py-5 w-full max-w-[320px] items-center">
          {/* Success Icon */}
          <Styled.View className="w-16 h-16 bg-[#66B600] rounded-full items-center justify-center mb-4">
            <Styled.Text className="text-white text-2xl font-bold">✓</Styled.Text>
          </Styled.View>

          {/* Success Title */}
          <Styled.Text className="text-[#66B600] text-xl font-poppins-bold text-center m">
            {t('paymentSuccessfull')}
          </Styled.Text>

          {/* Buttons with separator lines */}
          <Styled.View className="w-full mt-4">
            <TouchableOpacity
              onPress={onClose}
              className="py-2 border-y border-gray-200">
              <Styled.Text className="text-[#333333] text-base font-poppins-medium text-center">
                {t('close')}
              </Styled.Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onGoToTransactions}
              className="py-2">
              <Styled.Text className="text-[#333333] text-base font-poppins-medium text-center">
                {t('goToTransactions')}
              </Styled.Text>
            </TouchableOpacity>
          </Styled.View>
        </Styled.View>
      </Styled.View>
    </Modal>
  );
};

export default PaymentSuccessModal;
