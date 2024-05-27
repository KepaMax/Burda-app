import {Text, View, FlatList, TouchableOpacity, TextInput} from 'react-native';
import {useState} from 'react';
import {styled} from 'nativewind';
import Visa from '../../assets/icons/visa.svg';
import Master from '../../assets/icons/master.svg';
import AddIcon from '../../assets/icons/plusCircle.svg';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);

const Methods = () => {
  const [addNewCartOpen, setAddNewCartOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');

  const formatCardNumber = value => {
    // Remove any non-digit characters from the input
    const cleanedValue = value.replace(/\D/g, '');

    // Split the cleaned value into groups of four characters
    const groups = cleanedValue.match(/.{1,4}/g);

    // Join the groups with a space between them
    const formattedValue = groups ? groups.join(' ') : '';

    // Limit the formatted value to 16 characters
    const limitedValue = formattedValue.slice(0, 19);

    // Update the state with the formatted and limited value
    setCardNumber(limitedValue);
  };

  const formatExpirationDate = value => {
    // Remove any non-digit characters from the input
    const cleanedValue = value.replace(/\D/g, '');

    // Split the cleaned value into two parts: month and year
    const month = cleanedValue.slice(0, 2);
    const year = cleanedValue.slice(2, 4);

    // Format the expiration date as XX/XX
    const formattedValue = month && year ? `${month}/${year}` : value;

    // Update the state with the formatted value
    setExpirationDate(formattedValue);
  };

  const data = [
    {
      company: 'visa',
      cardNumber: '4169 7388 4899 1121',
      id: 1,
    },
    {
      company: 'mastercard',
      cardNumber: '4119 3378 5299 8135',
      id: 2,
    },
  ];

  const renderItem = ({item}) => {
    return (
      <StyledView className="flex-row items-center px-4 h-16 mb-4 mx-5 shadow shadow-zinc-300 bg-white rounded-md">
        {item.company === 'visa' ? <Visa /> : <Master />}
        <StyledText className="text-zinc-500 text-sm font-serrat-medium mx-5">
          ****
        </StyledText>
        <StyledText className="text-zinc-500 text-sm font-serrat-medium">
          {item.cardNumber.slice(-4)}
        </StyledText>
      </StyledView>
    );
  };

  return addNewCartOpen ? (
    <StyledView className="bg-white flex-1 px-5 justify-between mt-7">
      <StyledView>
        <StyledView className="w-full">
          <StyledText className="text-sm font-serrat-medium text-zinc-300">
            Card Number
          </StyledText>
          <StyledView className="shadow shadow-zinc-300 bg-white mt-2">
            <StyledTextInput
              value={cardNumber}
              onChangeText={formatCardNumber}
              keyboardType="numeric"
              maxLength={19}
              className="text-zinc-500 pl-2"
            />
          </StyledView>
        </StyledView>
        <StyledView className="w-full flex-row justify-between items-center mt-4">
          <StyledView className="w-[48%]">
            <StyledText className="text-sm font-serrat-medium text-zinc-300">
              Expiration Date
            </StyledText>
            <StyledView className="shadow shadow-zinc-300 bg-white mt-2">
              <StyledTextInput
                value={expirationDate}
                onChangeText={formatExpirationDate}
                keyboardType="numeric"
                maxLength={5}
                className="text-zinc-500 pl-2"
              />
            </StyledView>
          </StyledView>
          <StyledView className="w-[48%]">
            <StyledText className="text-sm font-serrat-medium text-zinc-300">
              CVV Code
            </StyledText>
            <StyledView className="shadow shadow-zinc-300 bg-white mt-2">
              <StyledTextInput
                keyboardType="numeric"
                maxLength={3}
                className="text-zinc-500 pl-2"
              />
            </StyledView>
          </StyledView>
        </StyledView>
        <StyledText className="text-sm text-zinc-500 font-serrat mt-10">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
          sint. Velit officia consequat duis enim velit mollit.{' '}
        </StyledText>
      </StyledView>
      {/* <TouchableOpacity>
        <StyledView className="bg-[#493EE3] items-center justify-center py-4 rounded-md">
          <StyledText className="text-base text-white font-serrat-medium">
            Add card
          </StyledText>
        </StyledView>
      </TouchableOpacity> */}
    </StyledView>
  ) : (
    <StyledView>
      <FlatList
        contentContainerStyle={{paddingTop: 25}}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      {/* <TouchableOpacity
        onPress={() => {
          setAddNewCartOpen(true);
        }}>
        <StyledView className="flex-row items-center mx-5 my-2">
          <AddIcon />
          <StyledText className="ml-3 font-serrat-medium text-base text-zinc-500">
            Add new card
          </StyledText>
        </StyledView>
      </TouchableOpacity> */}
    </StyledView>
  );
};

export default Methods;
