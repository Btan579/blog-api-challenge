"use strict";

const express = require('express');
const mongoose = require("mongoose");
const morgan = require('morgan');
mongoose.Promise = global.Promise;

const {
    PORT,
    DATABASE_URL
} = require("./config");

const {
    blogPost,
    Author
} = require("./models");

const app = express();

app.use(morgan('common'));
app.use(express.json());

app.get('/authors', (req, res) => {
    Author
        .find()
        .then(authors => {
            res.json(authors.map(author => {
                return {
                    id: author._id,
                    name: `${author.firstName} ${author.lastName}`,
                    userName: author.userName
                };
            }));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'something went  wrong'
            });
        });
});


app.post('/authors', (req, res) => {
    const requiredFields = ['firstName', 'lastName', 'userName'];
    requiredFields.forEach(field => {
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    });

    Author
        .findOne({
            userName: req.body.userName
        })
        .then(author => {
            if (author) {
                const message = `Username already taken`;
                console.error(message);
                return res.status(400).send(message);
            } else {
                Author
                    .create({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        userName: req.body.userName
                    })
                    .then(author => res.status(201).json({
                        _id: author.id,
                        name: `${author.firstName} ${author.lastName}`,
                        userName: author.userName
                    }))
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({
                            error: 'Something went wrong'
                        });
                    });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'something went really wrong'
            });
        });
});


app.put('/authors/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        res.status(400).json({
            error: 'Request path id and request body id values must match'
        });
    }

    const updated = {};
    const updateableFields = ['firstName', 'lastName', 'userName'];
    updateableFields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field];
        }
    });

    Author
        .findOne({
            userName: updated.userName || '',
            _id: {
                $ne: req.params.id
            }
        })
        .then(author => {
            if (author) {
                const message = `Username already taken`;
                console.error(message);
                return res.status(400).send(message);
            } else {
                Author
                    .findByIdAndUpdate(req.params.id, {
                        $set: updated
                    }, {
                        new: true
                    })
                    .then(updatedAuthor => {
                        res.status(200).json({
                            id: updatedAuthor.id,
                            name: `${updatedAuthor.firstName} ${updatedAuthor.lastName}`,
                            userName: updatedAuthor.userName
                        });
                    })
                    .catch(err => res.status(500).json({
                        message: err
                    }));
            }
        });
});


app.delete('/authors/:id', (req, res) => {
    blogPost
        .remove({
            author: req.params.id
        })
        .then(() => {
            Author
                .findByIdAndRemove(req.params.id)
                .then(() => {
                    console.log(`Deleted blog posts owned by and author with id \`${req.params.id}\``);
                    res.status(204).json({
                        message: 'success'
                    });
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'something went really wrong'
            });
        });
});


app.get('/posts', (req, res) => {
    blogPost
        .find()
        .then(posts => {
            res.json(posts.map(post => {
                return {
                    id: post._id,
                    author: post.authorName,
                    content: post.content,
                    title: post.title
                };
            }));
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'something went terribly wrong'
            });
        });
});


app.get("/posts/:id", (req, res) => {
    blogPost
        .findById(req.params.id)
        .then(blogpost => {
            res.json({
                id: post._id,
                author: post.authorName,
                content: post.content,
                title: post.title,
                comments: post.comments
            })
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                message: "Internal server error"
            });
        });
});


app.post('/posts', (req, res) => {
    const requiredFields = ['title', 'content', 'author_id'];
    requiredFields.forEach(field => {
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    });

    Author
        .findById(req.body.author_id)
        .then(author => {
            if (author) {
                blogPost
                    .create({
                        title: req.body.title,
                        content: req.body.content,
                        author: req.body.id
                    })
                    .then(blogPost => res.status(201).json({
                        id: blogpost.id,
                        author: `${author.firstName} ${author.lastName}`,
                        content: blogpost.content,
                        title: blogpost.title,
                        comments: blogpost.comments
                    }))
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({
                            error: 'Something went wrong'
                        });
                    });
            } else {
                const message = `Author not found`;
                console.error(message);
                return res.status(400).send(message);
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: 'something went really awry'
            });
        });
});


app.put("/posts/:id", (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
        const message =
            `Request path id (${req.params.id}) and request body id ` +
            `(${req.body.id}) must match`;
        console.error(message);
        return res.status(400).json({
            message: message
        });
    }



    const toUpdate = {};
    const updateableFields = ["title", "content"];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });


    blogPost
        .findByIdAndUpdate(req.params.id, {
            $set: toUpdate
        }, {
            new: true
        })
        .then(toUpdateblogpost => res.status(200).json({
            id: toUpdateblogpost.id,
            title: toUpdateblogpost.title,
            content: toUpdateblogpost.content
        }))
        .catch(err => res.status(500).json({
            message: "Internal server error"
        }));
});


app.delete("/posts/:id", (req, res) => {
    blogPost
        .findByIdAndRemove(req.params.id)
        .then(() => {
            console.log(`Deleted blog post with id \`${req.params.id}\``);
            res.status(204).end();
        });
});




// Server
app.use("*", function (req, res) {
    res.status(404).json({
        message: "Not Found"
    });
});


let server;

function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                    console.log(`Your app is listening on port ${port}`);
                    resolve();
                })
                .on("error", err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}


function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log("Closing server");
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}


if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}


module.exports = {
    app,
    runServer,
    closeServer
};