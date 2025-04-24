const { response } = require("express");
const userModel = require("../models/user.model");

const getUsers = (req, res) => {
  userModel.getUsers((err, response) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(response);
  });
};

const getUser = (req, res) => {
  userModel.getUser(req.body.username, req.body.password, (err, response) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(response);
  });
};

const addUser = (req, res) => {
  userModel.addUser(req.body, (err, response) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(response);
  });
};

const addUsers = (req, res) => {
  userModel.addUsers(req.body, (err, response) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(response);
  });
};

const deleteUser = (req, res) => {
  userModel.deleteUser(req.params.id, (err, response) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(response);
  });
};

const deleteUsers = (req, res) => {
  userModel.deleteUsers(req.body.ids, (err, response) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(response);
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
