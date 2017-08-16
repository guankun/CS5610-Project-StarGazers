module.exports = function(mongoose, conn){
    var models = {
        'userModel': require('./user/user.model.server.js')(mongoose, conn),
        'starModel': require('./star/star.model.server.js')(mongoose, conn)
        /*,
        'websiteModel': require('./website/website.model.server.js')(mongoose, conn),
        'pageModel': require('./page/page.model.server.js')(mongoose, conn),
        'widgetModel': require('./star/star.model.server.js')(mongoose, conn)*/
    };

    return models;
};
