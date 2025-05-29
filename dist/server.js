"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./config/data-source");
const app_1 = __importDefault(require("./app"));
const PORT = process.env.PORT || 3000;
// Initialize database connection and start server
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log('Database connection initialized');
    app_1.default.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error('Error during Data Source initialization:', error);
    process.exit(1);
});
