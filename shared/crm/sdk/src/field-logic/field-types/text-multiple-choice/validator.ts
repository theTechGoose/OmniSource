export function validator(value: any, field: any)  {
      if(value === '') return true
      const valueIsString = typeof value === 'string'
      const properties = field.properties
      const allowNewChoices = properties.allowNewChoices
      if(allowNewChoices) return valueIsString
      const allowedChoices = properties.choices
      const choiceIsValid = allowedChoices.includes(value);
      return valueIsString && choiceIsValid
}
