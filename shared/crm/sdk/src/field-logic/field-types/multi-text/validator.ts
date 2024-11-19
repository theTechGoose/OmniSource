  export function validator(value: Array<any>, field: any)  {
      const properties = field.properties
      const allowNewChoices = properties.allowNewChoices
      const allValuesAreStrings = value.every((val) => typeof val === 'string');
      if(allowNewChoices) return allValuesAreStrings
      const allowedChoices = properties.choices
      const allChoicesAreValid = value.every((val) => allowedChoices.includes(val));
      return allValuesAreStrings && allChoicesAreValid
    }
