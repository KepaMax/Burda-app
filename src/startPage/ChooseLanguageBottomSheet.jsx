import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet, { useBottomSheet } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AzFlagIcon from "../../assets/icons/az-flag-language.svg"
import RusFlagIcon from "../../assets/icons/rus-flag-language.svg"
import EnFlagIcon from "../../assets/icons/en-flag-language.svg"
import ActiveIcon from "../../assets/icons/active-language.svg"
import { StyledText, StyledTouchableOpacity, StyledView } from '../common/components/StyledComponents';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AuthContext from '../common/TokenManager';

const ChooseLanguageBottomSheet = () => {
    const bottomSheetRef = useRef(null);
    const { setLanguage, getLanguage } = useContext(AuthContext);
    const { t, i18n } = useTranslation();
    const [lang, setLang] = useState();
    // const navigation = useNavigation();

    useEffect(() => {
        const currentLanguage = async () => {
            const activeLanguage = await getLanguage();
            setLang(activeLanguage);
        };
        currentLanguage();
    }, []);

    const snapPoints = useMemo(() => ['45%'], []);


    return (
        <StyledView className=' bg-black/20 absolute h-full w-screen z-50' >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheet
                    ref={bottomSheetRef}
                    index={0}
                    snapPoints={snapPoints}
                    handleIndicatorStyle={{ backgroundColor: '#BEBFC0' }}
                    backgroundStyle={{ backgroundColor: '#fff' }}
                >
                    <StyledView className='p-6 w-max h-full'>

                      
                            <StyledText className="font-poppi-bold text-xl mb-5 text-[#204F50]">{t("attributes.chooseLanguage")}</StyledText>

                            <StyledView className="gap-4">
                                <StyledTouchableOpacity onPress={() => {
                                    i18n.changeLanguage("az");
                                    setLanguage("az");
                                    //navigation.goBack();
                                }}>
                                    <StyledView className="items-center flex-row justify-between border-[1px] rounded-[18px] border-[#EDEFF3] w-full p-4 pr-6">
                                        <StyledView className="flex-row items-center">
                                            <AzFlagIcon />
                                            <StyledText
                                                className={`text-[#204F50] text-base font-poppi-medium ml-2`}>
                                                Azərbaycan dili
                                            </StyledText>
                                        </StyledView>
                                        {lang === 'az' && <ActiveIcon />}
                                    </StyledView>
                                </StyledTouchableOpacity>

                                <StyledTouchableOpacity onPress={() => {
                                    i18n.changeLanguage("rus");
                                    setLanguage("rus");
                                    //navigation.goBack();
                                }}>
                                    <StyledView className="items-center flex-row justify-between border-[1px] rounded-[18px] border-[#EDEFF3] w-full p-4 pr-6">
                                        <StyledView className="flex-row items-center">
                                            <RusFlagIcon />
                                            <StyledText
                                                className={`text-[#204F50] text-base font-poppi-medium ml-2`}>
                                                Русский
                                            </StyledText>
                                        </StyledView>
                                        {lang === 'rus' && <ActiveIcon />}
                                    </StyledView>
                                </StyledTouchableOpacity>

                                <StyledTouchableOpacity onPress={() => {
                                    i18n.changeLanguage("en");
                                    setLanguage("en");
                                    // navigation.goBack();
                                }}>
                                    <StyledView className="items-center flex-row justify-between border-[1px] rounded-[18px] border-[#EDEFF3] w-full p-4 pr-6">
                                        <StyledView className="flex-row items-center">
                                            <EnFlagIcon />
                                            <StyledText
                                                className={`text-[#204F50] text-base font-poppi-medium ml-2`}>
                                                English
                                            </StyledText>
                                        </StyledView>
                                        {lang === 'en' && <ActiveIcon />}
                                    </StyledView>
                                </StyledTouchableOpacity>
                            </StyledView>
                    </StyledView>
                </BottomSheet>
            </GestureHandlerRootView>

        </StyledView>
    );
};

export default ChooseLanguageBottomSheet;