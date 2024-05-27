import { FlatList } from 'react-native'
import { StyledText, StyledTouchableOpacity, StyledView } from '../common/components/StyledComponents'
import ArrowRightIcon from "../../assets/icons/arrow-right-profile.svg"
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

const ChildrenSubscription = () => {
    const navigation = useNavigation();
    const { t } = useTranslation();
    const data = [
        { name: "Mikael", surname: "David" },
        { name: "Mikael", surname: "David" },
        { name: "Mikael", surname: "David" },
        { name: "Mikael", surname: "David" },
    ]

    const renderItem = ({ item }) => (
        <StyledTouchableOpacity onPress={() => navigation.navigate("SubscriptionPayment")} className='p-4 flex-row items-center justify-between rounded-[24px] border-[1px] border-[#EDEFF3]'>
            <StyledText className="text-[#204F50] text-base font-poppi-medium">{`${item.name} ${item.surname}`}</StyledText>
            <ArrowRightIcon />
        </StyledTouchableOpacity>
    )

    return (
        <StyledView className='flex-1 bg-white gap-4 p-4'>
            <StyledText className='text-[#204F50] text-base font-poppi-semibold'>{t("attributes.students")}</StyledText>
            <FlatList
                contentContainerStyle={{ gap: 16 }}
                data={data}
                renderItem={renderItem}
            />
        </StyledView>
    )
}

export default ChildrenSubscription