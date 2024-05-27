import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useEffect} from 'react';

const SearchProxy = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    isFocused
      ? navigation.navigate('SearchBar', {
          screen: 'SearchBarPage',
        })
      : null;
  }, [isFocused]);
};

export default SearchProxy;
