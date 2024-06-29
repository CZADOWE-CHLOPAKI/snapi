import { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
const Square = () => (
  <View className="bg-white rounded-full w-5 h-5  rotate-45" />
);

const SINGLE_PICTURE_SHOW_TIME_MS = 5000;
const RotatingSquare = ({
  angle,
  rotate,
}: {
  angle: number;
  rotate: boolean;
}) => {
  const [rotated, setRotated] = useState(false);
  useEffect(() => {
    if (rotate && !rotated) {
      rotation.value = withTiming(rotation.value + 360, {
        duration: SINGLE_PICTURE_SHOW_TIME_MS,
        easing: Easing.linear,
      });
      setRotated(true);
    }
  }, [rotate]);

  const rotation = useSharedValue(angle);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  return (
    <Animated.View className="w-8" style={animatedStyle}>
      <Square />
    </Animated.View>
  );
};

type PictureCounterProps = {
  currentPictureIndex: number;
  count: number;
};
export const PictureCounter = ({
  currentPictureIndex,
  count,
}: PictureCounterProps) => {
  //   const turn = (idx: number) => {
  //     rotation.value = withTiming(rotation.value + 360, {
  //       duration: 5000,
  //       easing: Easing.linear,
  //     });
  //   };

  return (
    <View className="w-12 h-12  flex justify-center items-center border-white absolute  rounded-full ">
      {[...Array(count)].map((_, idx) => (
        <View
          className="absolute top-0"
          key={idx}
          style={{ display: idx > currentPictureIndex ? "none" : "flex" }}
        >
          <RotatingSquare
            angle={45 * idx}
            rotate={currentPictureIndex === idx}
          />
        </View>
      ))}
    </View>
  );
};
