/* eslint-disable @typescript-eslint/no-extraneous-class */
import dotenv from 'dotenv'
import { EncryptPassword, GenerateToken, CheckPassword } from '../../libs/utils/app.utility'
import { User } from '../../models/user.model'
import UsersValidation from './users.validation'
import { getOrSetCache } from '../../config/redis'
import { type IResponse, createSuccessResponse, createErrorResponse, serverError, sendResponse } from '../../libs/helpers/response.helper'
const CACHE_EXPIRATION = 120

dotenv.config()

class UserController {
  static async createUser (req: any, res: any): Promise<any> {
    try {
      const data = req.body
      const validate = await UsersValidation.validateCreateUsers(data)
      if (validate.result === 'error') {
        const resp = createErrorResponse(400, validate.message)()
        sendResponse(res, resp)
        return res.end()
      }

      const checkExist = await User.findOne({ where: { email: data.email } })
      if (checkExist !== null) {
        const resp = createErrorResponse(400, 'Email Already Exist')()
        sendResponse(res, resp)
        return res.end()
      }
      // generate data.usercode from user max id
      const result: number = await User.max('id')

      const lastId = result ?? 0
      data.usercode = Math.floor(lastId + 1000)

      data.password = await EncryptPassword(data.password)
      const user = await User.create(data)

      const successResponse: IResponse = createSuccessResponse(user)
      sendResponse(res, successResponse)
      return res.end()
    } catch (error: any) {
      sendResponse(res, serverError(error.message))
    }
  }

  static async Login (req: any, res: any): Promise<any> {
    try {
      const { email, password } = req.body

      if ((email === '') || (password === '')) {
        const resp = createErrorResponse(400, 'Email and password is required')()
        sendResponse(res, resp)
        return res.end()
      }

      const user: any = await User.findOne({ where: { email } })

      if (user === null) {
        const resp = createErrorResponse(400, 'Email Address Not Found!')()
        sendResponse(res, resp)
        return res.end()
      }
      // compare passwords ------------------------------
      const isValidPassword = await CheckPassword(password, user.password)
      if (!isValidPassword) {
        const resp = createErrorResponse(400, 'Incorrect Password!')()
        sendResponse(res, resp)
        return res.end()
      }

      const token = GenerateToken(user)

      const successResponse: IResponse = createSuccessResponse(user, 201)
      successResponse.token = token
      sendResponse(res, successResponse)
      return res.end()
    } catch (error: any) {
      sendResponse(res, serverError('LOGIN ERROR : ' + error.message))
    }
  }

  static async getSingleUser (req: any, res: any): Promise<any> {
    try {
      const { id } = req.params

      const dresult = await getOrSetCache(`users/${id}`, CACHE_EXPIRATION, async () => {
        const singleUser = await User.findOne({ where: { id } })
        return singleUser
      })

      if (dresult == null) {
        const resp = createErrorResponse(400, `No User with the id ${req.params.id}`)()
        sendResponse(res, resp)
        return res.end()
      }

      const successResponse: IResponse = createSuccessResponse(dresult)
      sendResponse(res, successResponse)
      return res.end()
    } catch (error: any) {
      sendResponse(res, serverError(error.message))
    }
  }

  static async getallUsers (req: any, res: any): Promise<any> {
    const PAGE_SIZE = 10

    try {
      let page: number = 1
      const requestQuery: string = req.query.page ?? null
      if ((requestQuery !== null) && (typeof requestQuery === 'string')) {
        page = parseInt(requestQuery, 10)
      }
      const dresult = await getOrSetCache(`users?${requestQuery}`, CACHE_EXPIRATION, async () => {
        const allUser = await User.findAndCountAll({
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE
        })
        return allUser
      })

      const totalPages = Math.ceil(dresult.count / PAGE_SIZE)

      const successResponse: IResponse = createSuccessResponse(dresult)
      successResponse.pagination = {
        currentPage: page,
        totalPages,
        pageSize: PAGE_SIZE
      }
      sendResponse(res, successResponse)
      return res.end()
    } catch (error: any) {
      sendResponse(res, serverError(error.message))
    }
  }

  static async updateUser (req: any, res: any): Promise<any> {
    try {
      const userId = req.params.id
      const updatedInfo = req.body

      const validate = await UsersValidation.validateUpdateUsers(updatedInfo)
      if (validate.result === 'error') {
        const resp = createErrorResponse(400, validate.message)()
        sendResponse(res, resp)
        return res.end()
      }

      const user = await User.findByPk(userId)

      if (user == null) {
        const resp = createErrorResponse(404, 'User not found')()
        sendResponse(res, resp)
        return res.end()
      }

      const duser = await user.update(updatedInfo)

      const successResponse: IResponse = createSuccessResponse(duser, 201, 'User information updated')
      sendResponse(res, successResponse)
      return res.end()
    } catch (error: any) {
      sendResponse(res, serverError(error.message))
    }
  }

  static async changePassword (req: any, res: any): Promise<any> {
    try {
      const loginUser = req.user
      const { oldPassword, newPassword } = req.body
      const user = await User.findByPk(loginUser.data.id)
      if (user == null) {
        const resp = createErrorResponse(404, 'User not found')()
        sendResponse(res, resp)
        return res.end()
      }

      const validate = await UsersValidation.validateUserPassword({ password: newPassword })
      if (validate.result === 'error') {
        const resp = createErrorResponse(400, validate.message)()
        sendResponse(res, resp)
        return res.end()
      }

      const isValidPassword = await CheckPassword(oldPassword, user.password)
      if (!isValidPassword) {
        const resp = createErrorResponse(400, 'Incorret Password!')()
        sendResponse(res, resp)
        return res.end()
      }
      const newPasswordHash = await EncryptPassword(newPassword)
      const duser = await user.update({ password: newPasswordHash })
      const successResponse: IResponse = createSuccessResponse(duser, 201, 'Password updated successfully')
      sendResponse(res, successResponse)
      return res.end()
    } catch (error: any) {
      sendResponse(res, serverError(error.message))
    }
  }
}

export default UserController
