class UserModel {
  constructor(db) {
    this.db = db;
  }

  // Callback based method
  getUsersCb(callback) {
    this.db.query("SELECT * FROM employees ORDER BY ID", (err, result) => {
      if (err) return callback(err);
      return callback(null, result);
    });
  }

  // Promise based method
  getUsers() {
    return new Promise((resolve, reject) => {
      this.db.query("SELECT * FROM employees ORDER BY ID", (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // Get user by creds
  getUser(id) {
    return new Promise((resolve, reject) => {
      this.db.query(
        "SELECT username, name, mobile, email FROM employees WHERE id = ?",
        [id],
        (err, response) => {
          if (err) return reject(err);
          resolve(response);
        }
      );
    });
  }

  // Add single user
  signUp(userData) {
    return new Promise((resolve, reject) => {
      const { username, password, name, mobile, email, city } = userData;

      const query = `INSERT INTO employees (username, password, name, mobile, email, city) VALUES (?, ?, ?, ?, ?, ?)`;
      const values = [username, password, name, mobile, email, city];

      this.db.query(query, values, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  findByUsername(username) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM employees WHERE username = ?`;
      this.db.query(query, [username], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // Add users in bulk
  addUsers(usersData) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(usersData) || usersData.length === 0) {
        return reject(new Error("Invalid or empty users data"));
      }

      const placeholders = usersData.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");

      const values = usersData.flatMap((user) => [
        user.username,
        user.password,
        user.name,
        user.mobile,
        user.email,
        user.city,
      ]);

      const query = `
      INSERT INTO employees
      (username, password, name, mobile, email, city)
      VALUES ${placeholders}
      `;

      this.db.query(query, values, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // update a user completely (for PUT)
  updateUser(id, userData) {
    return new Promise((resolve, reject) => {
      const { username, password, name, mobile, email, city } = userData;
      const query = `
        UPDATE employees
        set username = ?, password = ?, name = ?, mobile = ?, email = ?, city = ?
        WHERE id = ?
      `;

      const values = [username, password, name, mobile, email, city, id];

      this.db.query(query, values, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // Optionally, if you want to update only specific fields (for PATCH)
  updateUserPartially(id, userData) {
    return new Promise((resolve, reject) => {
      let query = "UPDATE employees SET ";
      let values = [];

      Object.keys(userData).forEach((key) => {
        query += `${key} = ?, `;
        values.push(userData[key]);
      });

      // Remove the trailing comma and space
      query = query.slice(0, -2);
      query += " WHERE id = ?";

      values.push(id);

      this.db.query(query, values, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // Delete single user
  deleteUser(id) {
    return new Promise((resolve, reject) => {
      this.db.query(`DELETE FROM employees WHERE id = ${id}`, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // Delete users in bulk
  deleteUsers(ids) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(ids) || ids.length === 0) {
        return reject(new Error("Invalid or empty ids array"));
      }

      const placeholders = ids.map(() => "?").join(",");
      const query = `DELETE FROM employees WHERE id IN (${placeholders})`;

      this.db.query(query, ids, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }

  // Check if user with same username/email already exists
  findByUsernameOrEmail(username, email) {
    return new Promise((resolve, reject) => {
      const query = `SELECT id FROM employees WHERE username = ? OR email = ?`;
      this.db.query(query, [username, email], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  }
}

module.exports = UserModel;
