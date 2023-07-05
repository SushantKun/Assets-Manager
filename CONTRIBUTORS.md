# Contributors

This project was developed collaboratively by a team of three developers, each focusing on different aspects of the application while maintaining code quality and integration.

## Team Members and Contributions

### Sushant Dahal

**Role**: Authentication & Core Infrastructure Lead

- Set up initial project structure for both frontend and backend
- Implemented JWT-based authentication system
- Created user registration and login endpoints
- Developed authentication service in Angular
- Set up MySQL database and TypeORM configuration
- Managed project documentation and README
- Implemented core security features

**Key Files**:

- asset-manager-api/src/controllers/auth.controller.ts
- asset-manager-client/src/app/core/services/auth.service.ts
- asset-manager-api/src/entities/user.entity.ts
- Database configuration and security setup

### Ram Sapkota

**Role**: Backend Development Lead

- Developed asset upload functionality
- Implemented file storage system using Multer
- Created asset CRUD operations in backend
- Developed category and tag management
- Implemented search and filter functionality
- Set up file validation and security
- Created asset download functionality

**Key Files**:

- asset-manager-api/src/controllers/asset.controller.ts
- asset-manager-api/src/entities/asset.entity.ts
- asset-manager-api/src/middleware/upload.middleware.ts
- asset-manager-api/src/routes/asset.routes.ts

### Ayush Shrestha

**Role**: Frontend Development Lead

- Designed and implemented the Angular Material UI
- Created responsive asset management interface
- Developed asset upload component
- Implemented asset listing and grid views
- Created asset details and edit forms
- Developed search and filter components
- Implemented real-time updates

**Key Files**:

- asset-manager-client/src/app/features/assets/\*
- asset-manager-client/src/app/core/services/asset.service.ts
- asset-manager-client/src/app/shared/components/\*
- asset-manager-client/src/app/features/dashboard/\*

## Collaboration Methodology

The team used Git for version control and followed a feature-branch workflow. Each team member was responsible for their designated components while ensuring seamless integration with other parts of the application. Regular code reviews and team meetings were conducted to maintain code quality and ensure consistent development practices.
