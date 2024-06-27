import { useFetcher } from "./useFetcher";

type MyProfile = {
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  full_name: string;
  tag: string;
  id: number;
};

export const useMyProfile = () => {
  const { data: myProfile, isLoading: isMyProfileLoading } =
    useFetcher<MyProfile>("/users/me/", "GET");
  return { myProfile, isMyProfileLoading };
};
