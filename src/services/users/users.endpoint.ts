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
    path: `${ENDPOINT_URL}/:id`,
    method: 'patch',
    handler: [Authorization, UsersController.updateUser]
  },
  {
    path: `${ENDPOINT_URL}/changepassword`,
    method: 'put',
    handler: [Authorization, UsersController.changePassword]
  },
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [UsersController.getallUsers]
  },
  {
    path: `${ENDPOINT_URL}/:id`,
    method: 'get',
    handler: [UsersController.getSingleUser]
  }

]

export default UsersEndpoint
