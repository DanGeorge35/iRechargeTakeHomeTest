/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dotenv from 'dotenv'
import { EncryptPassword, GenerateToken, CheckPassword } from '../../libs/utils/app.utility'
import { User } from '../../models/user.model'
import UsersValidation from './users.validation'

dotenv.config()

class UserController {
  /**
 * Create User
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async createUser (req: any, res: any): Promise<any> {
    try {
      const data = req.body
      const validate = await UsersValidation.validateCreateUsers(data)
      if (validate.result === 'error') {
        const result: { code: number, message: string } = {
          code: 400,
          message: validate.message
        }
        return res.status(result.code).json({ ...result, success: false })
      }

      const checkExist = await User.findOne({ where: { email: data.email } })
      if (checkExist !== null) {
        return res.status(400).json({
          success: false,
          message: 'Email Already Exist',
          code: 400
        })
      }
      // generate data.usercode from user max id
      const result: number = await User.max('id')

      const lastId = result || 0
      data.usercode = Math.floor(lastId + 1000)

      data.password = await EncryptPassword(data.password)
      const user = await User.create(data)

      return res.status(201).json({ success: true, message: 'Successfully Created', data: user })
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
        code: 400
      })
    }
  }

  static async Login (req: any, res: any): Promise<any> {
    try {
      const { email, password } = req.body

      if ((email === '') || (password === '')) {
        const result: any = { code: 400, message: 'Email and password is required' }
        return res.status(result.code).json(result)
      }

      const user: any = await User.findOne({ where: { email } })

      if (user === null) {
        const result: any = {
          success: false,
          message: 'Email Address Not Found!',
          code: 400
        }
        return res.status(result.code).json(result)
      }
      // compare passwords ------------------------------
      const isValidPassword = await CheckPassword(password, user.password)
      if (!isValidPassword) {
        const result: any = {
          success: false,
          message: 'Incorret Password!',
          code: 400
        }
        return res.status(result.code).json(result)
      }

      const token = GenerateToken(user)
      return res.status(201).json({ success: true, code: 201, data: user, token })
    } catch (error: any) {
      const result: any = {
        success: false,
        message: 'Error login in: ' + error.message,
        code: 400
      }
      return res.status(result.code).json(result)
    }
  }

  static async getSingleUser (req: any, res: any): Promise<any> {
    try {
      const { id } = req.params

      const singleUser = await User.findOne({ where: { id } })

      if (!singleUser) {
        return res.status(400).json({ success: false, data: `No User with the id ${req.params.id}` })
      }

      return res.status(201).json({ success: true, data: singleUser })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).json(err)
    }
  }

  /**
 * Get All User
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<any>} A Promise that resolves to the response.
 */
  static async getallUsers (req: any, res: any): Promise<any> {
    const PAGE_SIZE = 10

    try {
      let page: number = 1

      if (req.query.page && typeof req.query.page === 'string') {
        page = parseInt(req.query.page, 10)
      }

      const allUser = await User.findAndCountAll({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE
      })

      const totalPages = Math.ceil(allUser.count / PAGE_SIZE)

      return res.status(201).json({
        success: true,
        data: allUser.rows,
        pagination: {
          currentPage: page,
          totalPages,
          pageSize: PAGE_SIZE
        }
      })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).json(err)
    }
  }

  static async reservedEvent (req: any, res: any): Promise<any> {
    try {
      const userId = req.params.id
      const updatedInfo = req.body

      const validate = await UsersValidation.validateUpdateUsers(updatedInfo)
      if (validate.result === 'error') {
        const result: { code: number, message: string } = {
          code: 400,
          message: validate.message
        }
        return res.status(result.code).json({ ...result, success: false })
      }

      const user = await User.findByPk(userId)

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' })
      }

      const duser = await user.update(updatedInfo)

      return res.status(201).json({ success: true, data: duser, message: 'User information updated' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).json(err)
    }
  }

  static async updateUser (req: any, res: any): Promise<any> {
    try {
      const userId = req.params.id
      const updatedInfo = req.body

      const validate = await UsersValidation.validateUpdateUsers(updatedInfo)
      if (validate.result === 'error') {
        const result: { code: number, message: string } = {
          code: 400,
          message: validate.message
        }
        return res.status(result.code).json({ ...result, success: false })
      }

      const user = await User.findByPk(userId)

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' })
      }

      const duser = await user.update(updatedInfo)

      return res.status(201).json({ success: true, data: duser, message: 'User information updated' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).json(err)
    }
  }

  static async changePassword (req: any, res: any): Promise<any> {
    try {
      const loginUser = req.user
      const { oldPassword, newPassword } = req.body
      const user = await User.findByPk(loginUser.id)
      const validate = await UsersValidation.validateUserPassword(newPassword)
      if (validate.result === 'error') {
        const result: { code: number, message: string } = {
          code: 400,
          message: validate.message
        }
        return res.status(result.code).json({ ...result, success: false })
      }

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' })
      }
      const isValidPassword = await CheckPassword(oldPassword, user.password)
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Incorret Password!',
          code: 400
        }
      }
      const newPasswordHash = await EncryptPassword(newPassword)
      const duser = await user.update({ password: newPasswordHash })
      return res.status(201).json({ success: true, data: duser, message: 'Password Updated Successfully' })
    } catch (error: any) {
      const err = { success: false, code: 400, message: `SYSTEM ERROR : ${error.message}` }
      console.error(error)
      return res.status(400).json(err)
    }
  }
}

export default UserController
