# Back end

E-commerce backend fonder with Express, Sequilize and MySQL. Documentation explains the backend setup and how to run it.

## Key Features

- MySQL database written in third normal form
- Prepopulation of roles, membership and admin user
- Populated database on post /init
- JWT token for users and admins
- CRUD for endpoints such as products, categories and brands
- JSON returned with a predefined structure
- Cart can be added only in backend and order created

## Setup

1. Install the dependencies:

```bash
npm install
```

2. Create database by running commands below

3. Create .env with environment variables below

4. Start the server:

```bash
npm start
```

5. Populate the database by sending POST /init

## Script Details

```json
  "scripts": {
    "start": "node ./bin/www",
    "test": "jest --runInBand",
    "swagger": "node swagger"
  },
```

## Environment Variables

```
DATABASE_NAME=[your_db_name]
DB_USERNAME=[your_db_username]
DB_PASSWORD=[your_db_password]
PORT=3000
DB_PORT=3306
HOST=localhost
DIALECT=mysql
TOKEN_SECRET=[your_token_secret]
```

Generate TOKEN_SECRET with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## API Documentation

Swagger documentation can be accessed at
http://localhost:3000/doc after the server is live.

## Additional Libraries/Packages

- dotenv
- jsonwebtoken
- mysql2
- sequelize
- ejs
- swagger-autogen
- swagger-ui-express
- jest
- supertest

## Built With

- Visual Studio Code

## NodeJS Version Used

- Node.js v24.12.0

## DATABASE

Create the database and use by running this command in the SQL Workbench

```sql
CREATE DATABASE eCommerce;
USE eCommerce;
```

## DATABASEACCESS

User with database owner rights and permission can be accessed under the following credentials:

```sql
CREATE USER 'ecommerceowner'@'localhost' IDENTIFIED BY 'ecommerce1234';
GRANT ALL PRIVILEGES ON eCommerce.* TO 'ecommerceowner'@'localhost';
FLUSH PRIVILEGES;
```

### REFERENCES

**Sequilize ideas**
https://sequelize.org/docs/v6/other-topics/transactions/
https://sequelize.org/docs/v6/core-concepts/assocs/
https://sequelize.org/api/v7/interfaces/_sequelize_core.index.includeoptions
https://sequelize.org/docs/v7/querying/select-in-depth/
https://sequelize.org/api/v6/class/src/model.js~model
https://www.topcoder.com/thrive/articles/sequelize-aggregations
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
https://sequelize.org/docs/v6/core-concepts/raw-queries/
https://sequelize.org/docs/v7/querying/raw-queries/
https://medium.com/@artemkhreno/connection-pooling-patterns-optimizing-database-connections-for-scalable-applications-159e78281389
https://sequelize.org/api/v6/class/src/data-types.js~enum

**Videos watches**
https://www.youtube.com/watch?v=FKnzS_icp20
https://www.youtube.com/watch?v=mbsmsi7l3r4&t=180s
https://www.youtube.com/watch?v=hKYjSgyCd60
https://www.youtube.com/watch?v=VbvRKy03r3Q

**General knowledge**
Most ideas code came from last couple of Moodles and solutions I used throughout the year

**AI assistance**
Anthropic used through development:

- Explaining concepts: Sequelize associations and foreign keys, the difference
  between CASCADE and RESTRICT, transactions, 3NF normalisation, and why
  belongsTo cannot set onDelete. Explaining how JSON works on looping.
  Explaining how you can restructure your db response on looping.
  Explaining how SQL queries worked after I forgot what order to write them in.
- Questions: Identifying causes of errors such as "Include unexpected",
  "findByPk ignores". Explaining why the database behaves in a certain ways,
  such as how it handles the responses on decimalNumbers and underscored,
