/* eslint-disable @typescript-eslint/no-extraneous-class */
import providers from '../../packages'
import { getOrSetCache } from '../../config/redis'
import { type IResponse, createSuccessResponse, notFound, serverError, sendResponse } from '../../libs/helpers/response.helper'

const CACHE_EXPIRATION = 120

class ProvidersController {
  static async getallProviders (req: any, res: any): Promise<any> {
    try {
      const dresult = await getOrSetCache('providers', CACHE_EXPIRATION, () => {
        const providerslug = []
        for (let i = 0; i < providers.length; i++) {
          providerslug.push(providers[i].slug)
        }
        return providerslug
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

      const dresult = await getOrSetCache(slug, CACHE_EXPIRATION, () => {
        const foundPackage = providers.find(provider => provider.slug === slug)
        return foundPackage ?? null
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
