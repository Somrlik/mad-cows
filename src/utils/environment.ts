import dotenv from 'dotenv';
import fs from 'fs';

if (fs.existsSync('.env')) {
    dotenv.config({
        path: '.env',
    });
} else {
    console.log('Using .env.example file to supply config environment variables');
    dotenv.config({
        path: '.env.example',
    });
}

export const DEV = 'dev';
export const PROD = 'production';
export const TEST = 'test';

export const ENVIRONMENT = process.env.NODE_ENV || DEV;

export const SQLITE_URL =
    'sqlite://' + process.env.SQLITE_STORAGE_PATH ||
    'sqlite://' + __dirname + '/../../data/' + ENVIRONMENT + '.sqlite';

export const LOG_FILE =
    process.env.LOG_FILE ||
    __dirname + '/../../' + 'log/' + ENVIRONMENT + '.log';
