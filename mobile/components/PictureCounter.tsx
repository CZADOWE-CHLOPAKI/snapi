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
    <Animated.View className="w-8" style={animatedStyle}>
      <View className="bg-white w-5 h-5  flex flex-row justify-center items-center  rotate-45">
        <Text
          className="ml-1 mt-0.5 -rotate-45"
          style={{ lineHeight: 18, fontSize: 18 }}
        >
          {idx}
        </Text>
      </View>
    </Animated.View>
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
      <View
        className="absolute  top-0 left-0 flex justify-center items-center flex-row w-full "
        // key={idx}
        // style={{ display: idx > currentPictureIndex ? "none" : "flex" }}
      >
        <RotatingSquare
          rotationDurationMs={secondsToDisplayPhoto * 1000}
          angle={0}
          idx={count - currentPictureIndex}
        />
      </View>
      {/* <View className="absolute flex justify-center items-center flex-row top-0 left-0 w-full "> */}
      {/* <Text className="pr-2 pt-0.5" style={{ lineHeight: 18, fontSize: 18 }}>
          1
        </Text> */}
      {/* </View> */}
    </View>
  );
};
