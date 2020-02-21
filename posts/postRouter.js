const express = require("express");

const router = express.Router();

const postData = require("./postDb");

router.get("/", (req, res) => {
  postData
    .get(req)
    .then(posts => {
      res.status(200).json({ posts });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "The posts could not be retrieved." });
    });
});

router.get("/:id", validatePostID, (req, res) => {
  postData
    .getById(req.params.id)
    .then(post => {
      res.status(200).json({ post });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "The post could not be retrieved." });
    });
});

router.delete("/:id", validatePostID, (req, res) => {
  let deletedPost = {};
  postData.getById(req.params.id).then(post => {
    deletedPost = post;
  });

  postData
    .remove(req.params.id)
    .then(() => {
      res.status(200).json({ deletedPost, message: "Post deleted." });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "Post could not be deleted" });
    });
});

router.put("/:id", validatePostID, validatePost, (req, res) => {
  const changes = req.body;
  const id = req.params.id;
  postData
    .update(id, changes)
    .then(count => {
      postData.getById(id).then(updatedPost => {
        res.status(200).json({ updatedPost, message: "Post updated." });
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: "Post could not be updated." });
    });
});

router.post("/:id/posts", validatePost, (req, res) => {
  const postData = req.body;
  postDb
    .insert(postData)
    .then(newPost => {
      res.status(201).json(newPost);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the new post to the database."
      });
    });
});

function validatePost(req, res, next) {
  const body = req.body;
  const text = req.body.text;
  if (!body || !text) {
    res.status(400).json({ errorMessage: "Something went wrong" });
  } else {
    req.post = post;
    next();
  }
}

function validatePostID(req, res, next) {
  const id = req.params.id;
  postData.getById(id).then(post => {
    if (!post) {
      res.status(400).json({ message: "Post not found" });
    } else {
      req.post = post;
      next();
    }
  });
}

module.exports = router;
