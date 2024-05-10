import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()
let {
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_HOST
} = process.env

if (DB_NAME == null) {
  DB_NAME = ''
}
if (DB_USER == null) {
  DB_USER = ''
}
if (DB_PASS == null) {
  DB_PASS = ''
}
if (DB_HOST == null) {
  DB_HOST = ''
}

// Set up Sequelize connection
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: 'postgres',
  port: 5432,
  timezone: '+01:00'
})

sequelize
  .authenticate()
  .then(() => { console.log('Connection has been established successfully.') })
  .catch((error: any) => {
    console.log('DB_NAME : ', DB_NAME)
    console.log('DB_USER : ', DB_USER)
    console.log('DB_PASS : ', DB_PASS)
    console.error('Unable to connect to the database:', error)
  })

export default sequelize
