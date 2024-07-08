import * as AppleAuthentication from "expo-apple-authentication";

export const AppleAuth = () => {
  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={5}
      //   style={styles.button}
      className=" p-4 rounded-lg  w-40 mb-4 "
      onPress={async () => {
        try {
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });
          console.log(credential);
          // signed in
        } catch (e) {
          //   if (ecode && e.code === "ERR_REQUEST_CANCELED") {
          // handle that the user canceled the sign-in flow
          //   } else {
          // handle other errors
          //   }
        }
      }}
    />
  );
};
