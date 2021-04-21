import * as cheerio from 'cheerio';
import {
  JsonLinkedData,
  ParserFieldParams,
  ParserFieldsSchema,
  ParserResult,
  ParserResultSlug,
} from '../types';
import { extractJsonLinkedData } from './utils';

export class HarkeParsingError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'HarkeParsingError';

    // In Typescript we need to set the prototype explicitly (https://stackoverflow.com/a/41429145/5732518)
    Object.setPrototypeOf(this, HarkeParsingError.prototype);
  }
}

export default class Parser {
  slug: ParserResultSlug;
  $html: cheerio.Root;
  linkedData: JsonLinkedData;
  parsedFields: { [key: string]: any };
  fieldsWithoutResult: Array<{ field: string; message: string }>;

  constructor(
    slug: ParserResultSlug,
    html: string,
    schema: ParserFieldsSchema,
  ) {
    this.slug = slug;
    this.$html = cheerio.load(html);
    this.linkedData = extractJsonLinkedData(this.$html);
    this.parsedFields = {};
    this.fieldsWithoutResult = [];

    this.parse(schema);
  }

  parse(schema: any) {
    const fieldKeys = Object.keys(schema);

    if (!fieldKeys.length) return;

    for (let i = 0, l = fieldKeys.length; i < l; i++) {
      const fieldKey = fieldKeys[i];

      try {
        const params: ParserFieldParams = {
          $: this.$html,
          linkedData: this.linkedData,
        };
        this.parsedFields[fieldKey] = schema[fieldKey](params);
      } catch (error) {
        if (error instanceof HarkeParsingError) {
          // silently record parsing errors
          this.fieldsWithoutResult.push({
            field: fieldKey,
            message: error.message,
          });
        } else {
          // unknown error, rethrow it
          throw error;
        }
      }
    }
  }

  get result(): ParserResult {
    return {
      slug: this.slug,
      fields: this.parsedFields,
      errors: this.fieldsWithoutResult,
    };
  }
}
