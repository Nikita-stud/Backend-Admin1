# EXAM PROJECT 1 BACK-END

This project is a an application build fully backend with express template engine. A course assignment that focuses on creating database connection to a SQL server using Sequelize. The front end allows admin to control the database. Backend has more features such as adding items to cart, calculating total amount of ordered-items etc.

| Folder   | How it works                         | Port |
| -------- | ------------------------------------ | ---- |
| Backend  | Express API with Sequelize and MySQL | 3000 |
| Frontend | Admin UI, EJS and Bootstrap          | 3001 |

## Key Features

- Fully functional backend database
- Fully functional frontend ui with JWT stored in session
- Control of Products with soft delete, add, edit and get, as well as search option
- Database uses 3NF format with tables created as models
- Admin can make other users admin, admins get access to all products, even deleted ones
- Control of discount of memberships, CRUD of categories and brands

## Application Installation and Usage Instructions

1. Clone the repo:

```bash
git clone https://github.com/noroff-backend-1/2025-10-onl-pbed1-pbnd2-ft-oct25ft-ep1-ca-nikita-stud.git
```

2. Install the dependencies in back-end folder as well as front-end:

```bash
npm install
```

3. Follow further steps in backend README.md to back-end folder

4. Follow further steps in frontend README.md to front-end folder

## All Libraries/Packages

- dotenv
- jsonwebtoken
- mysql2
- sequelize
- ejs
- swagger-autogen
- swagger-ui-express
- jest
- supertest
- bootstrap
- jquery
- express
- express-session

## Built With

- Visual Studio Code

## NodeJS Version Used

- Node.js v24.12.0

## API Documentation

Swagger documentation can be accessed at
http://localhost:3000/doc after the server is live.

## BACKEND

Please read the back-end README.md file in back-end folder for further explanation

## FRONTEND

Please read the front-end README.md file in front-end folder for further explanation

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

**Front-end**
https://jquery.com/
https://www.w3schools.com/jquery/jquery_selectors.asp
https://www.w3schools.com/jquery/jquery_css_classes.asp

**Videos watches**
https://www.youtube.com/watch?v=FKnzS_icp20
https://www.youtube.com/watch?v=mbsmsi7l3r4&t=180s
https://www.youtube.com/watch?v=hKYjSgyCd60
https://www.youtube.com/watch?v=VbvRKy03r3Q
https://www.youtube.com/watch?v=OaXjIWP3qLQ

**General knowledge**
Most ideas code came from last couple of Moodles and solutions I used throughout the year

**AI assistance**
Anthropic used through development:

- Explaining concepts: Sequelize associations and foreign keys, the difference
  between CASCADE and RESTRICT, transactions, 3NF normalisation, and why
  belongsTo cannot set onDelete. Explaining how JSON works on looping.
  Explaining how you can restructure your db response on looping.
  How routes on frontend would communicate with frontend,
  since it felt weird having two express solutions. Explaining how values could be populated into inputs.
  Explaining how SQL queries worked after I forgot what order to write them in.
- Questions: Identifying causes of errors such as "Include unexpected",
  "findByPk ignores". Explaining why the database behaves in a certain ways,
  such as how it handles the responses on decimalNumbers and underscored.
  Why do options with no value are not accepted. Why does my backend throw error on correct input. Getting lost in all the naming of routes in 3 places and asking for help with remembering the names.

### Contact

You can always contact us though official Noroff portal

@Nikita-stud
