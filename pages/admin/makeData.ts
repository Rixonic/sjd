import { faker } from '@faker-js/faker'

export type Person = {
  location: any;
  _id: string;
  equip: string;
  equipmentId: string;
  model: string;
  brand: string;
  sector: string;
  locations: string;
  headquarter: 'CASTELAR'|'RAMOS MEJIA'

  ecri: string;
  serialNumber: string;

  associatedEquip?:Person[];
}



const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = (): Person => {
  return {
    location: faker.name.firstName(),
    _id: faker.name.firstName(),
    equip: faker.name.firstName(),
    equipmentId: faker.name.lastName(),
    model: faker.name.firstName(),
    brand: faker.name.lastName(),
    sector: faker.name.firstName(),
    locations: faker.name.firstName(),
    headquarter: faker.helpers.shuffle<Person['headquarter']>([
      'CASTELAR',
      'RAMOS MEJIA',
    ])[0]!,
    serialNumber: faker.name.lastName(),
    ecri: faker.name.firstName(),
  }
}

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Person[] => {
    const len = lens[depth]!
    return range(len).map((d): Person => {
      return {
        ...newPerson(),
        associatedEquip: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}
