import { authService } from "fbase";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const { useState } = require("react");

const Profile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="계정이름"
          value={newDisplayName}
        />
        <input type="submit" value="프로필 수정" />
      </form>
      <button onClick={onLogOutClick}>로그아웃</button>
    </>
  );
};

export default Profile;
