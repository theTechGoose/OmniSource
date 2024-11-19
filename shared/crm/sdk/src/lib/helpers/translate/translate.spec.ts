import { translateForRead, translateForWrite } from './translate';


function createTestTable() {
  return {
    all: {
      'field_1': {
        id: 1,
      },

      'field_2': {
        id: 2,
      },

      'field_3': {
        id: 3,
      },
    },
    read: {

      'field_1': {
        id: 1,
      },

      'field_2': {
        id: 2,
      },

      'field_3': {
        id: 3,
      },

    },
    write: {

      'field_1': {
        id: 1,
      },

      'field_2': {
        id: 2,
      },

      'field_3': {
        id: 3,
      },
    },
    label: 'test',
  } as any;
}


function createTestRead() {
  return {
    data: {
      1: {
        value: 'one',
      },
      2: {
        value: 'two',
      },
      3: {
        value: 'three',
    }
  }
} as any;
}

function createTestWrite() {
  return {
    'field_1': 'one',
    'field_2': 'two',
    'field_3': 'three',
  } as any
}

describe('translate', () => {
  it('should translate a read', () => {
    const testTable = createTestTable();
    const testRead = createTestRead();
    const output = translateForRead(testRead,testTable);
    console.log({output})
  })

  it('should translate a write', () => {
    const testTable = createTestTable();
    const testWrite = createTestWrite();
    const output = translateForWrite(testWrite,testTable);
    console.log({output})
  })
})
