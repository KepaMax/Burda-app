import { useState, useEffect, useContext } from "react";
import { TouchableOpacity, ScrollView } from "react-native";
import DescendWhiteIcon from "../../assets/icons/descendWhite.svg";
import AscendWhiteIcon from "../../assets/icons/ascendWhite.svg";
import CrossIcon from "../../assets/icons/filterX.svg";
import Animated from "react-native-reanimated";
import { FadeInDown } from "react-native-reanimated";
import {
  StyledView,
  StyledText,
  StyledTouchableOpacity,
  StyledScrollView,
} from "./StyledComponents";
import { API_URL } from "@env";
import { useTranslation } from "react-i18next";
import Dropdown from "./Dropdown";
import AuthContext from "../TokenManager";

const FilterComponent = ({
  instructor,
  partnerNetwork,
  filterVisible,
  setFilterVisible,
  setUrlWithFiltering,
  setFilteredData,
}) => {
  const {
    getStudentAccessTokenFromMemory,
    getSupervisorAccessTokenFromMemory,
  } = useContext(AuthContext);
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [inYourSchool, setInYourSchool] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolData, setSchoolData] = useState([]);
  const [schoolPage, setSchoolPage] = useState(1);
  const [schoolDataFetching, setSchoolDataFetching] = useState(false);
  const [studentSchool, setStudentSchool] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [ordering, setOrdering] = useState([]);
  const [orderingString, setOrderingString] = useState("");
  const [url, setUrl] = useState(
    instructor
      ? `${API_URL}instructors/?page_size=1000`
      : partnerNetwork
      ? `${API_URL}partner-networks/?page_size=1000`
      : `${API_URL}courses/?page_size=1000&is_active=true`
  );

  const getUserData = async () => {
    try {
      const supervisorToken = await getSupervisorAccessTokenFromMemory();
      const studentToken = await getStudentAccessTokenFromMemory();
      const supervisorLink = `${API_URL}supervisors/me/`;
      const studentLink = `${API_URL}students/me/`;
      const headers = {
        Accept: "*/*; version=v2",
        Authorization: `Bearer ${
          studentToken ? studentToken : supervisorToken
        }`,
      };
      const response = await fetch(
        studentToken ? studentLink : supervisorToken ? supervisorLink : null,
        { headers }
      );
      const jsonData = await response.json();
      setStudentSchool(jsonData.school.id);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getSchoolData = async () => {
    try {
      setSchoolDataFetching(true);
      const response = await fetch(`${API_URL}schools/?page=${schoolPage}`);
      if (response.ok) {
        const jsonData = await response.json();
        const formattedItems = jsonData.results.map((item) => ({
          label: item?.name,
          value: item?.id,
        }));

        const allItems = [...schoolData, ...formattedItems];

        setSchoolData(allItems);
        setSchoolPage(schoolPage + 1);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setSchoolDataFetching(false);
    }
  };

  const getSearchResults = async () => {
    try {
      const response = await fetch(`${API_URL}schools/?search=${searchTerm}`);
      if (response.ok) {
        const jsonData = await response.json();

        const formattedItems = jsonData.results.map((item) => ({
          label: item?.name,
          value: item?.id,
        }));

        // setSchoolPage(1);
        setSearchResults(formattedItems);
        // formattedItems.length ? setSchoolData([]) : null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getCategories = async () => {
    try {
      const response = await fetch(`${API_URL}categories/`);
      const jsonData = await response.json();
      setCategories(jsonData.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEndReached = () => {
    if (!schoolDataFetching) {
      getSchoolData();
    }
  };

  const handleFilterApply = () => {
    setUrl(
      instructor
        ? `${API_URL}instructors/?page_size=1000`
        : partnerNetwork
        ? `${API_URL}partner-networks/?page_size=1000`
        : `${API_URL}courses/?page_size=1000&is_active=true`
    );

    if (selectedCategory) {
      instructor || partnerNetwork
        ? setUrl((prevUrl) => prevUrl + `&categories=${selectedCategory}`)
        : setUrl(
            (prevUrl) =>
              prevUrl + `&category_slug=${selectedCategory.toLowerCase()}`
          );
    }

    if (orderingString) {
      setUrl((prevUrl) => prevUrl + `&ordering=${orderingString}`);
    }

    if (inYourSchool && !selectedSchool) {
      instructor || partnerNetwork
        ? setUrl((prevUrl) => prevUrl + `&schools=${studentSchool}`)
        : setUrl((prevUrl) => prevUrl + `&school=${studentSchool}`);
    }

    if (selectedSchool && !inYourSchool) {
      instructor || partnerNetwork
        ? setUrl((prevUrl) => prevUrl + `&schools=${selectedSchool.value}`)
        : setUrl((prevUrl) => prevUrl + `&school=${selectedSchool.value}`);
    }

    setFilterVisible(false);
  };

  const handleOrder = (type) => {
    const newFilters = [...ordering];
    if (newFilters.includes(`-${type}`)) {
      const index = newFilters.indexOf(`-${type}`);
      newFilters[index] = type;
      setOrdering(newFilters);
    } else if (newFilters.includes(type)) {
      const index = newFilters.indexOf(type);
      newFilters[index] = `-${type}`;
      setOrdering(newFilters);
    } else {
      newFilters.push(type);
      setOrdering(newFilters);
    }
  };

  useEffect(() => {
    getCategories();
    getSchoolData();
  }, []);

  useEffect(() => {
    getSearchResults();
  }, [searchTerm]);

  useEffect(() => {
    const stringFromOrdering = ordering.join(",");
    setOrderingString(stringFromOrdering);
  }, [ordering]);

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    setUrlWithFiltering(url);
  }, [url]);

  useEffect(() => {
    if (selectedSchool) {
      setInYourSchool(false);
    }
  }, [selectedSchool]);

  useEffect(() => {
    if (inYourSchool) {
      setSelectedSchool(false);
    }
  }, [inYourSchool]);

  return (
    <StyledView
      className={`${
        filterVisible ? "absolute" : "hidden"
      } bg-black/20 w-full h-full justify-end`}
    >
      <Animated.View entering={FadeInDown.duration(300)}>
        <StyledView className="h-[450px] bottom-0 bg-[#F8F8F8] w-full pb-6 pt-[48px] rounded-t-xl shadow-xl shadow-zinc-300">
          <StyledTouchableOpacity
            className="absolute right-2 top-3 z-50"
            onPress={() => {
              setFilterVisible(false);
            }}
          >
            <CrossIcon />
          </StyledTouchableOpacity>

          <StyledScrollView>
            <StyledView className="border-b border-zinc-200 mb-5 px-5">
              <StyledText className="text-[#414141] font-serrat-medium text-base mb-2">
                {t("attributes.registerChildSchool")}
              </StyledText>
              <Dropdown
                setSchoolPage={setSchoolPage}
                setSchoolData={setSchoolData}
                type="school"
                search={true}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleEndReached={handleEndReached}
                selectedOption={selectedSchool}
                setSelectedOption={setSelectedSchool}
                placeholder={t("attributes.chooseSchool")}
                data={searchTerm ? searchResults : schoolData}
              />
            </StyledView>

            <StyledView className="border-b border-zinc-200 mb-5 px-5">
              <StyledText className="text-[#414141] font-serrat-medium text-base">
                {t("attributes.category")}
              </StyledText>
              <StyledView className="w-full my-2 flex-row flex-wrap">
                {categories.map((category) => {
                  return (
                    <TouchableOpacity
                      key={category.name}
                      onPress={() => {
                        instructor || partnerNetwork
                          ? setSelectedCategory(category.id)
                          : setSelectedCategory(category.name);
                      }}
                    >
                      <StyledView
                        className={`w-fit mr-3 mb-3 p-2 shadow-sm shadow-zinc-300 rounded-lg ${
                          selectedCategory === category.name ||
                          selectedCategory === category.id
                            ? "bg-[#0079E9]"
                            : "bg-white"
                        }`}
                      >
                        <StyledText
                          className={
                            selectedCategory === category.name ||
                            selectedCategory === category.id
                              ? "text-white"
                              : "text-black"
                          }
                        >
                          {category.name}
                        </StyledText>
                      </StyledView>
                    </TouchableOpacity>
                  );
                })}
              </StyledView>
            </StyledView>

            <StyledText className="text-[#414141] font-serrat-medium text-base pl-5">
              {t("attributes.filterSortby")}
            </StyledText>
            <ScrollView
              horizontal={true}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            >
              <StyledView className="my-5 flex-row">
                <TouchableOpacity
                  onPress={() => {
                    handleOrder("rating");
                  }}
                >
                  <StyledView
                    className={`w-fit flex-row items-center mr-3 mb-3 p-2 shadow-sm shadow-zinc-300 rounded-lg ${
                      ordering.includes("rating") ||
                      ordering.includes("-rating")
                        ? "bg-[#0079E9]"
                        : "bg-white"
                    }`}
                  >
                    <StyledText
                      className={
                        ordering.includes("rating") ||
                        ordering.includes("-rating")
                          ? "text-white mr-3"
                          : "text-black"
                      }
                    >
                      {t("attributes.rating")}
                    </StyledText>
                    {ordering.includes("rating") ? (
                      <AscendWhiteIcon />
                    ) : ordering.includes("-rating") ? (
                      <DescendWhiteIcon />
                    ) : null}
                  </StyledView>
                </TouchableOpacity>

                {!instructor && !partnerNetwork && (
                  <TouchableOpacity
                    onPress={() => {
                      handleOrder("starting_price");
                    }}
                  >
                    <StyledView
                      className={`w-fit flex-row items-center mr-3 mb-3 p-2 shadow-sm shadow-zinc-300 rounded-lg ${
                        ordering.includes("starting_price") ||
                        ordering.includes("-starting_price")
                          ? "bg-[#0079E9]"
                          : "bg-white"
                      }`}
                    >
                      <StyledText
                        className={`${
                          ordering.includes("starting_price") ||
                          ordering.includes("-starting_price")
                            ? "text-white mr-3"
                            : "text-black"
                        }
              `}
                      >
                        {t("attributes.mainCheckoutPrice")}
                      </StyledText>
                      {ordering.includes("starting_price") ? (
                        <AscendWhiteIcon />
                      ) : ordering.includes("-starting_price") ? (
                        <DescendWhiteIcon />
                      ) : null}
                    </StyledView>
                  </TouchableOpacity>
                )}

                {!instructor && (
                  <TouchableOpacity
                    onPress={() => {
                      handleOrder(partnerNetwork ? "name" : "title");
                    }}
                  >
                    <StyledView
                      className={`w-fit mr-3 mb-3 p-2 shadow-sm shadow-zinc-300 rounded-lg ${
                        ordering.includes("title") ||
                        ordering.includes("-title") ||
                        ordering.includes("name") ||
                        ordering.includes("-name")
                          ? "bg-[#0079E9]"
                          : "bg-white"
                      }`}
                    >
                      <StyledText
                        className={
                          ordering.includes("title") ||
                          ordering.includes("-title") ||
                          ordering.includes("name") ||
                          ordering.includes("-name")
                            ? "text-white"
                            : "text-black"
                        }
                      >
                        {ordering.includes("-title") ||
                        ordering.includes("-name")
                          ? "Z-A"
                          : "A-Z"}
                      </StyledText>
                    </StyledView>
                  </TouchableOpacity>
                )}

                {studentSchool && (
                  <TouchableOpacity
                    onPress={() => {
                      setInYourSchool(true);
                    }}
                  >
                    <StyledView
                      className={`w-fit mr-3 mb-3 p-2 shadow-sm shadow-zinc-300 rounded-lg ${
                        inYourSchool === true ? "bg-[#0079E9]" : "bg-white"
                      }`}
                    >
                      <StyledText
                        className={
                          inYourSchool === true ? "text-white" : "text-black"
                        }
                      >
                        {t("attributes.filterInyourschool")}
                      </StyledText>
                    </StyledView>
                  </TouchableOpacity>
                )}
              </StyledView>
            </ScrollView>
          </StyledScrollView>

          <StyledView className="w-full px-5 pt-2 flex-row items-center justify-between">
            <StyledTouchableOpacity
              className="w-[39%] py-3 shadow-sm shadow-zinc-300 rounded-lg border bg-[#f6f6f6] border-red-600"
              onPress={() => {
                setFilteredData([]);
                setSelectedCategory("");
                setSelectedSchool(null);
                setInYourSchool(false);
                setOrdering([]);
                setOrderingString("");
                setUrlWithFiltering(
                  instructor
                    ? `${API_URL}instructors/?page_size=1000`
                    : partnerNetwork
                    ? `${API_URL}partner-networks/?page_size=1000`
                    : `${API_URL}courses/?page_size=1000&is_active=true`
                );
              }}
            >
              <StyledText className="text-black text-base text-center">
                {t("attributes.reset")}
              </StyledText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              className="w-[59%] py-3  shadow-sm shadow-zinc-300 rounded-lg bg-[#0079E9]"
              onPress={() => {
                handleFilterApply();
              }}
            >
              <StyledText className="text-white text-base text-center">
                {t("attributes.apply")}
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </Animated.View>
    </StyledView>
  );
};

export default FilterComponent;
