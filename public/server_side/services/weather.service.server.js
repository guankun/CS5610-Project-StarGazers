module.exports = function(app){
    var request = require("request");

    app.get("/api/weather/current/:lat/:lng", getCurrent);

    function getCurrent(req, res){
        var key = process.env.OWM_KEY || "33929e59ba275e727417e2e334c820c8";
        var lat = req.params.lat;
        var lng = req.params.lng;
        var url = "http://api.openweathermap.org/data/2.5/weather?lat="+ lat +"&lon=" + lng + "&APPID=" + key;
        request({
            uri: url,
            method: "GET",
            timeout: 5000
        }, function(error, response, body) {
            if(!error){
                res.status(200).send(body);
                return;
            }
            res.status(400).send(error);

        });
    }
};
