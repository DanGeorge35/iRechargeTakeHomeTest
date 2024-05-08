/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-explicit-any */

import Joi from 'joi'
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_+=])[a-zA-Z\d!@#$%^&*()-_+=]{6,}$/

const userCreateSchema = Joi.object({
  name: Joi.string().required().min(1),
  email: Joi.string().email().required().min(1),
  password: Joi.string().required().min(6).pattern(passwordRegex)
    .message('Password must be at least 6 characters and include at least one uppercase letter, one lowercase letter, one digit, and one special character')
})

const userUpdateSchema = Joi.object({
  name: Joi.string().required().min(1)
})

const userPasswordChangeSchema = Joi.object({
  password: Joi.string().required().min(6).pattern(passwordRegex)
    .message('Password must be at least 6 characters and include at least one uppercase letter, one lowercase letter, one digit, and one special character')
})

function checkValidation (error: any, value: null): {
  result: string
  message: any
} {
  if (error != null) {
    error.details[0].message = error.details[0].message.replace(/\\|"|\\/g, '')
    return { result: 'error', message: error.details[0].message }
  }
  return { result: 'success', message: value }
}

class UsersValidation {
  static async validateCreateUsers (data: any): Promise<any> {
    const { error, value } = userCreateSchema.validate(data)
    return checkValidation(error, value)
  }

  static async validateUpdateUsers (data: any): Promise<any> {
    const { error, value } = userUpdateSchema.validate(data)
    return checkValidation(error, value)
  }

  static async validateUserPassword (data: any): Promise<any> {
    const { error, value } = userPasswordChangeSchema.validate(data)
    return checkValidation(error, value)
  }
}

export default UsersValidation
