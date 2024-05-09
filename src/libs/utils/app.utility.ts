import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

function Authorization (req: any, res: any, next: any): any {
  // eslint-disable-next-line no-unused-vars
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]
  if (token == null) {
    return res.status(401).json({
      success: false,
      message: 'Not Authorised',
      code: 401
    })
  }

  // eslint-disable-next-line consistent-return
  const JWT_KEY: any = process.env.jwtkey
  jwt.verify(token, JWT_KEY, (err: any, user: any) => {
    if (err !== null) {
      return res.status(403).json({
        success: false,
        message: 'Invalid Token',
        code: 403
      })
    }
    req.user = user
    next()
  })
}

function GenerateToken (data: any): string {
  const JWT_SECRET: any = process.env.jwtkey
  return jwt.sign({ data }, JWT_SECRET, { expiresIn: '1d' })
}

async function CheckPassword (password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

async function EncryptPassword (password: string): Promise<string> {
  try {
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds)
  } catch (error) {
    console.error('Error encrypting password:', error)
    return password
  }
}

export {
  Authorization,
  GenerateToken,
  EncryptPassword,
  CheckPassword
}
