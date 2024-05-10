import {
  SectionList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import ChevronLeftIcon from "../assets/icons/chevron-left.svg";
import Delete from "../assets/icons/notificationsDelete.svg";
import Cancel from "../assets/icons/cancel.svg";
import { useTranslation } from "react-i18next";
import { StyledView, StyledText } from "../common/components/StyledComponents";
import "../locales/index";
import {
  format,
  isToday,
  isThisWeek,
  isThisMonth,
  differenceInDays,
} from "date-fns";
import { API_URL } from "@env";
import messaging from "@react-native-firebase/messaging";
import { request, PERMISSIONS } from "react-native-permissions";

const Notifications = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const [editmode, setEditMode] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const emptyArray = [];

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    //   // console.log(Platform.OS, `status: ${enabled}`);

    if (Platform.OS === "ios" && !enabled) {
      Alert.alert(
        t("attributes.error"),
        t("attributes.noNotificationPermission"),
        [{ text: "OK", onPress: () => Linking.openSettings() }]
      );
    }
  }

  useEffect(() => {
    request(
      Platform.OS === "android" ? PERMISSIONS.ANDROID.POST_NOTIFICATIONS : null
    ).then((result) => {
      if (result === "granted") {
        requestUserPermission();
      } else {
        if (Platform.OS === "android") {
          Alert.alert(
            t("attributes.error"),
            t("attributes.noNotificationPermission"),
            [{ text: "OK", onPress: () => Linking.openSettings() }]
          );
        }
      }
    });

    if (Platform.OS === "ios") {
      requestUserPermission();
    }
  }, []);

  const onRefresh = () => {
    setTrigger((prevState) => !prevState);
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const formatNotifications = (notifications) => {
    const transformData = () => {
      const today = new Date();
      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - 7);
      const thisMonth = new Date();
      thisMonth.setMonth(thisMonth.getMonth() - 1);

      const transformedData = [
        { title: t("attributes.today"), data: [] },
        { title: t("attributes.thisWeek"), data: [] },
        { title: t("attributes.thisMonth"), data: [] },
      ];

      notifications.forEach((item) => {
        const itemDate = new Date(item.created_at);

        if (isToday(itemDate)) {
          transformedData[0].data.push({
            title: item.title,
            description: item.body,
            date: `${format(itemDate, "HH:mm")}, ${t("attributes.todaySmall")}`,
            id: item.id,
            today: true,
          });
        } else if (isThisWeek(itemDate)) {
          transformedData[1].data.push({
            title: item.title,
            description: item.description,
            date: `${
              differenceInDays(today, itemDate) > 0
                ? differenceInDays(today, itemDate)
                : 1
            }${t("attributes.dayAgo")}`,
            id: item.id,
            today: false,
          });
        } else if (isThisMonth(itemDate)) {
          transformedData[2].data.push({
            title: item.title,
            description: item.description,
            date: `${
              differenceInDays(today, itemDate) >= 7
                ? Math.round(differenceInDays(today, itemDate) / 7)
                : differenceInDays(today, itemDate)
            }${
              differenceInDays(today, itemDate) >= 7
                ? t("attributes.weekAgo")
                : t("attributes.dayAgo")
            }`,
            id: item.id,
            today: false,
          });
        }
      });

      return transformedData;
    };

    const transformedData = transformData();
    setNotificationsList(transformedData);
  };

  const renderItem = ({ item }) => {
    return (
      <StyledView className="flex-row items-center w-auto mx-5 my-[6px]">
        {editmode ? (
          <TouchableOpacity
            onPress={() => {
              setSelectedNotifications((prevNotifications) => {
                if (prevNotifications.includes(item.id)) {
                  return prevNotifications.filter(
                    (notificationId) => notificationId !== item.id
                  );
                } else {
                  return [...prevNotifications, item.id];
                }
              });
            }}
          >
            <StyledView
              className={`h-[20px] w-[20px] bg-white rounded-full mr-[8px] border-4 ${
                selectedNotifications.includes(item.id)
                  ? "border-[#0079E9]"
                  : "border-white"
              } `}
            ></StyledView>
          </TouchableOpacity>
        ) : null}

        <StyledView
          className={`flex-1 relative rounded-[8px] shadow shadow-zinc-300 px-[16px] pt-[8px] pb-[35px] ${
            item.today ? "bg-[#EFF7FF]" : "bg-white"
          } `}
        >
          <StyledText className="text-[#414141] mb-[4px] text-base font-serrat-medium">
            {item.title}
          </StyledText>
          <StyledText className="text-[#414141] text-sm font-serrat">
            {item.description}
          </StyledText>
          <StyledText className="text-[#B1B1B1] absolute right-[16px] bottom-[8px] text-xs font-serrat">
            {item.date}
          </StyledText>
        </StyledView>
      </StyledView>
    );
  };

  const NoActivities = () => {
    return (
      <StyledView className={`flex-1 items-center justify-center`}>
        <StyledText className="text-[#414141] text-sm font-serrat">
          {t("attributes.noNotifications")}
        </StyledText>
      </StyledView>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const url = `${API_URL}notifications/`;

      try {
        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          formatNotifications(data.results);
          setInitialDataFetched(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [trigger]);

  return (
    <>
      <StyledView className="w-full bg-[#f6f6f6] items-center">
        <StyledView className="w-11/12 items-center relative">
          <StyledView className="absolute left-0 top-7">
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => navigation.goBack()}
            >
              <ChevronLeftIcon />
            </TouchableOpacity>
          </StyledView>

          <StyledText className="text-black font-serrat-medium text-lg pb-5 pt-6">
            {t("attributes.notificationsTitle")}
          </StyledText>

          {/* <StyledView
            className={`items-center justify-center absolute right-0 top-5 h-[36px] w-[36px] shadow ${
              Platform.OS === 'ios' ? 'shadow-zinc-300' : 'shadow-zinc-400'
            } bg-white rounded-full`}>
            <TouchableOpacity
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              onPress={() => setEditMode(true)}>
              <NotificationsEdit />
            </TouchableOpacity>
          </StyledView> */}
        </StyledView>
      </StyledView>

      {initialDataFetched && notificationsList.length > 2 ? (
        <>
          {JSON.stringify(notificationsList) ===
            JSON.stringify([
              { title: "Today", data: [] },
              { title: "This week", data: [] },
              { title: "This month", data: [] },
            ]) ||
          JSON.stringify(notificationsList) ===
            JSON.stringify([
              { title: "Bugün", data: [] },
              { title: "Bu həftə", data: [] },
              { title: "Bu ay", data: [] },
            ]) ||
          JSON.stringify(notificationsList) === JSON.stringify(emptyArray) ? (
            <NoActivities />
          ) : (
            <>
              <SectionList
                contentContainerStyle={{ paddingBottom: 20 }}
                stickySectionHeadersEnabled={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                ListEmptyComponent={NoActivities}
                renderSectionHeader={({ section: { title, data } }) =>
                  data.length ? (
                    <StyledView className="flex-row justify-between items-center mx-5 mt-[16px] mb-[6px]">
                      <StyledText className="text-[#414141] text-lg font-serrat-medium">
                        {title}
                      </StyledText>

                      {editmode ? (
                        <TouchableOpacity
                          onPress={() => selectAllInSection(data)}
                        >
                          <StyledText className="text-[#0079E9] font-serrat-italic underline text-sm">
                            {t("attributes.selectAll")}
                          </StyledText>
                        </TouchableOpacity>
                      ) : null}
                    </StyledView>
                  ) : null
                }
                sections={notificationsList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
              />
              {editmode ? (
                <StyledView className="h-[65px] bg-[#0079E9] rounded-t-lg flex-row items-center justify-between px-[24px]">
                  {/* <TouchableOpacity>
                 <StyledView className="items-center">
                   <Read />
                   <StyledText className="mt-1 text-white text-xs font-serrat-medium">
                     Read
                   </StyledText>
                 </StyledView>
               </TouchableOpacity> */}

                  <TouchableOpacity onPress={deleteSelectedNotifications}>
                    <StyledView className="items-center">
                      <Delete />
                      <StyledText className="mt-1 text-white text-xs font-serrat-medium">
                        {t("attributes.profileDeleteYes")}
                      </StyledText>
                    </StyledView>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setEditMode(false);
                      setSelectedNotifications([]);
                    }}
                  >
                    <StyledView className="items-center">
                      <Cancel />
                      <StyledText className="mt-1 text-white text-xs font-serrat-medium">
                        {t("attributes.searchCancel")}
                      </StyledText>
                    </StyledView>
                  </TouchableOpacity>
                </StyledView>
              ) : null}
            </>
          )}
        </>
      ) : (
        <StyledView className="flex-1 items-center justify-center">
          <ActivityIndicator size={"large"} color="#0079E9" />
        </StyledView>
      )}
    </>
  );
};

export default Notifications;
