module.exports = function(app) {
    var mongoose = require('mongoose');
    var uristring =
        process.env.MONGOLAB_URI ||
        process.env.MONGODB_URI ||
        'mongodb://localhost/CS5610_Project';

    mongoose.Promise = global.Promise;

    var conn = mongoose.createConnection(uristring, function (err) {
        if (err) {
            console.log ('ERROR connecting to: ' + uristring + '. ' + err);
        } else {
            console.log ('Succeeded connected to: ' + uristring);
        }
    });

    var models = require("./server_side/model/models.server.js")(mongoose, conn);

    require("./server_side/services/user.service.server.js")(app, models);
    require("./server_side/services/star.service.server.js")(app, models);
};
