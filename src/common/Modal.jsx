import {
  StyledText,
  StyledTouchableOpacity,
  StyledView,
} from './StyledComponents';
import WarningProfileIcon from '@icons/warning-profile.svg';
import InfoIcon from '@icons/modal-info.svg';

const Modal = ({
  modalType,
  setModalOpen,
  title,
  description,
  yesButtonAction,
  yesButtonTitle,
  noButtonAction,
  noButtonTitle,
}) => {
  return (
    <StyledView className="items-center justify-center bg-black/20 absolute h-full w-screen z-50">
      <StyledView
        className={`bg-white p-4 pt-12 rounded-sm shadow justify-center items-center shadow-zinc-400 border-t-2 ${
          modalType === 'info' ? 'border-[#7658F2]' : 'border-[#FF3115]'
        } mx-4`}>
        <StyledView
          className={`${
            modalType === 'info' ? 'bg-[#7658F2]' : 'bg-[#FF3115]'
          } w-[42px] h-[42px] items-center justify-center absolute -top-5 rounded-full`}>
          {modalType === 'info' ? <InfoIcon /> : <WarningProfileIcon />}
        </StyledView>

        <StyledText className="text-center text-base font-poppi-semibold text-[#414141] my-4">
          {title}
        </StyledText>

        <StyledText className="text-center text-sm font-serrat text-[#414141]">
          {description}
        </StyledText>

        <StyledView className="flex-row w-full items-center mt-10">
          <StyledTouchableOpacity
            onPress={() => {
              noButtonAction ? noButtonAction() : setModalOpen(false);
            }}
            className="py-2 w-1/2 rounded-md">
            <StyledText className="text-center text-lg font-serrat-medium text-[#757575]">
              {noButtonTitle}
            </StyledText>
          </StyledTouchableOpacity>

          <StyledTouchableOpacity
            onPress={yesButtonAction}
            className={`py-2 px-4 w-1/2 ${
              modalType === 'info' ? 'bg-[#7658F2]' : 'bg-[#FF3115]'
            } rounded-md`}>
            <StyledText className="text-center text-lg text-white font-serrat-medium">
              {yesButtonTitle}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
    </StyledView>
  );
};

export default Modal;
