import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const RotatingSquare = ({
  angle,
  idx,
  rotationDurationMs,
}: {
  angle: number;
  idx: number;
  rotationDurationMs: number;
}) => {
  const [previousIdx, setPreviousIdx] = useState(idx);
  const rotate = useCallback(() => {
    rotation.value = withTiming(rotation.value + 360, {
      duration: rotationDurationMs,
      easing: Easing.linear,
    });
    setPreviousIdx(idx);
  }, []);

  useEffect(() => {
    if (idx !== previousIdx) {
      rotate();
    }
  }, [idx]);
  useEffect(() => {
    rotate();
  }, []);

  const rotation = useSharedValue(angle);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  return (
    <View className="relative">
      <Animated.View className="w-8 h-8 absolute" style={animatedStyle}>
        <View className="bg-gray-dark border-white border w-full h-full  flex flex-row justify-center items-center  rotate-45">
          <View className="bg-white w-2 h-2 absolute  top-0 left-0" />
        </View>
      </Animated.View>
      <View className="w-8 absolute h-8 flex justify-center items-center">
        <Text className="text-white text-xl  leading-none ">{idx}</Text>
      </View>
    </View>
  );
};

type PictureCounterProps = {
  currentPictureIndex: number;
  count: number;
  secondsToDisplayPhoto: number;
};
export const PictureCounter = ({
  currentPictureIndex,
  count,
  secondsToDisplayPhoto,
}: PictureCounterProps) => {
  //   const turn = (idx: number) => {
  //     rotation.value = withTiming(rotation.value + 360, {
  //       duration: 5000,
  //       easing: Easing.linear,
  //     });
  //   };

  return (
    <View className="w-12 h-12  flex justify-center items-center border-white absolute   ">
      <View className="absolute  flex justify-center items-center flex-row w-full ">
        <RotatingSquare
          rotationDurationMs={secondsToDisplayPhoto * 1000}
          angle={0}
          idx={count - currentPictureIndex}
        />
      </View>
    </View>
  );
};
