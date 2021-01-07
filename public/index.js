require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var sha256 = require('sha256');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

var databaseURI = 'mongodb://localhost:27017/MyDb';

var app = express();

// Configure app
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Starting HTTP server
var httpServer = require('http').createServer(app);
httpServer.listen(8080, function () {
    console.log('Server is running on port 8080.');
});

// Serving static files
app.use('/', express.static(path.join(__dirname, '/public')));

// Authentication middleware
function authenticateToken(req, res, next) {
    const token = req.cookies['token'];
    if (token == null) {
        return res.sendStatus(401);
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
        if (err) {
            return res.sendStatus(401);
        }
        req.user = user;
        next();
    });
}

// POST Create `CT
app.post('/api/admin/post/crud',
    authenticateToken,
    body('title').not().isEmpty().withMessage("filed `title` is not valid."),
    body('content').not().isEmpty().withMessage("filed `content` is not valid."),
    function (req, res) {
        if (Object.keys(req.body).length != 2) {
            res.status(400).json({ message: "Request Length should be 2" });
            return;
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ "message": errors.array()[0]['msg'] });
        }
        let titleSent = req.body.title;
        let contentSent = req.body.content;
        let userId;
        MongoClient.connect(databaseURI, function (err, db) {
            db.collection('Users', function (err, users) {
                users.findOne({ "email": req.user.email }, function (err, result) {
                    if (err) {
                        res.sendStatus(401);
                    } else {
                        userId = result['id'];
                        db.collection('Posts', function (err, posts) {
                            posts.find({}).sort({ "id": -1 }).limit(1).toArray(function (err, sel) {
                                const newId = sel[0]['id'] + 1;
                                posts.find({}).toArray(function (err, arr) {
                                    posts.insert({ "id": newId, "title": titleSent, "content": contentSent, "created_by": userId, "created_at": new Date().toString() });
                                    res.status(201).json({ "id": newId });
                                });
                            });
                        });
                    }
                });
            });
        });
    });

// PUT Update `CT
app.put('/api/admin/post/crud/:id/',
    authenticateToken,
    body('title').not().isEmpty().withMessage("filed `title` is not valid."),
    body('content').not().isEmpty().withMessage("filed `content` is not valid."),
    function (req, res) {
        if (Object.keys(req.body).length != 2) {
            res.status(400).json({ message: "Request Length should be 2" });
            return;
        }
        if (!req.params['id'].match('\\d+')) {
            res.status(400).json({ message: "url id is not valid" });
            return;
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ "message": errors.array()[0]['msg'] });
        }
        let postId = +req.params['id'];
        let titleSent = req.body.title;
        let contentSent = req.body.content;
        let reqEmail = req.user.email;
        MongoClient.connect(databaseURI, function (err, db) {
            db.collection('Users', function (err, users) {
                users.findOne({ "email": reqEmail }, function (err, result) {
                    if (err) {
                        res.status(401).json({"message": "permission denied"});
                    } else {
                        userId = result['id'];
                        db.collection('Posts', function (err, posts) {
                            posts.findOne({ "id": postId }, function (err, result) {
                                if (err) {
                                    res.sendStatus(404);
                                } else if (result['created_by'] != userId) {
                                    res.status(401).json({ "message": "permission denied." });
                                } else {
                                    result['title'] = titleSent;
                                    result['content'] = contentSent;
                                    posts.updateOne({ "id": postId }, result, function (err, u) {
                                        res.sendStatus(204);
                                    });
                                }
                            });
                        });
                    }
                });
            });
        });
    });

// DELETE Delete 'C
app.delete('/api/admin/post/crud/:id/',
    authenticateToken,
    function (req, res) {
        if (!req.params['id'].match('\\d+')) {
            res.status(400).json({ message: "url id is not valid" });
            return;
        }
        let postId = +req.params['id'];
        let reqEmail = req.user.email;
        MongoClient.connect(databaseURI, function (err, db) {
            db.collection('Users', function (err, users) {
                users.findOne({ "email": reqEmail }, function (err, result) {
                    if (err) {
                        res.status(401).json({"message": "permission denied"});
                    } else {
                        userId = result['id'];
                        db.collection('Posts', function (err, posts) {
                            posts.findOne({ "id": postId }, function (err, result) {
                                if (err) {
                                    res.sendStatus(404);
                                } else if (result['created_by'] != userId) {
                                    res.status(401).json({ "message": "permission denied." });
                                } else {
                                    posts.deleteOne({ "id": postId }, result, function (err, u) {
                                        res.sendStatus(204);
                                    });
                                }
                            });
                        });
                    }
                });
            });
        });
    });

