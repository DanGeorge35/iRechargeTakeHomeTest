import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()
const {
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_HOST
} = process.env

// Set up Sequelize connection
const sequelize = new Sequelize(DB_NAME ?? '', DB_USER ?? '', DB_PASS ?? '', {
  host: DB_HOST,
  dialect: 'postgres',
  port: 5432,
  timezone: '+01:00'
})

sequelize
  .authenticate()
  .then(() => { console.log('Connection has been established successfully.') })
  .catch((error: any) => {
    console.error('Unable to connect to the database:', error)
  })

export default sequelize
