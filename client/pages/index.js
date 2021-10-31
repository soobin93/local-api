import fetcher from "../fetcher";
import MessageList from "../components/MessageList";

const Home = ({ serverMessages }) => (
  <>
    <h1>Simple SNS</h1>
    <MessageList serverMessages={serverMessages} />
  </>
);

export const getServerSideProps = async () => {
  const serverMessages = await fetcher('get', '/messages');

  return {
    props: {serverMessages}
  };
};

export default Home;
