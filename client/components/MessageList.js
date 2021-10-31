import {useEffect, useState, useRef} from "react";
import { useRouter } from "next/router";
import MessageInput from "./MessageInput";
import MessageItem from "./MessageItem";
import fetcher from "../fetcher";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const MessageList = ({ serverMessages }) => {

  const { query: { userId = '' } } = useRouter();
  const [messages, setMessages] = useState(serverMessages);
  const [editingId, setEditingId] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

  const onCreate = async text => {
    const newMessage = await fetcher('post', '/messages', { text, userId });
    if (!newMessage) throw Error('Something went wrong');

    setMessages(messages => ([newMessage, ...messages]));
  };

  const doneEdit = () => setEditingId(null);

  const onUpdate = async (text, id) => {
    const newMessage = await fetcher('put', `/messages/${id}`, { text, userId });
    if (!newMessage) throw Error('Something went wrong');

    const targetIndex = messages.findIndex(message => message.id === id);

    setMessages(messages => {
      if (targetIndex < 0) {
        return messages;
      } else {
        const newMessages = [...messages];
        newMessages.splice(targetIndex, 1, newMessage);
        return newMessages;
      }
    });

    doneEdit();
  };

  const onDelete = async (id) => {

    const receivedId = await fetcher('delete', `/messages/${id}`, { params: { userId } });

    setMessages(messages => {
      const targetIndex = messages.findIndex(message => message.id === receivedId);
      if (targetIndex < 0) {
        return messages;
      } else {
        const newMessages = [...messages];
        newMessages.splice(targetIndex, 1);
        return newMessages;
      }
    });
  };

  const getMessages = async () => {
    const newMessages = await fetcher('get', '/messages', { params: { cursor: messages[messages.length - 1]?.id || '' }});
    if (newMessages.length === 0) {
      setHasNext(false);
      return;
    }
    setMessages(messages => [...messages, ...newMessages]);
  };

  useEffect(() => {
    if (intersecting && hasNext) getMessages();
  }, [intersecting]);

  return (
    <>
      { userId && <MessageInput mutate={onCreate} /> }
      <ul className="messages">{
        messages.map(message => (
          <MessageItem
            key={message.id}
            {...message}
            onUpdate={onUpdate}
            onDelete={() => onDelete(message.id)}
            startEdit={() => setEditingId(message.id)}
            isEditing={editingId === message.id}
            myId={userId}
          />
        ))
      }</ul>
      <div ref={fetchMoreEl} />
    </>
  );
};

export default MessageList;
