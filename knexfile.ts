import * as Path from 'path';
import * as DotEnv from 'dotenv';
import { Config } from './src/config';

DotEnv.config({ path: Path.join(__dirname, '.env') });
module.exports = Config.database;
