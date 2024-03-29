const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/fsa_app_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh';
if(JWT === 'shhh'){
  console.log('If deployed, set process.env.JWT to something other than shhh');
}

const createTables = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS users;
    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(20) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `;
  await client.query(SQL);
};

const createUser = async({ username, password})=> {
  const SQL = `
    INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), username, await bcrypt.hash(password, 5)]);
  return response.rows[0];
};

const authenticate = async({ username, password })=> {
  const SQL = `
    SELECT id, username, password FROM users WHERE username=$1;
  `;
  const response = await client.query(SQL, [username]);
  if(!response.rows.length || (await bcrypt.compare(password, response.rows[0].password)) === false){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id}, JWT);
  return { token };
};

// Login.js
const [errors, setErrors] = useState([]);

// Add a function to display errors in your login form
const displayErrors = () => {
  return errors.map((error, index) => (
    <div key={index} className="error-message">
      {error}
    </div>
  ));
};

const handleLogin = async (username, password) => {
  try {

    // Make a request to the server to authenticate the user
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      // Successful login, handle the response accordingly
      const userData = await response.json();
      // Update state or perform actions for a successful login
    } else {
      // If response status is not OK, throw an error
      throw new Error('Authentication failed');
    }
  } catch (error) {
    // Handle errors, such as network issues or authentication failure
    setErrors(["Invalid credentials. Please try again."]);
  }
};


const handleRegistration = async (username, password, email) => {
  try {

    // Make a request to the server to register the new user
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, email }),
    });

    if (response.ok) {
      // Successful registration, handle the response accordingly
      const userData = await response.json();
      // Update state or perform actions for a successful registration
    } else {
      // If response status is not OK, throw an error
      throw new Error('Registration failed');
    }
  } catch (error) {
    // Handle errors, such as network issues or registration failure
    setErrors(["Registration failed. Please try again."]);
  }
};


const findUserWithToken = async(token)=> {
  let id;
  try{
    const payload = await jwt.verify(token, JWT);
    id = payload.id;
  }
  catch(ex){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  const SQL = `
    SELECT id, username FROM users WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  if(!response.rows.length){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  return response.rows[0];
};

const fetchUsers = async()=> {
  const SQL = `
    SELECT id, username FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

module.exports = {
  client,
  createTables,
  createUser,
  fetchUsers,
  authenticate,
  findUserWithToken
};
