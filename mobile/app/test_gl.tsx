import { StyleSheet } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const END_POSITION_X = 200;
const END_POSITION_Y = 200;

export default function App() {
  const xValue = useSharedValue(true);
  const yValue = useSharedValue(true);
  const xPosition = useSharedValue(0);
  const yPosition = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (xValue.value) {
        xPosition.value = e.translationX;
      } else {
        xPosition.value = END_POSITION_X + e.translationX;
      }
      if (yValue.value) {
        yPosition.value = e.translationY;
      } else {
        yPosition.value = END_POSITION_Y + e.translationY;
      }
    })
    .onEnd((e) => {
      if (xPosition.value > END_POSITION_X / 2) {
        xPosition.value = withTiming(END_POSITION_X, { duration: 100 });
        xValue.value = false;
      } else {
        xPosition.value = withTiming(0, { duration: 100 });
        xValue.value = true;
      }
      if (yPosition.value > END_POSITION_Y / 2) {
        yPosition.value = withTiming(END_POSITION_Y, { duration: 100 });
        yValue.value = false;
      } else {
        yPosition.value = withTiming(0, { duration: 100 });
        yValue.value = true;
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: xPosition.value },
      { translateY: yPosition.value },
    ],
  }));

  return (
    <GestureHandlerRootView className="w-full h-full bg-error">
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.box, animatedStyle]} />
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 120,
    width: 120,
    backgroundColor: "#b58df1",
    borderRadius: 20,
    marginBottom: 30,
  },
});
