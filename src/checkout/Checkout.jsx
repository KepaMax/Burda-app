import { TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../common/TokenManager";
import { StyledView, StyledText } from "../common/components/StyledComponents";
import FastImage from "react-native-fast-image";
import LocationIcon from "../assets/icons/locationBlueLg.svg";
import LanguageIcon from "../assets/icons/languageBlue.svg";
import StarIcon from "../assets/icons/starBlue.svg";
import { useRoute, useNavigation } from "@react-navigation/native";
import "../locales/index";
import { useTranslation } from "react-i18next";
import { API_URL } from "@env";
import Promocode from "./components/Promocode";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Checkout = () => {
  const { getSupervisorAccessTokenFromMemory } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const chosenSchedule = route.params.chosenSchedule;
  const data = route.params.data;
  const [fetchedStudentData, setFetchedStudentData] = useState();
  const { t } = useTranslation();
  const [studentData, setStudentData] = useState();
  const [detailedData, setDetailedData] = useState();
  const [selectedStudent, setSelectedStudent] = useState();
  const { deepID, deepClassID, deepPromocode } = route?.params;
  const [activePromocode, setActivePromocode] = useState(deepPromocode && null);
  const [loading, setLoading] = useState();
  const languages = [];

  detailedData
    ? detailedData?.languages?.map((language) => {
        languages.push(language);
      })
    : data?.languages?.map((language) => {
        languages.push(language);
      });

  const enrollCourse = async () => {
    const url = `${API_URL}course-classes/${chosenSchedule.id}/enroll/`;

    try {
      setLoading(true);
      const supervisorToken = await getSupervisorAccessTokenFromMemory();
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supervisorToken}`,
        },
        body: JSON.stringify(
          activePromocode
            ? {
                student: selectedStudent,
                plan: 1,
                coupon: activePromocode.code,
              }
            : {
                student: selectedStudent,
                plan: 1,
              }
        ),
      });

      const data = await response.json();

      if (data?.transaction?.payment_url) {
        setLoading(false);
        navigation.navigate("WebViewPayment", {
          url: data.transaction.payment_url,
        });
      } else {
        setLoading(false);
        Alert.alert(t("attributes.error"), data.errors[0].detail);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const url = data?.course?.url;
      if (url) {
        try {
          const supervisorToken = await getSupervisorAccessTokenFromMemory();
          const headers = {
            Authorization: `Bearer ${supervisorToken}`,
          };
          const response = await fetch(url, { headers });
          const data = await response.json();
          setDetailedData(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setStudentData(fetchedStudentData);
    if (fetchedStudentData?.length < 2) {
      setSelectedStudent(fetchedStudentData[0]?.id);
    }
  }, [fetchedStudentData]);

  useEffect(() => {
    const fetchData = async () => {
      const supervisorToken = await getSupervisorAccessTokenFromMemory();
      if (supervisorToken) {
        try {
          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supervisorToken}`,
          };
          const response = await fetch(`${API_URL}supervisors/me/students/`, {
            headers,
          });
          const data = await response.json();

          setFetchedStudentData(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, []);

  function isNumberInInterval(number, interval) {
    const intervalRanges = {
      "1-4": { min: 1, max: 4 },
      "5-8": { min: 5, max: 8 },
      "9-11": { min: 9, max: 11 },
    };

    if (intervalRanges[interval]) {
      const { min, max } = intervalRanges[interval];
      return number >= min && number <= max;
    }

    return false;
  }

  return studentData ? (
    <StyledView className="flex-1 relative bg-[#f6f6f6]">
      <StyledView
        className={`${
          loading === true ? "flex" : "hidden"
        } bg-black/20 h-screen z-50 w-screen absolute items-center justify-center`}
      >
        <ActivityIndicator size="large" color="#0079E9" />
      </StyledView>
      <KeyboardAwareScrollView>
        <StyledView className="bg-white w-auto min-h-[170px] mt-1 mx-5 px-7 py-4 shadow rounded-md shadow-zinc-300">
          <StyledView className="relative w-full rounded-3xl rounded-b-none flex-row items-end border-b border-zinc-200 pb-4">
            <FastImage
              style={{ width: 55, height: 55, borderRadius: 50 }}
              source={{
                uri: data?.course?.thumbnail
                  ? data?.course?.thumbnail
                  : data?.thumbnail,
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />

            <StyledView className="ml-3 w-full">
              <StyledText className="text-base text-[#414141] font-serrat-medium tracking-tight">
                {data?.course?.title ? data?.course?.title : data?.title}
              </StyledText>
              <StyledView className="absolute -right-[135px] -top-2"></StyledView>
              <StyledView className="flex-row justify-between w-auto mt-1">
                <StyledView className="flex-row items-center w-10/12 justify-between">
                  <StyledView className="flex-row w-full items-center justify-between">
                    <StyledView className="flex flex-row items-center">
                      <StyledText className="text-zinc-400 text-xs font-serrat">
                        {t("attributes.courseDetailsInstructor")}
                      </StyledText>
                      <StyledText
                        numberOfLines={1}
                        className="text-sm w-9/12 text-[#414141] font-serrat-medium tracking-tight ml-1"
                      >
                        {detailedData?.instructor?.user?.first_name
                          ? detailedData?.instructor?.user?.first_name
                          : data?.instructor?.user?.first_name}{" "}
                        {detailedData?.instructor?.user?.last_name
                          ? detailedData?.instructor?.user?.last_name
                          : data?.instructor?.user?.last_name}
                      </StyledText>
                    </StyledView>
                    {data?.course?.rating ? (
                      <StyledView className="flex-row items-center">
                        <StarIcon />
                        <StyledText className="font-serrat text-xs text-zinc-500 ml-1">
                          {data?.course?.rating
                            ? data?.course?.rating
                            : data?.rating}
                        </StyledText>
                      </StyledView>
                    ) : null}
                  </StyledView>
                </StyledView>
              </StyledView>
            </StyledView>
          </StyledView>
          <StyledView className="justify-center items-center bg-white my-3">
            <StyledText className="text-zinc-600 text-sm font-serrat-medium">
              {data?.partner_network?.name
                ? data?.partner_network?.name
                : detailedData?.partner_network?.name}
            </StyledText>
            <StyledView className="flex-row items-center justify-between w-full mt-1">
              <StyledView className="flex-row items-center w-8/12">
                <LocationIcon />
                <StyledView className="flex-row items-center ml-1">
                  <StyledText
                    numberOfLines={1}
                    className="text-zinc-500 text-sm mx-1 font-serrat"
                  >
                    {detailedData?.school?.name
                      ? detailedData?.school?.name
                      : data?.school?.name}
                  </StyledText>
                  {detailedData?.school?.distance || data?.school?.distance ? (
                    <StyledText className="text-zinc-400 text-sm font-serrat-italic">
                      (
                      {detailedData?.school?.distance
                        ? detailedData?.school?.distance
                        : data?.school?.distance}
                      )km
                    </StyledText>
                  ) : null}
                </StyledView>
              </StyledView>
              <StyledView className="flex-row items-center">
                <LanguageIcon />
                <StyledView className="flex-row ml-1 mb-1 items-center">
                  {languages?.map((language, index) => {
                    return (
                      <>
                        <StyledText
                          key={index}
                          className="text-zinc-500 text-sm font-serrat"
                        >
                          {language === "aze"
                            ? "az"
                            : language === "rus"
                            ? "ru"
                            : language === "eng"
                            ? "en"
                            : language}
                        </StyledText>
                        <StyledText
                          className={`${
                            index === 0 && languages?.length > 1
                              ? ""
                              : index % 2 && languages?.length > 2
                              ? "block"
                              : "hidden"
                          } text-zinc-500`}
                        >
                          {" "}
                          |{" "}
                        </StyledText>
                      </>
                    );
                  })}
                </StyledView>
              </StyledView>
            </StyledView>
          </StyledView>
        </StyledView>
        <StyledView className="w-auto bg-white shadow shadow-zinc-300 rounded-md mx-5 mt-5 p-4">
          <StyledText className="mb-4 text-lg font-serrat-medium text-[#414141]">
            {t("attributes.chooseStudent")}:
          </StyledText>
          <StyledView className="gap-4">
            {studentData?.map((student, index) => {
              const result = isNumberInInterval(
                student.grade,
                chosenSchedule.grade
              );
              return result ? (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedStudent(student.id);
                  }}
                >
                  <StyledView className="flex-row items-center gap-3">
                    <StyledView className="w-6 h-6 rounded-full border border-zinc-300 items-center justify-center">
                      {selectedStudent === student.id ? (
                        <StyledView className="w-3 h-3 rounded-full bg-[#0079E9]"></StyledView>
                      ) : null}
                    </StyledView>
                    <StyledText className="font-serrat-medium text-base text-[#414141]">
                      {student.user.first_name} {student.user.last_name}
                    </StyledText>
                  </StyledView>
                </TouchableOpacity>
              ) : null;
            })}
          </StyledView>
        </StyledView>
        <StyledView
          className={`bg-white rounded-[5px] shadow shadow-zinc-300 mx-5 mt-5 mb-5`}
        >
          <StyledText className="font-serrat-medium text-lg text-[#414141] text-center my-[10px]">
            {t("attributes.yourCourseSchedule")}
          </StyledText>
          <StyledView className="w-auto bg-[#ECF3F9] py-[8px] flex-row items-center justify-center ">
            <StyledText className="text-sm font-serrat text-[#414141] mr-2">
              {t("attributes.scheduleWeekdays")}
            </StyledText>
            <StyledText className="text-[#379DDF] text-sm font-serrat-medium">
              {chosenSchedule?.days}
            </StyledText>
          </StyledView>
          <StyledView className="my-[20px] mx-[30px] flex-row items-center justify-between">
            <StyledView className="pr-2">
              <StyledText className="text-base text-[#757575] font-serrat-medium">
                {chosenSchedule?.grade}
              </StyledText>
              <StyledText className="text-xs font-serrat text-[#757575]">
                {t("attributes.scheduleClasses")}:
              </StyledText>
            </StyledView>
            <StyledView className="px-[30px] py-[25px] border-x border-[#B7B7B7]">
              {chosenSchedule?.interval.map((txt) => {
                return (
                  <StyledText className="text-base text-[#757575] font-serrat">
                    {txt}
                  </StyledText>
                );
              })}
            </StyledView>
            <StyledView className="flex-row pl-2 items-center gap-2">
              <StyledText className="text-base text-[#0079E9] font-serrat-medium">
                ₼{chosenSchedule?.price}
              </StyledText>
              <StyledText className="text-xs text-[#F8911E] font-serrat-medium">
                {chosenSchedule?.language === "aze"
                  ? "az"
                  : chosenSchedule?.language === "rus"
                  ? "ru"
                  : chosenSchedule?.language === "eng"
                  ? "en"
                  : null}
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>

        <Promocode setActivePromocode={setActivePromocode} />

        {selectedStudent && (
          <>
            <StyledView className="mx-5 mt-2 mb-5">
              <StyledView className="w-auto mb-4 flex-row items-center justify-between">
                <StyledText className="font-serrat text-base text-[#414141]">
                  {t("attributes.coursePrice")}
                </StyledText>
                <StyledText className="font-serrat-semiBold text-base text-[#414141]">
                  ₼{parseInt(chosenSchedule?.price)}
                </StyledText>
              </StyledView>
              {activePromocode && (
                <StyledView className="w-auto mb-4 flex-row items-center justify-between">
                  <StyledText className="font-serrat text-base text-[#414141]">
                    {t("attributes.discount")}{" "}
                    {`${activePromocode?.discount * 100}%`}
                  </StyledText>
                  <StyledText className="font-serrat-semiBold text-base text-[#414141]">
                    -₼
                    {Math.round(
                      parseInt(chosenSchedule?.price) *
                        activePromocode?.discount
                    )}
                  </StyledText>
                </StyledView>
              )}
              <StyledView className="w-auto mb-4 pt-4 flex-row items-center justify-between border-t border-zinc-400">
                <StyledText className="font-serrat-semiBold text-base text-[#414141]">
                  {t("attributes.mainCheckoutTotal")}
                </StyledText>
                <StyledText className="font-serrat-semiBold text-base text-[#414141]">
                  ₼
                  {activePromocode
                    ? Math.round(
                        parseInt(chosenSchedule?.price) -
                          parseInt(chosenSchedule?.price) *
                            activePromocode?.discount
                      )
                    : parseInt(chosenSchedule?.price)}
                </StyledText>
              </StyledView>
            </StyledView>
            <StyledView className="mx-5 mb-5">
              <TouchableOpacity
                onPress={() => {
                  enrollCourse();
                }}
              >
                <StyledView className="py-4 rounded-md bg-[#0079E9]">
                  <StyledText className="text-white text-base text-center font-serrat-medium">
                    {t("attributes.mainCheckoutConfirm")}
                  </StyledText>
                </StyledView>
              </TouchableOpacity>
            </StyledView>
          </>
        )}
      </KeyboardAwareScrollView>
    </StyledView>
  ) : null;
};

export default Checkout;
