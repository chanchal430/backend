import * as dotenv from 'dotenv';

dotenv.config();

interface IConfig {
    port: string | number;
    database: {
        MONGODB_URI: string;
        MONGODB_DB_MAIN: string;
    };
    webAppUrl:string;
    botToken:string;
}

const NODE_ENV: string = process.env.NODE_ENV || 'development';

const development: IConfig = {
    port: process.env.PORT ||9000,
    database: {
        MONGODB_URI: process.env.MONGODB_URI || '',
        MONGODB_DB_MAIN: process.env.MONGODB_DB_MAIN || '',
    },
    webAppUrl:process.env.WEB_APP_URL||'',
    botToken:process.env.BOT_TOKEN||''

};

const production: IConfig = {
    port: process.env.PORT || 9000,
    database: {
        MONGODB_URI: process.env.MONGODB_URI || '',
        MONGODB_DB_MAIN: process.env.MONGODB_DB_MAIN || '',
    },
    webAppUrl:process.env.WEB_APP_URL||'',
    botToken:process.env.BOT_TOKEN||''
};

const test: IConfig = {
    port: process.env.PORT || 9000,
    database: {
        MONGODB_URI: process.env.MONGODB_URI || '',
        MONGODB_DB_MAIN: 'test_folk_db',
    },
    webAppUrl:process.env.WEB_APP_URL||'',
    botToken:process.env.BOT_TOKEN||''
};

const config: {
    [name: string]: IConfig
} = {
    test,
    development,
    production,
};

export default config[NODE_ENV];
