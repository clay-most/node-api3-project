const express = require("express");
const userData = require("./userDb");

const router = express.Router();

router.get("/", (req, res) => {
  userData
    .get(req)
    .then(users => {
      res.status(200).json({ users });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "Users could not be retrieved." });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  userData
    .getById(req.params.id)
    .then(user => {
      res.status(200).json({ user });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "User could not be retrieved." });
    });
});

router.get("/:id/posts", (req, res) => {
  userData
    .getUserPosts(req.params.id)
    .then(userPosts => {
      res.status(200).json({ userPosts });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "User could not be retrieved." });
    });
});

router.delete("/:id", (req, res) => {
  let deletedUser = {};
  userData.getById(req.params.id).then(user => {
    deletedUser = user;
  });

  userData
    .remove(req.params.id)
    .then(() => {
      res
        .status(200)
        .json({ deletedUser, message: "User deleted." });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "User could not be deleted." });
    });
});

router.put("/:id", (req, res) => {
  const changes = req.body;
  const id = req.params.id;
  userData
    .update(id, changes)
    .then(count => {
      userData.getById(id).then(updatedUser => {
        res
          .status(200)
          .json({ updatedUser, message: "User modified." });
      });
    })
    .catch(error => {
      console.log(error);
      res
        .status(500)
        .json({ error: "User could not be modified." });
    });
});

router.post("/", validateUser, (req, res) => {
  const userData = req.body;
  userData
    .insert(userData)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the new user to the database."
      });
    });
});

function validateUserId(req, res, next) {
  const id = req.params.id;
  userData.getById(id).then(user => {
    if (!user) {
      res.status(400).json({ message: "invalid user id" });
    } else {
      next();
    }
  });
}

function validateUser(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

module.exports = router;
