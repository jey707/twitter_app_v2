import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Tweet = ({ tweetObj, isOwner }) => {
  const tweetTextRef = doc(dbService, "tweets", `${tweetObj.id}`);
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  // 삭제하려는 이미지 파일 ref생성
  const desertRef = ref(storageService, tweetObj.attachmentUrl);
  const onDelete = async () => {
    const ok = window.confirm("해당 트윗을 삭제하시겠습니까?");
    if (ok) {
      await deleteDoc(tweetTextRef);
      if (tweetObj.attachmentUrl !== "") {
        await deleteObject(desertRef);
      }
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(tweetTextRef, {
      text: newTweet,
    });
    setEditing(false);
  };
  const onChange = (e) => setNewTweet(e.target.value);

  return (
    <div key={tweetObj.id}>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  onChange={onChange}
                  placeholder="트윗을 작성해주세요!!"
                  value={newTweet}
                  required
                />
                <input type="submit" value="트윗업데이트" />
                <button onClick={toggleEditing}>Cancel</button>
              </form>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{tweetObj.text}</h4>
          {tweetObj.attachmentUrl && (
            <img
              src={tweetObj.attachmentUrl}
              alt="트윗 첨부이미지"
              width="100px"
              height="100px"
            />
          )}
          {isOwner && (
            <>
              <button onClick={toggleEditing}>트윗수정</button>
              <button onClick={onDelete}>트윗삭제</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
