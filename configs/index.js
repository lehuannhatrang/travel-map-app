import {PRODUCTION_CONFIG} from "./config.production";
import {DEV_CONFIG} from "./config.dev";

let IndexConfig = ''
if(process.env.NODE_ENV === 'dev') {
    IndexConfig = DEV_CONFIG
} else {
    IndexConfig = PRODUCTION_CONFIG
}


export default IndexConfig;