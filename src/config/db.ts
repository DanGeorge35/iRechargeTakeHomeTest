import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

const sequelize = new Sequelize(
  process.env.DB ?? '',
  process.env.DBUSER ?? '',
  process.env.DBPASS ?? '',
  {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  }
)

sequelize
  .authenticate()
  .then(() => { console.log('Connection has been established successfully.') })
  .catch((error) => { console.error('Unable to connect to the database:', error) })

export default sequelize
