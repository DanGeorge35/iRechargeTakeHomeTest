/* eslint-disable @typescript-eslint/no-extraneous-class */
import providers from '../../packages'
import { getOrSetCache } from '../../config/redis'
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

      return res.status(200).json({ success: true, data: dresult, code: 200 })
    } catch (err: any) {
      return res.status(500).json({ success: false, message: `SYSTEM ERROR : ${err.message}`, code: 500 })
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
        return res.status(200).json({ success: true, data: dresult, code: 200 })
      } else {
        return res.status(404).json({ success: false, message: 'Not Found', code: 404 })
      }
    } catch (error: any) {
      console.error(error)
      return res.status(400).json({ success: false, message: `SYSTEM ERROR : ${error.message}`, code: 400 })
    }
  }
}

export default ProvidersController
