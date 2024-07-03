const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const FileSystem = require("fs");
const users = require("./sample.json");

const app = express();
const port = 8000;

// Use CORS middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Display all users
app.get("/users", (req, res) => {
  return res.json(users);
});

// Delete user detail
app.delete("/users/:id", (req, res) => {
  let id = Number(req.params.id);
  let filteredUsers = users.filter((user) => user.id !== id);

  FileSystem.writeFile("./sample.json", JSON.stringify(filteredUsers), (err) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting user" });
    }
    return res.json(filteredUsers);
  });
});

// Add new user
app.post("/users", (req, res) => {
  let { name, age, city } = req.body;
  if (!name || !age || !city) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let id = Date.now();
  users.push({ id, name, age, city });

  FileSystem.writeFile("./sample.json", JSON.stringify(users), (err) => {
    if (err) {
      return res.status(500).json({ message: "Error adding user" });
    }
    return res.json(users);
  });
});

// Update user details
app.patch("/users/:id", (req, res) => {
  let id = Number(req.params.id);
  let { name, age, city } = req.body;
  if (!name || !age || !city) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[index] = { id, name, age, city };

  FileSystem.writeFile("./sample.json", JSON.stringify(users), (err) => {
    if (err) {
      return res.status(500).json({ message: "Error updating user" });
    }
    return res.json({ message: "User details updated successfully", users });
  });
});

app.listen(port, (err) => {
  if (err) {
    console.error(`Error starting server: ${err}`);
  } else {
    console.log(`App is running on port ${port}`);
  }
});
