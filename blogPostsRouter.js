const express = require("express");
const router = express.Router();

const {BlogPosts} = require("./models");

function lorem () {
    return (
    "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod " +
    "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, " +
    "quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo " +
    "consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse " +
    "cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non " +
    "proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  );
}

BlogPosts.create("10 things -- you won't believe #4", lorem(), "Billy Bob");
BlogPosts.create("Lions and tigers and bears oh my", lorem(), "Lefty Lil");

router.get("/", (req, res) => {
    res.json(BlogPosts.get());
});

router.post("/", (req, res) => {
    const requiredFields = ["title", "content", "author"];
    for (let i = 0; i < requiredFields.length; i ++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(
        req.body.title,
        req.body.content,
        req.body.author
    );
    res.status(201).json(item);
});

router.put("/:id", (req, res) => {
    const requiredFields = ["id", "title", "content", "author", "publishDate"];
    for (let i = 0, i < requiredFields.length; i ++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }
    if (req.params.id !== req.body.id) {
        const message = `Request path id (${req.params.id
        }) and request body id ``(${req.body.id}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }

    console.log(`Updating blog post with id \`${req.params.id}\``);
    BlogPosts.update({
       id: req.params.id,
       title: req.body.title,
       content: req.body.content,
       author: req.body.author,
       publishDate: req.body.publishDat
    });
    res.status(204).end();

});

router.delete("/:id", (req, res) => {
    BlogPosts.delete(req.params.id);
    console.log(`Deleted blog post with id \`${req.params.ID}\``);
    res.status(204).end();
});

module.exports = router;

