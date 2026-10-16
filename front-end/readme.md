# Front end

E-commerce fronend folder build with Express, Bootstrap and EJS. Frontend talks to backend. Documentation explains the frontend setup and how to run it.

## Key Features

- Only admin can login
- Jwt is stored in session
- Products can be searched by /filtered
- Products can be added,edited and soft deleted
- Categories and Brands can be added, deleted and edited
- Users page with roles and memberships can be deleted or made into admin
- Memberships discount can be edited
- Orders status can be changes

## Setup

1. Install the dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. On http://localhost:3001/ login as admin

```
Email: admin@noroff.no / Username: Admin
Password: P@ssword2023
```

## Script Details

```json
  "scripts": {
    "start": "node ./bin/www",
    "dev": "concurrently \"npm start --prefix ../back-end\" \"npm run watch\" \"npm run sync\"",
    "watch": "nodemon --ignore public/ --ext js,json ./bin/www",
    "sync": "browser-sync start --proxy localhost:3001 --port 3002 --files \"views/**/*.ejs, public/**/*, app.js, routes/**/*.js, helpers/**/*.js, middleware/**/*.js\" --reload-delay 1000 --no-notify"
  },
```

## Environment Variables

```
PORT=3001
```

## Additional Libraries/Packages

- dotenv
- bootstrap
- ejs
- jquery
- express
- express-session

## Built With

- Visual Studio Code

## NodeJS Version Used

- Node.js v24.12.0

### REFERENCES

**Front-end**
https://jquery.com/
https://www.w3schools.com/jquery/jquery_selectors.asp
https://www.w3schools.com/jquery/jquery_css_classes.asp

**Videos watches**
https://www.youtube.com/watch?v=OaXjIWP3qLQ

**General knowledge**
Most ideas code came from last couple of Moodles and solutions I used throughout the year

**AI assistance**
Anthropic used through development:

- Explaining concepts: How routes on frontend would communicate with frontend,
  since it felt weird having two express solutions. Explaining how values could be populated into inputs.
- Questions: Why do options with no value are not accepted. Why does my backend throw error on correct input. Getting lost in all the naming of routes in 3 places and asking for help with remembering the names.
