import {
  ComposedGesture,
  GestureDetector,
  GestureType,
} from "react-native-gesture-handler";
type GestureDetectorSwitchProps = {
  gesture: ComposedGesture | GestureType;
  enabled: boolean;
  children?: React.ReactNode;
};

export const GestureDetectorSwitch = ({
  gesture,
  enabled,
  children,
}: GestureDetectorSwitchProps) => {
  if (!enabled) return <>{children}</>;
  return <GestureDetector gesture={gesture}>{children}</GestureDetector>;
};
