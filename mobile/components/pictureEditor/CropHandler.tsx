import { Dimensions, StyleSheet } from "react-native";

import React from "react";
import { View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

const useCropEdge = () => {
  const { width, height } = Dimensions.get("screen");

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value + 12 },
      { translateY: translationY.value + 12 },
    ],
  }));

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      const maxTranslateX = width / 2 - 10;
      const maxTranslateY = height / 2 - 10;

      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        -maxTranslateX,
        maxTranslateX
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY
      );
    })
    .runOnJS(true);

  // const [x, y] = [translationX.value, translationY.value];
  return {
    pan,
    animatedStyles,

    x: translationX,
    y: translationY,
  };
};

const useBindValues = (a: SharedValue<number>, b: SharedValue<number>) => {
  useAnimatedReaction(
    () => a,
    (currY, prevY) => {
      if (!prevY) return;
      b.value = currY.value;
    }
  );
  useAnimatedReaction(
    () => b,
    (currY, prevY) => {
      if (!prevY) return;
      a.value = currY.value;
    }
  );
};

export const CropHandler = () => {
  const { pan, animatedStyles, x: xTopRight, y: yTopRight } = useCropEdge();
  const {
    pan: pan2,
    animatedStyles: animatedStyles2,
    x: xTopLeft,
    y: yTopLeft,
  } = useCropEdge();
  const {
    pan: pan3,
    animatedStyles: animatedStyles3,
    x: xBottomRight,
    y: yBottomRight,
  } = useCropEdge();
  const {
    pan: pan4,
    animatedStyles: animatedStyles4,
    x: xBottomLeft,
    y: yBottomLeft,
  } = useCropEdge();
  useBindValues(yTopRight, yTopLeft);
  useBindValues(yBottomRight, yBottomLeft);
  useBindValues(xTopRight, xBottomRight);
  useBindValues(xTopLeft, xBottomLeft);
  useAnimatedReaction(
    () => [yTopRight, yTopLeft, yBottomRight, yBottomLeft],
    (_, curr) => {
      console.log(curr);
      if (yTopRight.value > yBottomRight.value) {
        yTopRight.value = yBottomRight.value;
      } else if (yBottomRight.value < yTopRight.value) {
        yBottomRight.value = yTopRight.value;
      }

      if (xTopLeft.value > xTopRight.value) {
        xTopLeft.value = xTopRight.value;
      }
    }
  );

  return (
    <GestureHandlerRootView style={styles.container} className="z-10 ">
      <View className="relative -translate-x-3 ">
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[animatedStyles]}
            className=" absolute top-0 left-0 w-6 h-6 bg-gray-dark/70 border-white m-2  border-t-2 border-r-2"
          />
        </GestureDetector>
        <GestureDetector gesture={pan2}>
          <Animated.View
            style={[animatedStyles2]}
            className=" top-0 right-0 absolute w-6 h-6 bg-gray-dark/70 border-white m-2  border-t-2 border-l-2"
          />
        </GestureDetector>

        <GestureDetector gesture={pan3}>
          <Animated.View
            style={[animatedStyles3]}
            className=" absolute bottom-0 left-0 w-6 h-6 bg-gray-dark/70 border-white m-2  border-b-2 border-r-2"
          />
        </GestureDetector>
        <GestureDetector gesture={pan4}>
          <Animated.View
            style={[animatedStyles4]}
            className=" bottom-0 right-0 absolute w-6 h-6 bg-gray-dark/70 border-white m-2  border-b-2 border-l-2"
          />
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
