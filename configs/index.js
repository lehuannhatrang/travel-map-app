import {PRODUCTION_CONFIG} from "./config.production";
import {DEV_CONFIG} from "./config.dev";

let IndexConfig = ''
if(process.env.NODE_ENV === 'dev') {
    IndexConfig = PRODUCTION_CONFIG
} else {
    IndexConfig = DEV_CONFIG
}


export default IndexConfig;