// GET READ without id `C
app.get('/api/admin/post/crud',
    authenticateToken,
    function (req, res) {
        let reqEmail = req.user.email;
        MongoClient.connect(databaseURI, function (err, db) {
            db.collection('Users', function (err, users) {
                users.findOne({ "email": reqEmail }, function (err, result) {
                    if (err) {
                        res.status(401).json({"message": "permission denied"});
                    } else {
                        userId = result['id'];
                        db.collection('Posts', function (err, posts) {
                            posts.find({ "created_by": userId }).project({"_id": 0}).toArray(function (err, result) {
                                res.status(200).json({ "posts": result });
                            });
                        });
                    }
                });
            });
        });
    });

// GET READ with id `CT
app.get('/api/admin/post/crud/:id/',
    authenticateToken,
    function (req, res) {
        if (!req.params['id'].match('\\d+')) {
            res.status(400).json({ message: "url id is not valid" });
            return;
        }
        let postId = +req.params['id'];
        let reqEmail = req.user.email;
        MongoClient.connect(databaseURI, function (err, db) {
            db.collection('Users', function (err, users) {
                users.findOne({ "email": reqEmail }, function (err, result) {
                    if (err) {
                        res.status(401).json({"message": "permission denied."});
                    } else {
                        let userId = result['id'];
                        db.collection('Posts', function (err, posts) {
                            posts.findOne({ "id": postId }, function (err, awn) {
                                if (awn == null) {
                                    res.status(404).json({"message": "Not Found"});
                                } else if (awn['created_by'] != userId) {
                                    res.status(401).json({"message": "permission denied"});
                                } else {
                                    delete awn['_id']
                                    res.status(200).json({ "post": awn });
                                }
                            });
                        });
                    }
                });
            });
        });
    });

// POST Sign up `CT
app.post('/api/signup',
    body('email').isEmail().normalizeEmail().withMessage('filed `email` is not valid'),
    body('password').isLength({ min: 5 }).withMessage('filed `password`.length should be gt 5'),
    function (req, res) {
        // Validation
        if (Object.keys(req.body).length != 2) {
            res.status(400).json({ "message": "Request Length should be 2" });
            return;
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ "message": errors.array()[0]['msg'] });
        }
        const emailSent = req.body.email;
        const passwordSent = req.body.password;
        MongoClient.connect(databaseURI, function (err, db) {
            db.collection('Users', function (err, users) {
                users.findOne({ "email": emailSent }, function (err, result) {
                    if (result != null) {
                        res.status(409).json({ "message": "email already exist." });
                    } else {
                        users.find({}).toArray(function (err, prev) {
                            users.insert({ "id": prev.length + 1, "email": emailSent, "password": sha256(passwordSent), "Date": new Date().toString() });
                            res.status(201).json({ "message": "user has been created." });
                        });
                    }
                });
            });
        });
    });

// GET Posts index `CT
app.get('/api/post',
    function (req, res) {
        MongoClient.connect(databaseURI, function (err, db) {
            db.collection('Posts', function (err, posts) {
                posts.find({}).project({ "_id": 0 }).toArray(function (err, items) {
                    res.status(200).json({ "posts": items });
                });
            });
        });
    });

// POST Sign in `CT
app.use('/api/signin',
    body('email').isEmail().normalizeEmail().withMessage('filed `email` is not valid'),
    body('password').not().isEmpty().withMessage("filed password is not valid"),
    function (req, res) {
        if (req.method != 'POST') {
            res.status(405).json({ "message": "Only `Post` Method is Valid" })
            return
        }
        if (Object.keys(req.body).length != 2) {
            res.status(400).json({ "message": "Request Length should be 2" });
            return;
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ "message": errors.array()[0]['msg'] });
        }
        const emailSent = req.body.email;
        const passwordSent = req.body.password;
        MongoClient.connect(databaseURI, function (err, db) {
            db.collection('Users', function (err, users) {
                users.find({ "email": emailSent }).toArray(function (err, items) {
                    if (items.length == 0 || items[0]['password'] != sha256(passwordSent)) {
                        res.status(401).json({ "message": "wrong email or password." });
                    } else {
                        const userObject = { "email": emailSent };
                        const accessToken = jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET);
                        res.cookie("token", accessToken);
                        res.status(201).json({ "token": accessToken });
                    }
                });
            });
        });
    });
