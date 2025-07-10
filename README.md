# Todo Backend API

A simple todo application backend built with Node.js, TypeScript, and MongoDB.

## Features

- Create, read, update, and delete todos
- Mark todos as completed or pending
- Filter todos by completion status
- RESTful API endpoints
- **OpenAPI 3.0 specification** with automatic validation
- **Interactive API Documentation** with Swagger UI
- **Request/Response validation** using express-openapi-validator
- TypeScript for type safety
- **MongoDB persistence** with native MongoDB driver
- **Repository pattern** for data access layer
- Unit tests with Vitest and ts-mockito
- Integration tests with MongoDB Memory Server
- Docker support for development and production
- ESLint for code quality

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- MongoDB (for local development) or Docker

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Database Setup

### Option 1: Using Docker (Recommended)

Start MongoDB using Docker Compose:
```bash
npm run db:setup
```

This will start a MongoDB instance on `localhost:27017` with no authentication (suitable for development).

### Option 2: Local MongoDB Installation

1. Install MongoDB locally
2. Start MongoDB service
3. Create a `.env` file (copy from `.env.example`)
4. Update the MongoDB connection string if needed

### Environment Variables

Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

Available environment variables:
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3000)
- `MONGO_URI`: Complete MongoDB connection string including database name

#### MongoDB URI Examples:
```bash
# Local development (no authentication)
MONGO_URI=mongodb://localhost:27017/todoapp

# Production with authentication
MONGO_URI=mongodb://username:password@hostname:27017/todoapp?authSource=admin

# MongoDB Atlas (cloud)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp?retryWrites=true&w=majority
```

## Development

### Local Development (Recommended)

Start MongoDB in Docker and run the application in watch mode on your host:
```bash
npm run dev:local
```

This command will:
1. Start MongoDB container (`npm run db:start`)
2. Run the application in watch mode with hot reloading (`npm run dev`)

### Manual Development Setup

If you prefer to start services separately:
```bash
# Start only MongoDB
npm run db:start

# In another terminal, start the app in watch mode
npm run dev
```

### Using Docker for Full Stack

Start the entire application stack with Docker:
```bash
# For production
npm run docker:up
```

The server will start on `http://localhost:3000`

**Available URLs:**
- API Base: `http://localhost:3000/api/todos`
- Health Check: `http://localhost:3000/health`
- **Swagger UI**: `http://localhost:3000/api-docs`

## Build

Build the project:
```bash
npm run build
```

## Production

Start the production server:
```bash
npm start
```

## Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

Run only unit tests:
```bash
npx vitest run src/services/
```

Run only integration tests:
```bash
npx vitest run src/tests/
```

### Test Types

- **Unit Tests**: Test individual service methods in isolation using ts-mockito for mocking dependencies
- **Integration Tests**: Test the complete API using MongoDB Memory Server for isolated database testing
  - Full CRUD operations testing
  - OpenAPI validation testing
  - Error handling scenarios
  - CORS header verification
  - Database interaction testing

### Unit Testing with ts-mockito

Unit tests use `ts-mockito` to mock repository dependencies, ensuring true isolation:

```typescript
import { instance, mock, when, verify } from 'ts-mockito';
import { TodoService } from './todoService';
import { ITodoRepository } from '../repositories/todoRepository';

// Mock the repository
const mockRepository = mock<ITodoRepository>();
const repositoryInstance = instance(mockRepository);
const todoService = new TodoService(repositoryInstance);
```

### Integration Testing with MongoDB Memory Server

Integration tests use `mongodb-memory-server` to create an isolated MongoDB instance for each test run:

- Automatic MongoDB instance creation and cleanup
- Fresh database for each test
- No external database dependencies
- Full application stack testing

## Docker Support

The application uses a simplified Docker setup optimized for local development:

### Local Development (Recommended)
For local development, only MongoDB runs in a container while the application runs outside in watch mode:

```bash
# Start MongoDB and run app in watch mode
npm run dev:local

# Or step by step:
npm run db:start    # Start only MongoDB container
npm run dev         # Run app in watch mode (outside container)
```

### Production Deployment
For production, the entire application stack runs in containers:

```bash
# Build and start production environment
npm run docker:up

# Or step by step:
npm run build                         # Build TypeScript
docker-compose --profile production up -d  # Start containers
```

### Key Features

- **Local Development**: Only MongoDB in container, app runs outside with hot reloading
- **Single Directory Mapping**: Production mode maps entire project directory
- **Persistent Data**: MongoDB data persisted in Docker volume
- **Fast Development**: No container rebuilds needed for code changes

### Available Docker Scripts

```bash
npm run dev:local       # Start MongoDB + run app in watch mode (recommended)
npm run db:start        # Start only MongoDB container
npm run db:stop         # Stop MongoDB container
npm run docker:up       # Production mode with full containerization
npm run docker:down     # Stop all containers
npm run docker:logs     # View container logs
npm run docker:build    # Build production Docker image
```

### Local Development Benefits

- ✅ **Fast Startup**: No container building for app
- ✅ **Hot Reloading**: Instant code changes with ts-node-dev
- ✅ **Easy Debugging**: Run directly on host with full IDE support
- ✅ **Minimal Containers**: Only MongoDB in Docker
- ✅ **Persistent Data**: Database data survives container restarts

## API Endpoints

### Base URL: `http://localhost:3000/api/todos`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all todos |
| GET | `/:id` | Get a specific todo by ID |
| POST | `/` | Create a new todo |
| PUT | `/:id` | Update a todo |
| DELETE | `/:id` | Delete a todo |
| GET | `/completed` | Get all completed todos |
| GET | `/pending` | Get all pending todos |

