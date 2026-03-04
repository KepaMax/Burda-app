import Styled from '@common/StyledComponents';
import { useNavigation } from '@react-navigation/native';
import Icons from '@icons/icons.js';
import { TouchableOpacity, FlatList } from 'react-native';

const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        title: 'Sifarişiniz təsdiqləndi ✅',
        message: 'Sizin #1042 nömrəli sifarişiniz qəbul edildi və hazırlanır.',
        time: '5 dəq əvvəl',
        read: false,
    },
    {
        id: '2',
        title: 'Xüsusi endirim 🎉',
        message: 'Bu gün bütün pizza çeşidlərində 20% endirim! Fürsəti qaçırmayın.',
        time: '30 dəq əvvəl',
        read: false,
    },
    {
        id: '3',
        title: 'Sifarişiniz çatdırıldı 🚗',
        message: '#1038 nömrəli sifarişiniz uğurla çatdırıldı. Nuş olsun!',
        time: '2 saat əvvəl',
        read: true,
    },
    {
        id: '4',
        title: 'Yeni menyu əlavə olundu 🍽️',
        message: 'Həftəlik menyuya yeni yeməklər əlavə edildi. İndi baxın!',
        time: '5 saat əvvəl',
        read: true,
    },
    {
        id: '5',
        title: 'Ödəniş uğurlu 💳',
        message: '#1035 nömrəli sifarişiniz üçün 25.00 AZN ödəniş qəbul edildi.',
        time: 'Dünən',
        read: true,
    },
    {
        id: '6',
        title: 'Bonusunuz artırıldı 🎁',
        message: 'Sədaqət proqramı çərçivəsində hesabınıza 5 bonus əlavə edildi.',
        time: 'Dünən',
        read: true,
    },
    {
        id: '7',
        title: 'Rəy bildirin ⭐',
        message: 'Son sifarişinizi qiymətləndirin və 3 bonus qazanın!',
        time: '2 gün əvvəl',
        read: true,
    },
];

const NotificationItem = ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Styled.View
            className={`px-4 py-4 border-b-[1px] border-[#EBEBEB] flex-row ${!item.read ? 'bg-[#EEF5F1]' : 'bg-white'
                }`}>
            {/* Unread dot */}
            <Styled.View className="pt-1.5 mr-3">
                <Styled.View
                    className={`w-2.5 h-2.5 rounded-full ${!item.read ? 'bg-[#184639]' : 'bg-transparent'
                        }`}
                />
            </Styled.View>

            {/* Content */}
            <Styled.View className="flex-1">
                <Styled.Text className="text-[15px] font-semibold text-[#1A1A1A] mb-1">
                    {item.title}
                </Styled.Text>
                <Styled.Text className="text-[13px] text-[#666] leading-[18px]">
                    {item.message}
                </Styled.Text>
                <Styled.Text className="text-[11px] text-[#999] mt-2">
                    {item.time}
                </Styled.Text>
            </Styled.View>
        </Styled.View>
    </TouchableOpacity>
);

const NotificationsPage = () => {
    const navigation = useNavigation();

    return (
        <Styled.View className="flex-1 bg-[#F8F8F8]">
            {/* Header */}
            <Styled.View className="px-4 py-5 border-b-[1px] border-[#E4E4E4] flex-row items-center">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icons.ArrowBlack width={24} height={24} />
                </TouchableOpacity>
                <Styled.Text className="text-[18px] font-semibold text-[#184639] ml-3">
                    Bildirişlər
                </Styled.Text>
            </Styled.View>

            {/* Notification list */}
            <FlatList
                data={MOCK_NOTIFICATIONS}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <NotificationItem
                        item={item}
                        onPress={() => navigation.navigate('NotificationDetail', { notification: item })}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </Styled.View>
    );
};

export default NotificationsPage;
