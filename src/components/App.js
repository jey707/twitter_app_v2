import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { authService } from "fbase";
import { updateProfile } from "@firebase/auth";
import profile from "img/baseProfile.jpg";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if (user) {
        if (user.displayName === null) {
          user.displayName = "User";
        }
        if (user.photoURL === null) {
          user.photoURL = profile;
        }
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
          // updateProfile
        });
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    if (user.photoURL === null) {
      user.photoURL = profile;
    }
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      photoURL: user.photoURL,
      updateProfile: (args) =>
        updateProfile(user, { displayName: user.displayName }),
    });
  };
  return (
    <>
      {init ? (
        <AppRouter
          isLoggedIn={isLoggedIn}
          refreshUser={refreshUser}
          userObj={userObj}
        />
      ) : (
        "Loading...."
      )}
    </>
  );
}

export default App;
