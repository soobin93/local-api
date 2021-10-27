import { v4 } from "uuid";
import {readDB, writeDB} from "../dbController.js";

const getMessages = () => readDB('messages');
const setMessages = data => writeDB('messages', data);

const messagesRoute = [
  {
    // Get Messages
    method: 'get',
    route: '/messages',
    handler: (request, response) => {
      const messages = getMessages();
      response.send(messages);
    }
  },
  {
    // Get Message
    method: 'get',
    route: '/messages/:id',
    handler: ({ params: { id } }, response) => {
      try {
        const messages = getMessages();
        const message = messages.find(m => m.id === parseInt(id));

        if (!message) throw Error('not found');

        response.send(message);
      } catch (error) {
        response.status(404).send({ error });
      }
    }
  },
  {
    // Create Messages
    method: 'post',
    route: '/messages',
    handler: ({ body, params, query }, response) => {
      const messages = getMessages();
      const newMessage = {
        id: v4(),
        text: body.text,
        userId: body.userId,
        timestamp: Date.now()
      };
      messages.unShift(newMessage);
      setMessages(messages);

      response.send(newMessage);
    }
  },
  {
    // Update Messages
    method: 'put',
    route: '/messages/:id',
    handler: ({ body, params: { id } }, response) => {
      try {
        const messages = getMessages();
        const targetIndex = messages.findIndex(message => message.id === id);
        if (targetIndex < 0) throw '메시지가 없습니다.';
        if (messages[targetIndex].userId !== body.userId) throw '사용자가 다릅니다.'

        const newMessage = { ...messages[targetIndex], text: body.text };
        messages.splice(targetIndex, 1, newMessage);
        setMessages(messages);

        response.send(newMessage);
      } catch (error) {
        response.status(500).send({ error });
      }
    }
  },
  {
    // Delete Messages
    method: 'delete',
    route: '/messages/:id',
    handler: ({ body, params: { id } }, response) => {
      try {
        const messages = getMessages();
        const targetIndex = messages.findIndex(message => message.id === id);
        if (targetIndex < 0) throw '메시지가 없습니다.';
        if (messages[targetIndex].userId !== body.userId) throw '사용자가 다릅니다.'

        messages.splice(targetIndex, 1);
        setMessages(messages);

        response.send(id);
      } catch (error) {
        response.status(500).send({ error });
      }
    }
  }
];

export default messagesRoute;
