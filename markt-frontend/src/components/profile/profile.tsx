import { useNavigate } from "react-router-dom";
import {
  GreetingText,
  UserInfo,
  ProfileDetailsHeading,
  ButtonContainer,
  Button,
} from "./profile.styles";
import { useSelector } from "react-redux";
import {
  RootState,
  selectors,
  setIsLoading,
  setIsLoggedIn,
  setUserDetails,
  setWishList,
} from "../../redux";
import { useDispatch } from "react-redux";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userName, userEmail, userPhone } = useSelector(
    (state: RootState) => ({
      userName: selectors.getName(state),
      userEmail: selectors.getEmail(state),
      userPhone: selectors.getPhone(state),
    })
  );

  const handleLogout = () => {
    dispatch(setIsLoading(true));
    dispatch(setIsLoggedIn(false));
    dispatch(setWishList([]));
    dispatch(
      setUserDetails({ userID: -1, name: "", email: "", phone: "", jwt: "" })
    );

    setTimeout(() => {
      dispatch(setIsLoading(false));
      navigate("/");
    }, 2000);
  };

  // //CHANGE PASSWORD FUNCTIONALITY NEEDS TO BE ADDED
  // const handleChangePassword = () => {};

  return (
    <div>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <GreetingText>Hello, {userName}</GreetingText>
        <ProfileDetailsHeading>Profile Details</ProfileDetailsHeading>
        <UserInfo>
          <b>UofT Email Address:</b> {userEmail}
        </UserInfo>
        <UserInfo>
          <b>UofT Student ID:</b> {userPhone}
        </UserInfo>

        <ButtonContainer>
          {/* <Button onClick={handleChangePassword} primaryColor>
            Change Password
          </Button> */}
          <Button onClick={handleLogout}>Logout</Button>
        </ButtonContainer>
      </div>
    </div>
  );
};

export { Profile };
