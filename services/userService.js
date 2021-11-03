import { executeQuery } from "../database/database.js";
import { bcrypt } from "../deps.js";

const registerUser = async (email, password) => {
  const hash = await bcrypt.hash(password);
  await executeQuery(
    "INSERT INTO users (email, password) VALUES ($1, $2);",
    email,
    hash
  );
};

const getUsersByEmail = async (email) => {
  return await executeQuery("SELECT * FROM users WHERE email = $1;", email);
};

const authenticateUser = async (email, password) => {
  const res = await getUsersByEmail(email);
  if (res.rowCount === 0) {
    return [false, {}];
  }

  // take the first row from the results
  const userObj = res.rows[0];

  const hash = userObj.password;

  const passwordCorrect = await bcrypt.compare(password, hash);
  if (!passwordCorrect) {
    return [false, {}];
  }

  return [true, userObj];
};

export { registerUser, getUsersByEmail, authenticateUser };
