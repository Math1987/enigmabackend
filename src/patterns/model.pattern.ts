import { ValuesPatternsData } from "./../data/valuesPatterns.data";

export class ModelPattern {
  values: {} = {};

  constructor() {
    ValuesPatternsData.read(this.readKey(), (values) => {
      for (let row of values) {
        this.values[row["key_"]] = row["start"];
      }
      console.log(this.values);
    });
  }
  readKey() {
    return "";
  }
}
