module.exports = function(app, models){

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../uploads' });
    // POST Calls.
    app.post('/api/user/:userId/star', createStar);
    app.post('/api/upload', upload.single('file'), uploadImage);

    // GET Calls.
    app.get('/api/user/:userId/star', findAllStarsForUser);
    app.get('/api/star/:starId', findStarById);
    app.get('/api/star', findAllStars);

    // PUT Calls.
    app.put('/api/star/:starId', updateStar);

    // DELETE Calls.
    app.delete('/api/star/:starId', deleteStar);

    function createStar(req, res) {
        var uid = req.params.userId;
        var star = req.body;
        var newStar = {
            _user: star._user,
            type: star.type,
            name: star.name,
            text: star.text,
            placeholder: star.placeholder,
            description: star.description,
            url: star.url,
            width: star.width,
            height: star.height,
            rows: star.rows,
            size: star.size,
            coordinates: star.coordinates
        };
        models.starModel.createStar(uid, newStar).then(
            function successCallback(newStar){
                models.userModel.addStarToUser(newStar._user, newStar._id);
                res.status(200).send(newStar);
            },
            function errorCallback(error){
                res.status(500).send("Star creation failed. " + error);
            }
        );
    }

    function findAllStarsForUser(req, res) {
        var userId = req.params.userId;
        models.starModel.findAllStarsForUser(userId).then(
            function successCallback(stars){
                res.status(200).send(stars);
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function findAllStars(req, res){
        models.starModel.findAllStars().then(
            function successCallback(stars){
                res.status(200).send(stars);
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function findStarById(req, res){
        var sid = req.params.starId;
        models.starModel.findStarById(sid).then(
            function successCallback(star){
                if(star){
                    res.status(200).json(star);
                }else{
                    res.status(404).send("Star not found by id!");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function updateStar(req, res){
        var sid = req.params.starId;
        var newStar = req.body;

        models.starModel.updateStar(sid, newStar).then(
            function successCallback(star){
                if(star){
                    res.status(200).json(star);
                } else{
                    res.status(404).send("Star not found when update.");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function deleteStar(req, res){
        var sid = req.params.starId;
        var uid = null;

        models.starModel.findStarById(sid).then(
            function successCallback(star){
                if(star){
                    uid = star.user;
                    if(uid){
                        models.userModel.removeStarFromUser(uid, sid);
                    }
                    if(sid){
                        models.starModel.deleteStar(sid).then(
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
                } else{
                    res.status(404).send("Star not found when delete.");
                }
            },
            function errorCallback(error){
                res.status(400).send(error);
            }
        );
    }

    function uploadImage(req, res){
        var userId      = req.body.userId;
        var starId    = req.body.starId;
        var myFile      = req.file;

        if(myFile == null || myFile == undefined){
            res.status(400).send("No file selected!");
            return;
        }

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        var newUrl = '/project/uploads/'+filename;

        if(starId == -1){ // create new star
            res.status(200).send(newUrl);
        } else{
            models.starModel.findStarById(starId).then(
                function successCallback(star){
                    if(star){
                        var newStar = star;
                        newStar.url = newUrl;
                        models.starModel.updateStar(starId, newStar).then(
                            function successCallback(star){
                                if(star){
                                    res.status(200).send(newUrl);
                                } else{
                                    res.status(404).send("Star not found when upload image.");
                                }
                            },
                            function errorCallback(error){
                                res.status(400).send(error);
                            }
                        );
                    }else{
                        res.status(404).send("Star not found by id when upload image!");
                    }
                },
                function errorCallback(error){
                    res.status(400).send(error);
                }
            );
        }
    }

};
