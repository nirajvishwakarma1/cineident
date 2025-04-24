const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// GET /app/users - get all users
router.get("/users", userController.getUsers);

// GET /app/user - get user
router.get("/user", userController.getUser);

// POST /app/user - add user
router.post("/user", userController.addUser);

// POST /app/users - add users
router.post("/users", userController.addUsers);

router.delete("/user/:id", userController.deleteUser);

router.delete("/users", userController.deleteUsers);

module.exports = router;
