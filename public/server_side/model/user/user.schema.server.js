module.exports = function(mongoose){
    var Schema = mongoose.Schema;

    var userSchema = new Schema({
        username: {type: String, required: true},
        password: {type: String, required: true},
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        stars: [{
            type: Schema.Types.ObjectId,
            ref: 'Star'
        }],
        dateCreated: {type: Date, default: Date.now() }
    }, {collection: 'user'});

    return userSchema;
}