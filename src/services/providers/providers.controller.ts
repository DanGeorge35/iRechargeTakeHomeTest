/* eslint-disable @typescript-eslint/no-extraneous-class */
import providers from '../../packages'
import * as Redis from 'redis'

class ProvidersController {
  static async getallProviders (req: any, res: any): Promise<any> {
    try {
      const providerslug = []

      const redisClient = Redis.createClient()

      redisClient.on('error', function (error) {
        console.error(error)
      })

      const dprovider = await redisClient.get('providers')
      if (dprovider === null) {
        for (let i = 0; i < providers.length; i++) {
          providerslug.push(providers[i].slug)
        }

        await redisClient.setEx('providers', 3000, JSON.stringify(providerslug))

        return res.status(200).json({ success: true, data: providerslug, code: 200 })
      } else {
        return res.status(200).json({ success: true, data: JSON.parse(dprovider), code: 200 })
      }
    } catch (err: any) {
      return res.status(500).json({ success: false, message: `SYSTEM ERROR : ${err.message}`, code: 500 })
    }
  }

  static async getProviderPackages (req: any, res: any): Promise<any> {
    try {
      const slug = req.params.slug
      const foundPackage = providers.find(provider => provider.slug === slug)
      if (foundPackage !== null) {
        return res.status(200).json({ success: true, data: foundPackage, code: 200 })
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
