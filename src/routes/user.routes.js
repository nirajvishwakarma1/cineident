const express = require("express");
const router = express.Router();
const msdb = require("../config/mysql");
const {
  validateSignup,
  validateSignin,
} = require("../validations/userValidation");
const {
  signUpRateLimiter,
  signInRateLimiter,
} = require("../middleware/rateLimiter");
const UserController = require("../controllers/UserController");

const userController = new UserController(msdb);

// GET /app/users - get all users
router.get("/users", userController.getUsers);

// GET /app/user - get user
router.get("/user/:id", userController.getUser);

// PUT /app/user/:id - update a user
router.put("/user/:id", userController.updateUser);

// PATCH /app/user/:id - Partially update a user
router.patch("/user/:id", userController.updateUserPartially);

// POST /app/signup - add user
router.post(
  "/signup",
  signUpRateLimiter,
  validateSignup,
  userController.signUp
);

// POST /app/signin
router.post(
  "/signin",
  signInRateLimiter,
  validateSignin,
  userController.signIn
);

// POST /app/users - add users
router.post("/users", userController.addUsers);

// DELETE /app/user/:id - Delete single user
router.delete("/user/:id", userController.deleteUser);

// DELETE /app/users - Delete multiple users
router.delete("/users", userController.deleteUsers);

module.exports = router;
