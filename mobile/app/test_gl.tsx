import { StyleSheet } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

export default function App() {
  const xValue = useSharedValue(true);
  const yValue = useSharedValue(true);
  const xPosition = useSharedValue(0);
  const yPosition = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      xPosition.value = e.absoluteX;
      yPosition.value = e.absoluteY;
    })
    .onEnd((e) => {});

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
