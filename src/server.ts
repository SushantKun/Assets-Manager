import { AppDataSource } from './config/data-source';
import app from './app';

const PORT = process.env.PORT || 3000;

// Initialize database connection and start server
AppDataSource.initialize()
    .then(() => {
        console.log('Database connection initialized');
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error during Data Source initialization:', error);
        process.exit(1);
    }); 