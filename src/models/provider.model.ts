import { DataTypes, Model, type Optional } from 'sequelize'
import sequelize from '../config/db'

interface ProviderAttributes {
  id: number
  name: string
  slug: string
}

interface ProviderCreationAttributes extends Optional<ProviderAttributes, 'id'> {}

class Provider extends Model<ProviderAttributes, ProviderCreationAttributes> implements ProviderAttributes {
  public id!: number
  public name!: string
  public slug!: string
}

Provider.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'provider',
    modelName: 'Provider',
    timestamps: true
  }
)

Provider.sync({ alter: true })
  .then(async () => {
    const count = await Provider.count()

    if (count === 0) {
      const providers = [
        {
          name: 'GOTV',
          slug: 'gotv'
        },
        {
          name: 'DSTV',
          slug: 'dstv'
        }, {
          name: 'STARTIMES',
          slug: 'startimes'
        }
      ]
      await Provider.bulkCreate(providers)
      console.log('Providers table created and seeded')
    } else {
      console.log('Providers table already seeded')
    }
  })
  .catch((err: Error) => {
    console.error('Error creating Provider table:', err)
  })

export { Provider, type ProviderCreationAttributes, type ProviderAttributes }
