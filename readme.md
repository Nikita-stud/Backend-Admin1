# Backend Admin

![Node.js](https://img.shields.io/badge/Node.js-24-5FA04E?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4%20%7C%205-000000?logo=express&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-6-52B0E7?logo=sequelize&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-B4CA65?logo=ejs&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-30-C21325?logo=jest&logoColor=white)

The project runs locally. When the back end is running, the API docs are at [http://localhost:3000/doc](http://localhost:3000/doc).

## Description

Backend Admin is an e-commerce back end with an admin panel, built with Express, Sequelize and MySQL. It was made as an exam project for the Back-end course at Noroff, by [Nikita Fedorov](https://www.linkedin.com/in/nikita-fedorov-757aaa402/).

The task was to build a REST API connected to a SQL database using Sequelize, and a front end where an admin can control that database. The project has two Express apps. The back end is the API, and the front end is an admin panel made with EJS and Bootstrap that talks to the API. Users can register, log in, fill a cart and check out through the API. The admin panel is only for admins.

| Folder      | How it works                         | Port |
| ----------- | ------------------------------------ | ---- |
| `back-end`  | Express API with Sequelize and MySQL | 3000 |
| `front-end` | Admin UI, EJS and Bootstrap          | 3001 |

### Features

- MySQL database in third normal form, with every table made as a Sequelize model
- Populate the database with roles, memberships, an admin user and products by sending `POST /init`
- Register and log in with username or email, passwords hashed with PBKDF2
- JWT authentication, with admin only routes
- CRUD for products, categories and brands, products use soft delete
- Search products by name, category or brand, admins also see deleted products
- Cart with stock checks, and a checkout that creates the order in one transaction
- Memberships (Bronze, Silver, Gold) with a discount, updated by how many items a user has bought
- Admin can change order status, edit membership discounts, make other users admin or delete them
- Every response uses the same JSON structure
- Swagger documentation for the whole API

## Built With

- Language = JavaScript
- Runtime = Node.js 24
- Framework = Express
- Database = MySQL + Sequelize
- Auth = JSON Web Token (back end) + Express Session (front end)
- Views = EJS
- Styling = Bootstrap 5 + jQuery
- API Docs = Swagger (swagger-autogen + swagger-ui-express)
- Testing = Jest + Supertest

## How It Works

The back end connects to MySQL through Sequelize in `models/index.js`. It loads every model, sets up the associations and syncs the tables when the server starts.
`POST /init` fills the empty database in one transaction. It adds the roles, the memberships and the admin user, then fetches the products from an external API and creates the brands and categories they use.
Each route in `routes/` checks the input and calls a service in `services/`, which does the database work. `isAuth` checks the JWT and `isAdmin` checks that the user is an admin. `hasRole` reads the token only if one is sent, so guests and admins can use the same product routes but see different results.
At checkout the cart is turned into an order, the stock is reduced and the cart is cleared, all in one transaction. After that the user's membership is calculated again from the total number of items they have bought.

The front end never touches the database. When an admin logs in, `helpers/apiRequest.js` sends the request to the back end and saves the JWT in the session. Every later request uses that token. `requireAdmin` sends anyone who is not logged in back to the login page.

## Project Structure

```
back-end/
├── bin/www           # starts the server on port 3000
├── helpers/          # shared JSON response format
├── middleware.js/    # isAuth, isAdmin and hasRole
├── models/           # Sequelize models and associations
├── routes/           # one file per resource
├── services/         # database logic for each model
├── tests/            # Jest + Supertest route tests
├── swagger.js        # generates swagger-output.json
└── app.js

front-end/
├── bin/www           # starts the server on port 3001
├── helpers/          # requests to the back end
├── middleware/       # requireAdmin
├── routes/           # admin pages
├── views/            # EJS pages, partials and popups
└── app.js
```

## Getting Started

### Prerequisites

- Node.js (made with v24.12.0)
- npm
- A MySQL server, for example with MySQL Workbench

### Installing

1. Clone the repo:

```bash
git clone https://github.com/Nikita-stud/Backend-Admin1.git
```

2. Install the dependencies in both folders:

```bash
cd back-end && npm install
cd ../front-end && npm install
```

### Database

Create the database in MySQL Workbench:

```sql
CREATE DATABASE eCommerce;
USE eCommerce;
```

Create a user that owns the database:

```sql
CREATE USER 'ecommerceowner'@'localhost' IDENTIFIED BY 'ecommerce1234';
GRANT ALL PRIVILEGES ON eCommerce.* TO 'ecommerceowner'@'localhost';
FLUSH PRIVILEGES;
```

### Environment Variables

Create a `.env` file in the `back-end` folder. You can copy `.env.example`:

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

Generate `TOKEN_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

The front end doesn't need any environment variables. It runs on port 3001 by default.

### Running

1. Start the back end:

```bash
cd back-end
npm start
```

2. Populate the database by sending `POST http://localhost:3000/init`, for example from Swagger at [http://localhost:3000/doc](http://localhost:3000/doc).

3. Start the front end:

```bash
cd front-end
npm start
```

4. Open [http://localhost:3001](http://localhost:3001) and log in as admin:

```
Email: admin@noroff.no / Username: Admin
Password: P@ssword2023
```

### Available Scripts

**back-end**

- `npm start` starts the API on port 3000
- `npm test` runs the Jest route tests one after another
- `npm run swagger` generates the Swagger docs into `swagger-output.json`

**front-end**

- `npm start` starts the admin panel on port 3001
- `npm run dev` starts the back end, the front end with nodemon and browser-sync together
- `npm run watch` restarts the front end with nodemon when a file changes
- `npm run sync` reloads the browser with browser-sync on port 3002

### Script Details

```json
  "scripts": {
    "start": "node ./bin/www",
    "test": "jest --runInBand",
    "swagger": "node swagger"
  },
```

```json
  "scripts": {
    "start": "node ./bin/www",
    "dev": "concurrently \"npm start --prefix ../back-end\" \"npm run watch\" \"npm run sync\"",
    "watch": "nodemon --ignore public/ --ext js,json ./bin/www",
    "sync": "browser-sync start --proxy localhost:3001 --port 3002 --files \"views/**/*.ejs, public/**/*, app.js, routes/**/*.js, helpers/**/*.js, middleware/**/*.js\" --reload-delay 1000 --no-notify"
  },
```

## Roadmap

- [x] Swagger documentation for every endpoint
- [x] Memberships updated after checkout
- [x] Route tests with Jest and Supertest
- [ ] Cart and checkout in the front end
- [ ] Move the session secret into `.env`
- [ ] More tests for the cart and orders

## Contributing

This is a finished course project, so I'm not planning any big changes. If you find a bug or have an idea, open an issue or a pull request and I will take a look.

## References

**Sequelize**

- https://sequelize.org/docs/v6/other-topics/transactions/
- https://sequelize.org/docs/v6/core-concepts/assocs/
- https://sequelize.org/api/v7/interfaces/_sequelize_core.index.includeoptions
- https://sequelize.org/docs/v7/querying/select-in-depth/
- https://sequelize.org/api/v6/class/src/model.js~model
- https://www.topcoder.com/thrive/articles/sequelize-aggregations
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
- https://sequelize.org/docs/v6/core-concepts/raw-queries/
- https://sequelize.org/docs/v7/querying/raw-queries/
- https://medium.com/@artemkhreno/connection-pooling-patterns-optimizing-database-connections-for-scalable-applications-159e78281389
- https://sequelize.org/api/v6/class/src/data-types.js~enum

**Front end**

- https://jquery.com/
- https://www.w3schools.com/jquery/jquery_selectors.asp
- https://www.w3schools.com/jquery/jquery_css_classes.asp

**Videos**

- https://www.youtube.com/watch?v=FKnzS_icp20
- https://www.youtube.com/watch?v=mbsmsi7l3r4&t=180s
- https://www.youtube.com/watch?v=hKYjSgyCd60
- https://www.youtube.com/watch?v=VbvRKy03r3Q
- https://www.youtube.com/watch?v=OaXjIWP3qLQ

**General knowledge**

Most of the ideas came from the last couple of Moodle modules and the solutions I used throughout the year.

**AI assistance**

I used Anthropic's Claude during development for:

- Explaining concepts: Sequelize associations and foreign keys, the difference between CASCADE and RESTRICT, transactions, 3NF normalisation, and why `belongsTo` cannot set `onDelete`. How JSON works when looping, and how to restructure a database response in a loop. How the front end routes talk to the back end, since having two Express apps felt strange at first. How values can be filled into inputs. The order of clauses in SQL queries.
- Questions: Finding the cause of errors such as "Include unexpected" and "findByPk ignores". Why the database behaves the way it does, for example with `decimalNumbers` and `underscored`. Why options with no value are not accepted. Why the back end threw an error on correct input. Keeping track of route names across three places.

## Contact

You can always contact me through the official Noroff portal, or reach me here:

- Nikita on [GitHub](https://github.com/Nikita-stud) and [LinkedIn](https://www.linkedin.com/in/nikita-fedorov-757aaa402/)
