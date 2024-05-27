import {Animated} from 'react-native';
import React, {useState, useEffect} from 'react';

const PulseAnimation = ({placeholder}) => {
  const [animation] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 0.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [animation]);

  return (
    <Animated.View
      style={{
        opacity: animation,
      }}>
      {placeholder}
    </Animated.View>
  );
};

export default PulseAnimation;
