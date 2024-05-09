import ProvidersEndpoint from './providers/providers.endpoint'
import UsersEndpoint from './users/users.endpoint'

export default [
  ...UsersEndpoint,
  ...ProvidersEndpoint
]
