import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const useSingleAnimatedClock = () => {
  const angle = useSharedValue(0);
  const config = {
    duration: 1000,
    // easing: Easing.bezier(0.5, 0.01, 0, 1),
  };
  const rotations = [0, 45, 90, 135, 180, 225, 270, 315, 360];

  const style = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: withTiming(`${angle.value}rad`, config) }],
    };
  });

  const run = () => {
    angle.value = Math.PI * 2;
  };

  const AnimatedClock = () => (
    <Animated.View
      className=" border-white rounded-full border h-20 w-20 flex flex-row justify-end items-center "
      style={style}
    >
      <View className="w-6 h-6 bg-white rotate-45" />
    </Animated.View>
  );

  return { AnimatedClock, run };
};
