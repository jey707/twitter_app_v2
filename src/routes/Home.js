import TweetAdd from "components/TweetAdd";

const Home = ({ userObj }) => {
  return (
    <div>
      <TweetAdd userObj={userObj} />
    </div>
  );
};

export default Home;
