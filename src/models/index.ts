import { Packages } from './packages.model'
import { Provider } from './provider.model'

Provider.hasMany(Packages, {
  foreignKey: 'provider_id',
  as: 'packages'
})

Packages.belongsTo(Provider, {
  foreignKey: 'provider_id',
  as: 'provider'
})

export { Packages, Provider }
