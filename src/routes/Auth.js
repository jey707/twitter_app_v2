import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import AuthForm from "../components/AuthForm";
import { authService, dbService } from "../fbase";

const Auth = () => {
  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    // console.log("provider", provider);
    const data = await signInWithPopup(authService, provider);
    // console.log("social", data);

    const socialData = {
      imageURL: data.user.photoURL,
      userId: data.user.uid,
    };
    const q = query(
      collection(dbService, "userProfile"),
      where("userId", "==", data.user.uid)
    );
    onSnapshot(q, (snapshot) => {
      const profileExist = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (profileExist.length == 0) {
        console.log("user add");
        addDoc(collection(dbService, "userProfile"), socialData);
      } else {
        console.log("already user");
      }
    });
  };
  return (
    <div>
      <AuthForm />
      <div>
        <button onClick={onSocialClick} name="google">
          Google로그인
        </button>
        <button onClick={onSocialClick} name="github">
          Github로그인
        </button>
      </div>
    </div>
  );
};

export default Auth;
