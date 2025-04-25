const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const { validationResult } = require("express-validator");

class UserController {
  constructor(db) {
    this.userModel = new UserModel(db);
  }

  getUsers = async (req, res) => {
    try {
      const users = await this.userModel.getUsers();
      if (users.length === 0) {
        res.status(404).send({ error: "No users found!" });
      }
      res.json(users);
    } catch (err) {
      res.status(500).send({ error: err.message || "Something went wrong!" });
    }
  };

  getUser = async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ error: "id is required" });
      }
      const user = await this.userModel.getUser(id);
      if (!user || user.length === 0) {
        res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message || "Something went wrong!" });
    }
  };

  signUp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { username, password, name, mobile, email, city } = req.body;

      // Basic validation
      if (!username || !password || !name || !mobile || !email || !city) {
        res.status(400).json({ error: "All fields are required" });
      }

      // Check if username/email already exists (optional, but good)
      const existingUser = await this.userModel.findByUsernameOrEmail(
        username,
        email
      );
      if (existingUser.length > 0) {
        return res
          .status(409)
          .json({ error: "Username or email already exits" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Save user with hashed password
      const newUser = {
        username,
        password: hashedPassword,
        name,
        mobile,
        email,
        city,
      };
      await this.userModel.signUp(newUser);

      res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
      res.status(500).json({ error: err.message || "Something went wrong!" });
    }
  };

  signIn = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Validation
      if (!username || !password) {
        return res
          .status(400)
          .json({ error: "Username and password are required" });
      }

      // Get user from DB
      const user = await this.userModel.findByUsername(username);
      if (!user || user.length === 0) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const dbUser = user[0];

      // Compare password with hashed one
      const match = await bcrypt.compare(password, dbUser.password);
      if (!match) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Generate JWT
      const payload = {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        name: dbUser.name,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      });

      res.json({ token, user: payload });
    } catch (err) {
      res.status(500).json({ error: err.message || "Something went wrong!" });
    }
  };

  addUsers = async (req, res) => {
    try {
      const userData = req.body;
      if (!Array.isArray(userData) || userData.length === 0) {
        return res
          .status(400)
          .json({ error: "Users data must be an array and cannot be empty" });
      }
      await this.userModel.addUsers(req.body);
      res.status(201).end();
    } catch (err) {
      res.status(500).json({ error: err.message || "Something went wrong!" });
    }
  };

  // Update a user completely (PUT)
  updateUser = async (req, res) => {
    const { id } = req.params;
    const userData = req.body;

    try {
      const result = await this.userModel.updateUser(id, userData);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).end();
    } catch (err) {
      res.status(500).json({ error: "Something went wrong" });
    }
  };

  // Partially update a user (PATCH)
  updateUserPartially = async (req, res) => {
    const { id } = req.params;
    const userData = req.body;

    try {
      const result = await this.userModel.updateUserPartially(id, userData);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json({ message: "User partially updated successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message || "Something went wrong!" });
    }
  };

  deleteUser = async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }
      const result = await this.userModel.deleteUser(req.params.id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).end();
    } catch (err) {
      res.status(500).json({ error: err.message || "Something went wrong!" });
    }
  };

  deleteUsers = async (req, res) => {
    try {
      const ids = req.body.ids;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res
          .status(400)
          .json({ error: "IDs array is required and cannot be empty" });
      }
      const result = await this.userModel.deleteUsers(req.body.ids);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Users not found" });
      }
      res.status(200).end();
    } catch (err) {
      res.status(500).json({ error: err.message || "Something went wrong!" });
    }
  };
}

module.exports = UserController;
