/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Packages, Provider } from '../../models/'
import { type ProviderAttributes } from '../../models/provider.model'

import { getOrSetCache } from '../../config/redis'
import { type IResponse, createSuccessResponse, notFound, serverError, sendResponse } from '../../libs/helpers/response.helper'

const CACHE_EXPIRATION = 120

class ProvidersController {
  static async getallProviders (req: any, res: any): Promise<any> {
    try {
      const dresult = await getOrSetCache('providers', CACHE_EXPIRATION, async () => {
        const allProviders: ProviderAttributes[] = await Provider.findAll()
        return allProviders
      })
      const successResponse: IResponse = createSuccessResponse(dresult)
      sendResponse(res, successResponse)
    } catch (err: any) {
      sendResponse(res, serverError(err.message))
    }
  }

  static async getProviderPackages (req: any, res: any): Promise<any> {
    try {
      const slug = req.params.slug
      const dresult = await getOrSetCache(`${slug}/packages`, CACHE_EXPIRATION, async () => {
        const singlePackages = await Packages.findAll({ where: { provider_slug: slug } })
        return singlePackages
      })

      if (dresult !== null) {
        const successResponse: IResponse = createSuccessResponse(dresult)
        sendResponse(res, successResponse)
      } else {
        sendResponse(res, notFound())
      }
    } catch (error: any) {
      console.error(error)
      sendResponse(res, serverError(error.message))
    }
  }
}

export default ProvidersController
