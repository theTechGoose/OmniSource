import {extractLoadedClasses} from './mod.ts'
import {$} from './export.ts'


class Apple {
  slice() {
    return 'sliced'
  }
}
class Banana {
  peel() {
    return 'peeled'
  }
}

class Orange {
  peel() {
    return 'peeled'
  }
}


function makeFruitSalad(fruit1: Apple = $(Apple), fruit2 = $(Banana), fruit3 = $(Orange)) {
  return fruit1.slice() + ' ' + fruit2.peel() + ' ' + fruit3.peel()
}

function makeSaladWithNoFruit() {}


Deno.test('extractLoadedClasses', () => {
  const classes = extractLoadedClasses(makeFruitSalad)
  console.log(classes)
})

Deno.test('extractLoadedClasses', () => {
  const classes = extractLoadedClasses(makeSaladWithNoFruit)
  console.log(classes)
})

