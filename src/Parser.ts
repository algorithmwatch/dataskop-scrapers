import * as cheerio from 'cheerio'
import { ParserFieldsSchema, ParserResult } from './types'


export class HarkeParsingError extends Error {
	constructor(message?: string) {
		super(message)
		this.name = 'HarkeParsingError'

    // In Typescript we need to set the prototype explicitly (https://stackoverflow.com/a/41429145/5732518)
    Object.setPrototypeOf(this, HarkeParsingError.prototype);
	}
}

export default class Parser {
  slug: string
  $html: cheerio.Root
  parsedFields: { [key: string]: any }
  fieldsWithoutResult: string[]

  constructor(
    slug: string,
    html: string,
    schema: ParserFieldsSchema
  ) {
    this.slug = slug
    this.$html = cheerio.load(html)
    this.parsedFields = {}
    this.fieldsWithoutResult = []

    this.parse(schema)
  }

  parse (schema: ParserFieldsSchema) {
    const fieldKeys = Object.keys(schema)

    for (let i = 0, l = fieldKeys.length; i < l; i++) {
      const fieldKey = fieldKeys[i]

      try {
        const parseResult = schema[fieldKey](this.$html)

        // add parsing result
        this.parsedFields[fieldKey] = parseResult
      } catch (error) {
        if (error instanceof HarkeParsingError) {
          // silently record parsing errors
          this.fieldsWithoutResult.push(fieldKey)
        }else {
          // unknown error, rethrow it
          throw error;
        }
      }
    }
  }

  get result (): ParserResult {
    return {
      slug: this.slug,
      fields: this.parsedFields,
      errors: this.fieldsWithoutResult
    }
  }

}


// const parser = new Parser(
//   'test-slug',
//   '<p>hallo</p>',
//   {
//     id ($html: cheerio.Cheerio) {
//       throw new HarkeParsingError('hallo')
//     }
//   }
// )

// parser.result