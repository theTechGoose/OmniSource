import {CHARACTER_REPLACEMENTS} from '@settings';
import _ from 'npm:lodash';

export class CrmKey {
  readonly value = this.sanitize();
  constructor(private label: string) {}

  private sanitize() {
    const sanitizedLabel = this.label.replace(/[^a-zA-Z]/g, (match) => {
        return CHARACTER_REPLACEMENTS[match] ? ` ${CHARACTER_REPLACEMENTS[match]} ` : ' ';
    });

    const output = _.camelCase(sanitizedLabel);
    console.log(`Sanitized label: ${this.label} => ${output}`);
    return output;
  }
}
