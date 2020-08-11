import { localStorage } from './localstorage';
const LocalStorage = require("node-localstorage").LocalStorage ;
export const localStorage = new LocalStorage('./scratch');