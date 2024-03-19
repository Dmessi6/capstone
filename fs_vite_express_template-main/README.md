# Description

- this is a working application which allows an existing user to log into and out of the application

# Features to Add

<a href='https://github.com/FullstackAcademy/fs_vite_express_template/blob/main/wireframe.png'>Wireframe</a>

## Tier One

- add error handling for login errors
  - the state for the errors should be in the login form
  - find where the error occurs
  - how can the login form be made aware of the error?
- enable registration for new users
  - this seems like a big feature and yet you can break it is very similar to the existing code
  - a login form and register form are almost identical
  - from the perspective of the backend, registering is the same as creating a user with credentials and then authenticating in order to get their token
  - the client side code for registering and logging in is almost identical
- add the ability for a logged in user to set a value for their favorite_number
  - think about the order you need to proceed on this
  - a user will need to have a favorite_number
  - it can have a default value
  - is there a method in the data layer to update this value? If not can one be added and even tested in the init method?
  - is favorite_number being returned when the token is exchanged for the user? 
  - can this property be displayed on the home component?
  - once it can be displayed, how can it be changed?
  - a select object can both display the value and call a method which updates it
  - once you can get an updated value for a logged in user can you add a an express route which updates that value and returns the updated values for that user?
  - can you secure that route?

## Tier Two
- add a property of is_admin for users which will determine if a logged in user is an administrator
  - a simple approach might be to have a setAdministrator function in your data layer
  - you call it during init for one of the seeded users 
- an administrator should see a link which will enable them to see all the users in the system
  - start by showing the link only if a user is an administrator
- an administrator can set other users as administrators
  - add state to your application for users
  - if a user is an administrator, call the /api/users route
  - can you use useEffect with auth in the dependency array?
  - create a route and a component which shows the users
- an administrator can not unset themselves as an administrator
  - you can leverage the route for setting favorite_number and call the appropriate data layer method based on the whether favorite_number or is_admin is passed
  - can you secure this route?
  - can you prevent an administrator from unsetting themselves as administrator

# Setup

- create database

```
createdb fsa_app_db
```

- install dependencies

```
npm install && cd client && npm install
```

- start server in root directory of repository
```
npm run start:dev
```

- start vite server in client directory

```
npm run dev
```

- use a username and password in server/index.js in order to test out application.

# to test deployment
```
cd client && npm run build
```

browse to localhost:3000 (or whatever server port you used)

# to deploy
- build script for deploy

```
npm install && cd client && npm install && npm run build

```
- start script for deploy 

```
node server/index.js

```

- environment variables for deployed site

```
JWT for jwt secret
DATABASE_URL for postgres database
```

