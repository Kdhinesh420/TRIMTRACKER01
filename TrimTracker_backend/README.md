# Express.js Boilerplate Project

A clean and organized Express.js project structure following best practices for scalability and maintainability.

## Table of Contents

- [Setting up Express in NodeJS environment](#setting-up-express-in-nodejs-environment)
  - [Dotenv for storing environmental variables](#dotenv-for-storing-environmental-variables)
- [MongoDB setup for NodeJS](#mongodb-setup-for-nodejs)
- [Project Overview](#project-overview)
- [Folder Structure](#folder-structure)
  - [File Descriptions](#file-descriptions)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Architecture Pattern](#architecture-pattern)
- [API Endpoints](#api-endpoints)
- [Dependencies](#dependencies)
- [Joi Validation for Payload](#joi-validation-for-payload)
  - [Installation](#joi-installation)
  - [Payload Validation Requirements](#payload-validation-requirements)
- [Best Practices](#best-practices)

---

## Setting up Express in NodeJS environment

- Open `index.js`
- Check for `console.log("Hello World ! 👍")` by running the command `node index.js`
- Just run `npm init -y` to install `package.json`
- Type on Command Line - `npm i express` to install express
- Copy the Below Code on the `index.js`:

```javascript
//start of code

import express from "express";
const app = express();

const PORT = 4000;

app.get("/", (request, response) => {
  response.send({ message: "Welcome to Home Page" });
});

app.listen(PORT, () =>
  console.log(`The Server is running on the port : ${PORT} 😉`),
);

//end of code
```

- Type `npm install --save-dev nodemon` to install as a dev dependency
- Inside the `package.json`, make the following changes:

```javascript
{
  "type": "module", // to support latest import & export syntax
  "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js"
  }
}
```

- Now run `npm run dev` on the Command Line to show the output
- Below output should be visible on Command Line:

```bash
C:/folder/index.js>
The server running on the Port : 4000 😉
```

[Back to Top](#table-of-contents)

### Dotenv for storing environmental variables

- Install the dependency using the below command:

```bash
npm i dotenv
```

- Create a file `.env` at the root of the project and add the below code inside it:

```environments
MONGO_URL=your_mongodb_connection_string_here
```

- Insert the below import on the top of the code:

```javascript
import "dotenv/config";

const MONGO_URL = process.env.MONGO_URL;
```

[Back to Top](#table-of-contents)

## MongoDB setup for NodeJS

- Install the dependency using CLI:

```bash
npm i mongodb
```

- Include the below block of code:

```javascript
// include at the top of index.js
import { MongoClient } from "mongodb";

const MONGO_URL = "mongodb://127.0.0.1";
const client = new MongoClient(MONGO_URL); //dialing operation
await client.connect(); //This is a calling operation
//since calling will take some time, await needs to be prefixed
```

[Back to Top](#table-of-contents)

---

## Project Overview

This is a basic Express.js application that demonstrates a modular architecture with separation of concerns. It's designed to serve as a starting point for building RESTful APIs.

## Folder Structure

```
expess-boilerplate/
├── index.js                 # Application entry point
├── package.json             # Project dependencies and scripts
├── .env                     # Environment variables (not committed to git)
├── .gitignore               # Files and folders to ignore in git
├── controllers/             # Request handlers for routes
│   └── products.controller.js
├── routers/                 # Route definitions
│   └── products.routers.js
├── services/                # Business logic and data operations
│   └── products.service.js
├── middleware/              # Custom middleware (e.g., validation)
│   └── validator.middleware.js
└── schemas/                 # Data validation schemas (Joi)
    └── products.schema.js
```

[Back to Top](#table-of-contents)

### File Descriptions

- **index.js**: The main application file where the Express server is initialized, middleware is configured, and routes are registered.

- **package.json**: Contains project metadata, dependencies, and npm scripts for running the application.

- **.env**: Stores sensitive environment variables like database connection strings and API keys. Should never be committed to version control.

- **.gitignore**: Specifies which files and directories should be ignored by git (e.g., `node_modules/`, `.env`, `*.log`).

- **controllers/**: Contains controller files that handle incoming requests and handles the response. Controllers call services to perform business logic.
  - `products.controller.js`: Handles product-related requests.

- **routers/**: Contains route definitions that map HTTP requests to controller methods.
  - `products.routers.js`: Defines routes for product endpoints (GET, POST, PUT, DELETE).

- **services/**: Contains business logic and data access operations. Services are called by controllers to fetch or manipulate data.
- `products.service.js`: Contains product-related business logic.

[Back to Top](#table-of-contents)

## Installation

1. Clone or download the project:

   ```bash
   git clone <repository-url>
   cd express-boilerplate
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. (Optional) Configure environment variables by creating a `.env` file in the root directory.

[Back to Top](#table-of-contents)

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will run on the default port (typically `http://localhost:3000`). Check your `index.js` for the exact port configuration.

[Back to Top](#table-of-contents)

## Architecture Pattern

This project follows the **MVC (Model-View-Controller)** pattern:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and interact with the database
- **Routers**: Define API endpoints and route requests to appropriate controllers

[Back to Top](#table-of-contents)

## API Endpoints

### Products

- `GET /products` - Retrieve all products
- `GET /products/:id` - Retrieve a specific product by its ID
- `POST /products` - Create a new product. Requires `product_name`, `price`, `category`, `stock`, and `rating`.
- `PUT /products/:id` - Update an existing product by its ID.
- `DELETE /products/:id` - Remove a product from the database.

### Cricket (Aggregation & CRUD)

- `GET /cricket` - Retrieve all cricket scores
- `GET /cricket/:id` - Retrieve a specific score by its ID
- `POST /cricket` - Create a new score. Requires `name`, `team`, `runs`, and `balls`.
- `PUT /cricket/:id` - Update a score by its ID.
- `DELETE /cricket/:id` - Delete a score by its ID.

#### Aggregation Endpoints
- `GET /cricket/all-players` - List all unique player names
- `GET /cricket/india-players` - Filter players from team 'India'
- `GET /cricket/high-scorers` - Players with runs > 100
- `GET /cricket/quick-batters` - Players with strike rate > 150
- `GET /cricket/power-hitters` - Players with more than 5 sixes
- `GET /cricket/projection-name-runs` - Get only player names and their runs
- `GET /cricket/aus-eng-players` - Players from Australia or England
- `GET /cricket/top-3-scorers` - Top 3 players by runs
- `GET /cricket/most-balls-player` - Player who faced the most balls
- `GET /cricket/total-runs` - Calculate total runs across all players
- `GET /cricket/average-runs` - Calculate average runs per player
- `GET /cricket/total-players` - Get total count of players
- `GET /cricket/total-runs-by-team` - Group by team and sum runs
- `GET /cricket/player-count-by-team` - Group by team and count players

[Back to Top](#table-of-contents)

## Dependencies

This project uses the following dependencies as specified in `package.json`:

- **express**: (^5.2.1) Web framework for Node.js
- **mongodb**: (^7.1.0) Official MongoDB driver for Node.js
- **dotenv**: (^17.3.1) Environment variable management
- **joi**: (^18.0.2) Data validation library
- **cors**: (^2.8.6) Cross-Origin Resource Sharing middleware
- **http-status-codes**: (^2.3.0) Constants enumerating HTTP status codes

### Dev Dependencies
- **nodemon**: (^3.1.14) Monitor for any changes in your source and automatically restart your server

[Back to Top](#table-of-contents)

## Best Practices

- Keep controllers lean—they should primarily handle request/response logic
- Move business logic to services
- Use meaningful naming conventions for files and functions
- Add error handling and validation in controllers and services
- Use environment variables for configuration

[Back to Top](#table-of-contents)

---

## Joi Validation for Payload

We use **Joi** to ensure that incoming request payloads meet the required structure and data types before being processed by the controllers.

### Joi Installation

To install Joi in your project, run:

```bash
npm install joi
```

### Payload Validation Requirements

1. **Schema Definition**: All schemas should be stored in the `schemas/` directory. Use descriptive names like `products.schema.js`.
2. **Middleware Usage**: Use the `validator.middleware.js` to wrap your schemas in the router definition.
3. **Error Handling**: The middleware automatically returns a `400 Bad Request` with a clear error message if the payload is invalid.

#### Example Implementation

**1. Create Middleware (`middleware/validator.middleware.js`):**

```javascript
import StatusCodes from "http-status-codes";

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
    }
    next();
  };
};

export default validateBody;
```

**2. Define Schema (`schemas/products.schema.js`):**

```javascript
import Joi from "joi";

export const createProductSchema = Joi.object({
  product_name: Joi.string().required(),
  price: Joi.number().required(),
});
```

**3. Apply in Router (`routers/products.routers.js`):**

```javascript
import validateBody from "../middleware/validator.middleware.js";
import { createProductSchema } from "../schemas/products.schema.js";

productsRouters.post("/", validateBody(createProductSchema), createProduct);
```

[Back to Top](#table-of-contents)
