module.exports = function(app, models){
    var bcrypt = require("bcrypt-nodejs");
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var auth = authorized;
    passport.serializeUser(serializeUser);

    function serializeUser(user, done) {
        done(null, user);
    }

    passport.deserializeUser(deserializeUser);

    function deserializeUser(user, done) {
        models.userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    passport.use('SGuser', new LocalStrategy(localStrategy));

    function localStrategy(username, password, done) {
        models.userModel
            .findUserByUsername(username, password)
                .then(
                    function (user) {
                        if(user && user.username === username && bcrypt.compareSync(password, user.password)){
                            return done(null, user);
                        } else {
                            return done("Wrong username or password! ", false);
                        }
                    },
                    function(err) {
                        if (err) { return done(err); }
                    }
                );
    }

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.send(401);
        } else {
            next();
        }
    }

    // POST Calls.
    app.post('/api/login', passport.authenticate('SGuser'), login);
    app.post('/api/logout',         logout);
    app.post('/api/register',       register);
    app.post('/api/user',     auth, createUser);

    // GET Calls.
    app.get('/api/user/:uid', auth, findUserById);
    /*app.get('/api/user', findUserByUsernameOrCredentials);*/
    app.get('/api/loggedin',       loggedin);
    //app.get('/api/user',     auth, findAllUsers);

    // PUT Calls.
    //app.put('/api/user/:uid', updateUser);
    app.put('/api/user/:uid', auth, updateUser);

    // DELETE Calls.
    //app.delete('/api/user/:uid', deleteUser);
    app.delete('/api/user/:uid', auth, deleteUser);


    function createUser(req,res){
        var user = req.body;
        models.userModel.createUser(user).then(
            function successCallback(newUser){
                res.status(200).send(newUser);
            },
            function errorCallback(error){
                res.status(400).send("User creation failed. " + error);
            }
        );
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function register (req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        models.userModel.createUser(user).then(
            function(user){
                if(user){
                    req.login(user, function(err) {
                        if(err) {
                            res.status(400).send(err);
                        } else {
                            res.json(user);
                        }
                    });
                }
            },
            function (err){
                res.status(400).send(err);
            }
        );
    }


    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function findUserById(req, res) {
        var uid = req.params.uid;
        models.userModel.findUserById(uid).then(
            function successCallback(user){
                if(user){
                    res.status(200).json(user);
                }else{
                    res.status(404).send("User not found by id!");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function findUserByUsernameOrCredentials(req, res){
        if(req.query.password){
            findUserByCredentials(req, res);
        }
        else{
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        models.userModel.findUserByUsername(username).then(
            function successCallback(user){
                if(user){
                    res.status(200).json(user);
                } else{
                    res.status(404).send("User not found by username.");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        models.userModel.findUserByCredentials(username, password).then(
            function successCallback(user){
                if(user){
                    res.status(200).json(user);
                } else{
                    res.status(404).send("Wrong username or password!");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function updateUser(req, res){
        var uid = req.params.uid;
        var newUser = req.body;
        models.userModel.updateUser(uid, newUser).then(
            function successCallback(user){
                if(user){
                    res.status(200).json(user);
                } else{
                    res.status(404).send("User not found when update.");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function deleteUser(req,res) {
        var uid = req.params.id;
        if(uid){
            model
                .userModel
                .deleteUser(uid)
                .then(
                    function (status){
                        res.status(200);
                    },
                    function (error){
                        res.status(400).send(error);
                    }
                );
        } else{
            // Precondition Failed. Precondition is that the user exists.
            res.status(412);
        }
    }
}

