"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
// Load environment variables
(0, dotenv_1.config)();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'asset_manager_db',
    synchronize: false, // Set to false in production
    logging: process.env.NODE_ENV === 'development',
    entities: [path_1.default.join(__dirname, '..', 'entities', '*.{ts,js}')],
    migrations: [path_1.default.join(__dirname, '..', 'migrations', '*.{ts,js}')],
    subscribers: [],
});
