import { DataTypes, Model, type Optional } from 'sequelize'
import packages from '../packages'
import sequelize from '../config/db'

interface PackagesAttributes {
  id: number
  price: number
  code: string
  name: string
  provider_slug: string
  provider_id: number
}

interface PackagesCreationAttributes extends Optional<PackagesAttributes, 'id'> {}

class Packages extends Model<PackagesAttributes, PackagesCreationAttributes> implements PackagesAttributes {
  public id!: number
  public price!: number
  public code!: string
  public name!: string
  public provider_slug!: string
  public provider_id!: number
}

Packages.init(
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
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    provider_slug: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'packages',
    modelName: 'Packages',
    timestamps: true
  }
)

Packages.sync({ alter: true })
  .then(async () => {
    // Check if the table is empty
    const count = await Packages.count()

    if (count === 0) {
      // Prepare the data from the JSON files
      const packagesData = [
        ...packages.DSTV.items.map((item: any) => ({
          ...item,
          provider_id: 1,
          provider_slug: 'dstv'
        })),
        ...packages.GOTV.items.map((item: any) => ({
          ...item,
          provider_id: 2,
          provider_slug: 'gotv'
        })),
        ...packages.STARTIMES.items.map((item: any) => ({
          ...item,
          provider_id: 3,
          provider_slug: 'startimes'
        }))
      ]

      await Packages.bulkCreate(packagesData)
      console.log('Packages table created and seeded')
    } else {
      console.log('Packages table already seeded')
    }
  })
  .catch((err: Error) => {
    console.error('Error creating Packages table:', err)
  })

export { Packages, type PackagesCreationAttributes, type PackagesAttributes }
