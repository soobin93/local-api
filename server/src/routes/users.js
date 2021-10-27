import { readDB } from "../dbController.js";

const getUsers = () => readDB('users');

const usersRoute = [
  {
    // Get Users
    method: 'get',
    route: '/users',
    handler: (request, response) => {
      const users = getUsers();
      response.send(users);
    }
  },
  {
    // Get User
    method: 'get',
    route: '/users/:id',
    handler: ({ params: { id } }, response) => {
      try {
        const users = getUsers();
        const user = users[id];

        if (!user) throw Error('사용자가 없습니다.');

        response.send(user);
      } catch (error) {
        response.status(500).send({ error });
      }
    }
  }
];

export default usersRoute;
