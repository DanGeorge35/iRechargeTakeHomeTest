import ProvidersController from './providers.controller'
import { Authorization } from '../../libs/utils/app.utility'

const ENDPOINT_URL = '/providers'

const ProvidersEndpoint = [
  {
    path: `${ENDPOINT_URL}/`,
    method: 'get',
    handler: [Authorization, ProvidersController.getallProviders]
  },
  {
    path: `${ENDPOINT_URL}/:slug/packages`,
    method: 'get',
    handler: [ProvidersController.getProviderPackages]
  }

]

export default ProvidersEndpoint
