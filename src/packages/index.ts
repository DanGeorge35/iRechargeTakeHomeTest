import * as dstv from './dstv.json'
import * as gotv from './gotv.json'
import * as startimes from './startimes.json'

interface PackageType {
  price: number
  code: string
  name: string
}

interface ProviderType {
  name: string
  slug: string
  items: PackageType[]
}

function ProviderSlug (identifier: string, name: string): string {
  return identifier + name.toLowerCase()
}

const DSTV: ProviderType = { name: 'DSTV', slug: ProviderSlug('1', 'DSTV'), items: dstv.items }
const GOTV: ProviderType = { name: 'GOTV', slug: ProviderSlug('2', 'GOTV'), items: gotv.items }
const STARTIMES: ProviderType = { name: 'STARTIMES', slug: ProviderSlug('3', 'STARTIMES'), items: startimes.items }

export default [DSTV, GOTV, STARTIMES]
