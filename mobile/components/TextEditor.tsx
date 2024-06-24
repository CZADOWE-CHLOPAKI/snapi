import Draggable from "@ngenux/react-native-draggable-view";
import { useRef, useState } from "react";
import { TextInput, View } from "react-native";

type TextEditorProps = {
  onChange: (text: string) => void;
};
export const TextEditor = ({ onChange }: TextEditorProps) => {
  const [textValue, setTextValue] = useState("???");
  const draggableRef = useRef<Draggable>();

  return (
    <View
      className="absolute  top-0 left-0 w-full  h-full flex justify-between   z-20  "
      pointerEvents="box-none"
    >
      <View className="relative  top-1/3 flex flex-row justify-center    w-screen transform">
        <Draggable
          edgeSpacing={0}
          childrenWidth={150}
          childrenHeight={100}
          shouldStartDrag={true}
          initialOffsetX={0}
          initialOffsetY={0}
          orientation="landscape"
          width={360}
          height={750}
          ref={(ref) => draggableRef?.current && (draggableRef.current = ref)}
        >
          <View
            style={{
              width: 150,
              height: 100,

              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TextInput
              className=" bg-gray-light text-white bg-transparent "
              style={{
                fontSize: 40,
              }}
              onChangeText={(text) => setTextValue(text)}
              value={textValue}
              placeholder=""
              onEndEditing={() => onChange(textValue)}
            />
          </View>
        </Draggable>
      </View>
    </View>
  );
};
