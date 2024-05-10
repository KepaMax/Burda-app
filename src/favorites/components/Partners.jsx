import { FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../../common/TokenManager";
import BookmarkFillIcon from "../../assets/icons/bookmarkFill.svg";
import FastImage from "react-native-fast-image";
import StarIcon from "../../assets/icons/starFillYellow.svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import "../../locales/index";
import { useTranslation } from "react-i18next";
import NoItems from "../../assets/icons/noItems.svg";
import {
  StyledView,
  StyledText,
} from "../../common/components/StyledComponents";
import { API_URL } from "@env";

const Partners = () => {
  const {
    getStudentAccessTokenFromMemory,
    getSupervisorAccessTokenFromMemory,
  } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const route = useRoute();
  const [initialDataFetched, setInitialDataFetched] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const fetchData = async () => {
    setInitialDataFetched(false);
    const studentToken = await getStudentAccessTokenFromMemory();
    const supervisorToken = await getSupervisorAccessTokenFromMemory();
    const token = studentToken ? studentToken : supervisorToken;
    const headers = {
      Accept: "application/json; version=v2",
      Authorization: `Bearer ${token}`,
    };

    if (token) {
      try {
        const response = await fetch(
          `${API_URL}partner-networks/?is_favorite=true&ordering=-marked_as_favorite_at&page_size=100`,
          {
            headers,
          }
        );

        if (response.ok) {
          const jsonData = await response.json();
          setData(jsonData.results);
          setInitialDataFetched(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  async function unsetFavorite(id) {
    const url = `${API_URL}users/me/favorites/partner-networks/${id}/`;
    const studentToken = await getStudentAccessTokenFromMemory();
    const supervisorToken = await getSupervisorAccessTokenFromMemory();
    const token = studentToken ? studentToken : supervisorToken;
    const headers = {
      Accept: "application/json; version=v2",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    if (token) {
      try {
        const response = await fetch(url, {
          method: "DELETE",
          headers: headers,
        });
        if (response.ok) {
          setTrigger(!trigger);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }

  const renderItem = ({ item }) => {
    const categories = [];
    item?.categories?.map((category) => {
      categories.push(category.name);
    });

    return (
      <StyledView className="h-[120px] bg-white my-[6px] rounded-lg shadow shadow-zinc-300 mx-5">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("PartnerNetworkFavoritesProxy", {
              url: item?.url,
              routeName: route.name,
            });
          }}
        >
          <StyledView className="p-[10px] relative">
            <StyledView className="flex-row">
              <FastImage
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 5,
                }}
                source={{
                  uri: item?.logo,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
              />
              <StyledView className="ml-2 pl-2 border-l border-zinc-200 py-1 justify-between flex-1">
                <StyledView>
                  <StyledText className="font-serrat-medium text-base text-zinc-500">
                    {item?.name}
                  </StyledText>
                  <StyledText
                    numberOfLines={1}
                    className="font-serrat-medium mt-1 text-sm text-[#B7B7B7]"
                  >
                    {categories.join(" · ")}
                  </StyledText>
                </StyledView>
                <StyledView className="items-center flex-row justify-between">
                  {item?.rating ? (
                    <StyledView className="flex-row items-center">
                      <StarIcon />
                      <StyledText className="font-serrat text-xs text-[#757575] ml-1.5">
                        {item?.rating}
                      </StyledText>
                    </StyledView>
                  ) : null}

                  {/* {item.languages ? (
                    <StyledView className="flex-row items-center">
                      <Language />
                      <StyledText className="w-fit flex-row items-center text-xs text-[#757575] ml-1.5">
                        {item.languages.join(' | ')}
                      </StyledText>
                    </StyledView>
                  ) : null} */}
                </StyledView>
              </StyledView>
            </StyledView>
            <StyledView className="absolute top-3 right-3">
              <TouchableOpacity
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => {
                  unsetFavorite(item?.id);
                }}
              >
                {<BookmarkFillIcon />}
              </TouchableOpacity>
            </StyledView>
          </StyledView>
        </TouchableOpacity>
      </StyledView>
    );
  };

  useEffect(() => {
    fetchData();
  }, [trigger]);

  return data.length ? (
    <FlatList
      style={{ backgroundColor: "#f6f6f6" }}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  ) : initialDataFetched && !data.length ? (
    <StyledView className="flex-1 items-center justify-center">
      <NoItems />
      <StyledText className="font-serrat mt-5 text-lg text-black">
        {t("attributes.noFavoritedPartners")}
      </StyledText>
    </StyledView>
  ) : (
    <StyledView className="flex-1 items-center justify-center">
      <ActivityIndicator size={"large"} color="#0079E9" />
    </StyledView>
  );
};

export default Partners;
