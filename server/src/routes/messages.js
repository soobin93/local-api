import { v4 } from "uuid";
import {readDB, writeDB} from "../dbController.js";

const getMessages = () => readDB('messages');
const setMessages = data => writeDB('messages', data);

const messagesRoute = [
  {
    // Get Messages
    method: 'get',
    route: '/messages',
    handler: ({ query: { cursor = '' }}, response) => {
      const messages = getMessages();
      const fromIndex = messages.findIndex(message => {
        let messageId = message.id;
        if (typeof message.id === 'number') messageId = `${message.id}`;

        return messageId === cursor;
      }) + 1
      response.send(messages.slice(fromIndex, fromIndex + 15));
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
        response.status(404).send({ error: error.message });
      }
    }
  },
  {
    // Create Messages
    method: 'post',
    route: '/messages',
    handler: ({ body, params, query }, response) => {
      try {
        if (!body.userId) throw Error('no userId is given');

        const messages = getMessages();

        const newMessage = {
          id: v4(),
          text: body.text,
          userId: body.userId,
          timestamp: Date.now()
        };

        messages.unshift(newMessage);
        setMessages(messages);

        response.send(newMessage);
      } catch (error) {
        response.status(500).send({ error: error.message });
      }
    }
  },
  {
    // Update Messages
    method: 'put',
    route: '/messages/:id',
    handler: ({ body, params: { id } }, response) => {
      try {
        const messages = getMessages();
        const targetIndex = messages.findIndex(message => {
          let messageId = message.id;
          if (typeof message.id === 'number') {
            messageId = `${message.id}`;
          }

          return messageId === id;
        });

        if (targetIndex < 0) throw '메시지가 없습니다.';
        if (messages[targetIndex].userId !== body.userId) throw '사용자가 다릅니다.'

        const newMessage = { ...messages[targetIndex], text: body.text };
        messages.splice(targetIndex, 1, newMessage);
        setMessages(messages);

        response.send(newMessage);
      } catch (error) {
        response.status(500).send({ error: error.message });
      }
    }
  },
  {
    // Delete Messages
    method: 'delete',
    route: '/messages/:id',
    handler: ({ body, params: { id }, query: { userId } }, response) => {
      try {
        const messages = getMessages();
        const targetIndex = messages.findIndex(message => {
          let messageId = message.id;
          if (typeof message.id === 'number') {
            messageId = `${message.id}`;
          }

          return messageId === id;
        });

        if (targetIndex < 0) throw '메시지가 없습니다.';
        if (messages[targetIndex].userId !== userId) throw '사용자가 다릅니다.'

        messages.splice(targetIndex, 1);
        setMessages(messages);

        response.send(id);
      } catch (error) {
        response.status(500).send({ error: error.message });
      }
    }
  }
];

export default messagesRoute;
