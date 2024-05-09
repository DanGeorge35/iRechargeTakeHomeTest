import { DataTypes, Model, type Optional } from 'sequelize'

import sequelize from '../config/db'

interface UserAttributes {
  id: number
  name: string
  email: string
  password: string
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number
  public name!: string
  public email!: string
  public password!: string
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false

    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true
  }
)

User.sync({ alter: true })
  .then(() => {})
  .catch((err: Error) => {
    console.error('Error creating User table:', err)
  })

export { User, type UserCreationAttributes, type UserAttributes }
