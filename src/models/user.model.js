const msdb = require("../config/mysql");

const getUsers = (callback) => {
  msdb.query("SELECT * FROM employees", (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

const getUser = (username, password, callback) => {
  msdb.query(
    `SELECT * FROM employees WHERE username = '${username}' AND password = '${password}'`,
    (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    }
  );
};

const addUser = (userData, callback) => {
  const { username, password, name, mobile, email, city } = userData;
  const query = `INSERT INTO employees (username, password, name, mobile, email, city) VALUES ('${username}', '${password}', '${name}', '${mobile}', '${email}', '${city}')`;
  msdb.query(query, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

const addUsers = (usersData, callback) => {
  let query = `INSERT INTO employees (username, password, name, mobile, email, city) VALUES`;
  usersData.forEach((user) => {
    const { username, password, name, mobile, email, city } = user;
    query += ` ('${username}', '${password}', '${name}', '${mobile}', '${email}', '${city}'),`;
  });
  query = query.slice(0, -1);
  msdb.query(query, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

const deleteUser = (id, callback) => {
  msdb.query(`DELETE from employees WHERE id = ${id}`, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

const deleteUsers = (ids, callback) => {
  let query = `DELETE from employees WHERE id IN (`;
  ids.forEach((id) => (query += `${id},`));
  query = query.slice(0, -1);
  query += ")";
  msdb.query(query, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

module.exports = {
  getUsers,
  getUser,
  addUser,
  addUsers,
  deleteUser,
  deleteUsers,
};
