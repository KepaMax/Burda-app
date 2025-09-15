import React from 'react';
import {Modal, TouchableOpacity} from 'react-native';
import Styled from '@common/StyledComponents';
import {useTranslation} from 'react-i18next';

const PaymentFailureModal = ({visible, onClose}) => {
  const {t} = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <Styled.View className="flex-1 bg-black/50 justify-center items-center ">
        <Styled.View className="bg-white rounded-[16px] p-6 w-full max-w-[320px] items-center">
          {/* Failure Icon */}
          <Styled.View className="w-16 h-16 bg-[#FF6B6B] rounded-full items-center justify-center mb-4">
            <Styled.Text className="text-white text-2xl font-bold">✕</Styled.Text>
          </Styled.View>

          {/* Failure Title */}
          <Styled.Text className="text-black text-xl font-poppins-bold text-center mb-2">
            {t('paymentFailed')}
          </Styled.Text>

          {/* Failure Message */}
          <Styled.Text className="text-[#FF6B6B] text-lg font-poppins-medium text-center mb-6">
            {t('paymentFailed')}
          </Styled.Text>

          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            className="w-full  px-6 rounded-[8px]">
            <Styled.Text className="text-[#666666] text-base font-poppins-medium text-center">
              {t('close')}
            </Styled.Text>
          </TouchableOpacity>
        </Styled.View>
      </Styled.View>
    </Modal>
  );
};

export default PaymentFailureModal;
