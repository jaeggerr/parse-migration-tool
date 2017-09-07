interface ParseField {
  type: string
}

interface ParseFields {
  [key: string]: {
    type: string
  }
}

export default interface ParseSchema {
  className: string
  fields: ParseFields
}
