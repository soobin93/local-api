import {useEffect, useState} from "react";
import MessageInput from "./MessageInput";
import MessageItem from "./MessageItem";

const UserIds = ['roy', 'jay'];
const getRandomUserId = () => UserIds[Math.round(Math.random())];

const originalMessages = Array(50).fill(0).map((_, i) => ({
  id: i + 1,
  userId: getRandomUserId(),
  timestamp: 1234567890123 + i * 1000 * 60,
  text: `${i + 1} mock text`
})).reverse();

const MessageList = () => {

  const [messages, setMessages] = useState(originalMessages);
  const [editingId, setEditingId] = useState(null);

  const onCreate = text => {
    const newMessage = {
      id: messages.length + 1,
      userId: getRandomUserId(),
      timestamp: Date.now(),
      text: `${messages.length + 1} ${text}`
    };

    setMessages(messages => ([newMessage, ...messages]));
  };

  const doneEdit = () => setEditingId(null);

  const onUpdate = (text, id) => {
    const targetIndex = messages.findIndex(message => message.id === id);

    setMessages(messages => {
      if (targetIndex < 0) {
        return messages;
      } else {
        const newMessages = [...messages];
        newMessages.splice(targetIndex, 1, {
          ...messages[targetIndex],
          text
        });
        return newMessages;
      }
    });

    doneEdit();
  };

  const onDelete = (id) => {
    const targetIndex = messages.findIndex(message => message.id === id);

    setMessages(messages => {
      if (targetIndex < 0) {
        return messages;
      } else {
        const newMessages = [...messages];
        newMessages.splice(targetIndex, 1);
        return newMessages;
      }
    });
  };

  return (
    <>
      <MessageInput mutate={onCreate} />
      <ul className="messages">{
        messages.map(x => (
          <MessageItem
            key={x.id}
            {...x}
            onUpdate={onUpdate}
            onDelete={() => onDelete(x.id)}
            startEdit={() => setEditingId(x.id)}
            isEditing={editingId === x.id}
          />
        ))
      }</ul>
    </>
  );
};

export default MessageList;
