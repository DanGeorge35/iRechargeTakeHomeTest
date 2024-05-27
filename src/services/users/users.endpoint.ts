import UsersController from './users.controller'
import { Authorization } from '../../libs/utils/app.utility'

const ENDPOINT_URL = '/users'

const UsersEndpoint = [
  {
    path: '/auth',
    method: 'post',
    handler: [UsersController.Login]
  },
  {
    path: `${ENDPOINT_URL}/`,
    method: 'post',
    handler: [UsersController.createUser]
  },
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [Authorization, UsersController.getallUsers]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'get',
    handler: [UsersController.getSingleUser]
  }

]

export default UsersEndpoint
