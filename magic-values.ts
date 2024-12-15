// This file stores all of the magic strings in the application that are shared between different apps
// If something is specific to a single app it will be housed in a single variable with the app name in camel case
// something should be in the global scope if it is used in multiple different apps we future proof this by using a function
// to fetch the magic value rather than importing the string directly
// example:
// const vault = {
//   const aiConfirmations = {
//   magicValue1: 'value1',
//   magicValue2: 'value2'
//   }
//   globalMagicValue: 'globalMagicValue'
// }
//
// The vault is your single source of truth
//
//
// Helper type to extract string keys from an object
//

const vault = {
  denomite: {
    variableNamingAlphabet: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    controllerPattern: '**/config.ts',
    defaultVersionName: 'DFLT',

  },
}



// BOILERPLATE DO NOT CHANGE FUNCTIONALITY BELOW THIS LINE, WILL INTRODUCE BREAKING CHANGES!! IF YOU MAKE CHANGES IT MUST ONLY AFFECT INTERNAL TYPES.
// BOILERPLATE DO NOT CHANGE FUNCTIONALITY BELOW THIS LINE, WILL INTRODUCE BREAKING CHANGES!! IF YOU MAKE CHANGES IT MUST ONLY AFFECT INTERNAL TYPES.
// BOILERPLATE DO NOT CHANGE FUNCTIONALITY BELOW THIS LINE, WILL INTRODUCE BREAKING CHANGES!! IF YOU MAKE CHANGES IT MUST ONLY AFFECT INTERNAL TYPES.
// BOILERPLATE DO NOT CHANGE FUNCTIONALITY BELOW THIS LINE, WILL INTRODUCE BREAKING CHANGES!! IF YOU MAKE CHANGES IT MUST ONLY AFFECT INTERNAL TYPES.
// BOILERPLATE DO NOT CHANGE FUNCTIONALITY BELOW THIS LINE, WILL INTRODUCE BREAKING CHANGES!! IF YOU MAKE CHANGES IT MUST ONLY AFFECT INTERNAL TYPES.
// BOILERPLATE DO NOT CHANGE FUNCTIONALITY BELOW THIS LINE, WILL INTRODUCE BREAKING CHANGES!! IF YOU MAKE CHANGES IT MUST ONLY AFFECT INTERNAL TYPES.
// BOILERPLATE DO NOT CHANGE FUNCTIONALITY BELOW THIS LINE, WILL INTRODUCE BREAKING CHANGES!! IF YOU MAKE CHANGES IT MUST ONLY AFFECT INTERNAL TYPES.
// =================================================================================================
// =================================================================================================
// =================================================================================================
// =================================================================================================
// =================================================================================================
// =================================================================================================
// =================================================================================================
// =================================================================================================
// =================================================================================================

  //@ts-ignore TODO: fix this type
function getValueByPath<T extends object>(obj: T, path: string): any {
  //@ts-ignore TODO: remove this ts-ignore
  const found = path.split('.').reduce((acc, key) => acc[key], obj);
  if(found) return found
  const last = path.split('.').pop();
  if(!last) return null
  //@ts-ignore TODO: remove this ts-ignore
  return obj[last] ?? null;
}

type NestedKeys<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? K | `${K}.${NestedKeys<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

class MagicStrings<T extends object> {
  constructor(private vault: T) {}

  //@ts-ignore TODO: fix this type
  resolve<K extends NestedKeys<T>>(key: K): any {
    return getValueByPath(this.vault, key);
  }
}

const out = new MagicStrings<typeof vault>(vault);
export default out.resolve.bind(out) as typeof out.resolve;

