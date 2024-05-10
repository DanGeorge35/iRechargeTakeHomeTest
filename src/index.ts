import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import endpoints from './services/'
import RouteHelper from './libs/helpers/route.helper'

const app = express()
dotenv.config()

// MiddleWare
const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true // Enable cookies or other credentials
}
app.use(helmet()) // Security first middleware
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors(corsOptions))
// MiddleWare

try {
  RouteHelper.initRoutes(endpoints, app)
} catch (error) {
  console.error(error)
}

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server is running on  http://localhost:${port}`)
})