### Health Check

- GET `/health` - Returns server status

### API Documentation

- GET `/api-docs` - Interactive Swagger UI documentation

## OpenAPI Validation

The API uses **express-openapi-validator** for automatic request and response validation based on the OpenAPI 3.0 specification defined in `openapi.json`.

### Features

- **Automatic Request Validation**: All incoming requests are validated against the OpenAPI schema
- **Response Validation**: Outgoing responses are validated to ensure consistency
- **Type Coercion**: Automatically converts request parameters to the correct types
- **Schema Enforcement**: Enforces required fields, data types, string lengths, and format validation
- **UUID Validation**: Path parameters with UUID format are automatically validated

### Validation Rules

- **Title**: Required, 1-255 characters
- **Description**: Optional, maximum 1000 characters
- **ID Parameters**: Must be valid UUID format
- **Completed**: Boolean values only

### Error Response Format

When validation fails, the API returns a structured error response:

```json
{
  "message": "request.body.title is required",
  "errors": [
    {
      "path": ".title",
      "message": "is required",
      "errorCode": "required.openapi.validation"
    }
  ]
}
```

### OpenAPI Specification

The complete OpenAPI specification is available in `openapi.json` at the project root. This file defines:

- All API endpoints and their parameters
- Request/response schemas
- Validation rules and constraints
- Error response formats

## Interactive API Documentation

The project includes **Swagger UI** for interactive API documentation and testing:

- **URL**: `http://localhost:3000/api-docs`
- **Features**:
  - Interactive API explorer
  - Try out API endpoints directly from the browser
  - Real-time request/response examples
  - Schema validation visualization
  - Downloadable OpenAPI specification

### Using Swagger UI

1. Start the development server: `npm run dev`
2. Open your browser and navigate to `http://localhost:3000/api-docs`
3. Explore the available endpoints
4. Click "Try it out" on any endpoint to test it directly
5. View request/response schemas and validation rules

The Swagger UI is automatically generated from the OpenAPI specification and provides:
- Complete endpoint documentation
- Request/response examples
- Parameter descriptions and validation rules
- Interactive testing capabilities

### Request/Response Examples

#### Create a Todo
```bash
POST /api/todos
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Buy milk, bread, and eggs"
}
```

Response:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Buy groceries",
  "description": "Buy milk, bread, and eggs",
  "completed": false,
  "createdAt": "2025-07-08T10:00:00.000Z",
  "updatedAt": "2025-07-08T10:00:00.000Z"
}
```

#### Update a Todo
```bash
PUT /api/todos/123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json

{
  "completed": true
}
```

#### Get All Todos
```bash
GET /api/todos
```

Response:
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Buy groceries",
    "description": "Buy milk, bread, and eggs",
    "completed": true,
    "createdAt": "2025-07-08T10:00:00.000Z",
    "updatedAt": "2025-07-08T10:05:00.000Z"
  }
]
```

## Project Structure

```
src/
├── config/             # Configuration files
│   └── database.ts     # MongoDB connection and configuration
├── controllers/        # Request handlers
│   └── todoController.ts
├── repositories/       # Data access layer
│   └── todoRepository.ts
├── services/          # Business logic
│   ├── todoService.ts
│   └── todoService.test.ts
├── routes/            # API routes
│   └── todoRoutes.ts
├── types/             # TypeScript type definitions
│   └── todo.ts
├── tests/             # Integration tests
│   └── integration.test.ts
├── app.ts             # Express application setup
└── index.ts           # Application entry point

# Docker files
├── Dockerfile         # Production container
├── Dockerfile.dev     # Development container
├── docker-compose.yml # Container orchestration
├── mongo-init.js      # MongoDB initialization script
├── .dockerignore      # Docker ignore patterns
└── .env.example       # Environment variables template
```

## Architecture

The application follows a layered architecture pattern:

### Repository Pattern
- **TodoRepository**: Handles all MongoDB operations using the native MongoDB driver
- **ITodoRepository**: Interface for dependency injection and testing
- Direct MongoDB queries without ORM overhead

### Service Layer
- **TodoService**: Contains business logic and orchestrates repository operations
- Dependency injection for testability
- Clean separation of concerns

### Controller Layer
- **TodoController**: Handles HTTP requests and responses
- Input validation through OpenAPI middleware
- Error handling and status code management

### Database Layer
- **Database**: Singleton MongoDB connection manager
- Automatic connection handling and cleanup
- Environment-based configuration

## Database Schema

### Todo Collection

```typescript
interface TodoDocument {
  _id?: ObjectId;          // MongoDB internal ID
  id: string;              // Application UUID
  title: string;           // Todo title (required, 1-255 chars)
  description?: string;    // Optional description (max 1000 chars)
  completed: boolean;      // Completion status
  createdAt: Date;         // Creation timestamp
  updatedAt: Date;         // Last update timestamp
}
```

### Indexes

The MongoDB collection includes the following indexes for optimal performance:
- `id`: Unique index on application ID field
- `completed`: Index for filtering by completion status
- `createdAt`: Descending index for sorting by creation date

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## CORS

CORS is enabled for all origins to support frontend development.

## Future Enhancements

- Add authentication and authorization
- Add pagination for large todo lists
- Add todo categories/tags
- Add due dates and reminders
- Add API rate limiting
- Add request validation middleware
- Add logging middleware
- Add data migration scripts
- Add database backup strategies
- Add monitoring and health checks
- Add API versioning
