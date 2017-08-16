module.exports = function(mongoose, conn) {
    var starSchema = require('./star.schema.server.js')(mongoose);
    var starModel = conn.model('Star', starSchema);

    var api = {
        'createStar': createStar,
        'findAllStarsForUser': findAllStarsForUser,
        'findAllStars' : findAllStars,
        'findStarById': findStarById,
        'updateStar': updateStar,
        'deleteStar': deleteStar
    }
    return api;

    function createStar(userId, star){
        var newStar = {
            _user: userId,
            type: star.type,
            name: star.name,
            text: star.text,
            placeholder: star.placeholder,
            description: star.description,
            url: star.url,
            width: star.width,
            height: star.height,
            rows: 0,
            size: star.size ? star.size : 10,
            dateCreated: Date.now()
        }
        return starModel.create(newStar);
    }

    function findAllStarsForUser(userId){
        return starModel.find({_user : userId});
    }

    function findAllStars(){
        return starModel.find({});
    }

    function findStarById(starId){
        return starModel.findById(starId);
    }

    function updateStar(starId, star){
        return starModel.update(
            {   _id: starId
            }, {
                _user: star._user,
                type: star.type,
                name: star.name,
                text: star.text,
                placeholder: star.placeholder,
                description: star.description,
                url: star.url,
                width: star.width ? star.width : 0,
                height: star.height ? star.height : 0,
                rows: star.rows ? star.rows : 0,
                size: star.size ? star.size : 0,
                dateCreated: star.dateCreated
            }
        );
    }

    function deleteStar(starId){
        return starModel.remove({
            _id : starId
        });
    }
}