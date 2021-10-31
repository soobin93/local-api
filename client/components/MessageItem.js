import MessageInput from "./MessageInput";

const MessageItem = ({
  id,
  userId,
  timestamp,
  text,
  onUpdate,
  isEditing,
  startEdit,
  onDelete,
  myId,
  user
}) => (
  <li className="messages__item">
    <h3>
      { user && user['nickname'] }{' '}
      <sub>
        {new Date(timestamp).toLocaleString('ko-KR', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })}
      </sub>
    </h3>

    {isEditing ? (
        <>
          <MessageInput mutate={onUpdate} id={id} text={text} />
        </>
      ) : text}

    {
      myId === userId && (
        <div className="messages__buttons">
          <button onClick={startEdit}>수정</button>
          <button onClick={onDelete}>삭제</button>
        </div>
      )
    }
  </li>
);

export default MessageItem;
