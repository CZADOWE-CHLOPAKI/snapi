import Toast from "react-native-root-toast";

// Add a Toast on screen.

export const showToast = (message: string, type: "good" | "bad") => {
  Toast.show(message, {
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
  });
};
