import fetcher from "../fetcher";
import MessageList from "../components/MessageList";

const Home = ({ serverMessages, users }) => (
  <>
    <h1>Simple SNS</h1>
    <MessageList serverMessages={serverMessages} users={users} />
  </>
);

export const getServerSideProps = async () => {
  const serverMessages = await fetcher('get', '/messages');
  const users = await fetcher('get', '/users');

  return {
    props: {serverMessages, users}
  };
};

export default Home;
