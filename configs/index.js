import {PRODUCTION_CONFIG} from "./config.production";
import {DEV_CONFIG} from "./config.dev";

let IndexConfig = ''
console.log(process.env.NODE_ENV)
if(process.env.NODE_ENV === 'development') {
    IndexConfig = DEV_CONFIG
} else {
    IndexConfig = PRODUCTION_CONFIG
}


export default IndexConfig;