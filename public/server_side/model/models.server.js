module.exports = function(mongoose, conn){
    var models = {
        'userModel': require('./user/user.model.server.js')(mongoose, conn),
        'starModel': require('./star/star.model.server.js')(mongoose, conn)
    };

    return models;
};
