import Tweet from "components/Tweet";
import { authService, dbService } from "fbase";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const { useState, useEffect } = require("react");

const Profile = ({ userObj, refreshUser }) => {
  console.log(userObj);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [myTweets, setMyTweets] = useState([]);
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
  const getMyTweets = async () => {
    const q = query(
      collection(dbService, "tweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const tweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyTweets(tweetArr);
    });
  };
  useEffect(() => {
    getMyTweets();
  }, []);
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
      <div>
        {myTweets.map((mytweet) => (
          <Tweet
            key={mytweet.id}
            tweetObj={mytweet}
            isOwner={mytweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </>
  );
};

export default Profile;
