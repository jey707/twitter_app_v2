const { dbService } = require("fbase");
const { addDoc, collection } = require("firebase/firestore");
const { useState } = require("react");

const TweetAdd = ({ userObj }) => {
  const [tweet, setTweet] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    const tweetObj = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    };
    const a = await addDoc(collection(dbService, "tweets"), tweetObj);
    console.log(a);
    setTweet("");
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setTweet(value);
  };
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={tweet}
        onChange={onChange}
        placeholder="트윗을 작성해 주세요!!"
        maxLength={120}
      />
      <input type="submit" value="Tweet" />
    </form>
  );
};

export default TweetAdd;
