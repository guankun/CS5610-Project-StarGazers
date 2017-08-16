module.exports = function(mongoose) {
    var Schema = mongoose.Schema;

    var starSchema = new Schema({
        _user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        type: {
            type: String,
            enum : ['EVENT', 'LOCATION', 'IMAGE', 'YOUTUBE', 'STORY'],
            default: 'EVENT'
        },
        name: {type: String, required: true},
        text: String,
        description: String,
        url: String,
        width: Number,
        height: Number,
        size: Number,
        rows: Number,
        coordinates: JSON,
        dateCreated: {
            type: Date,
            default: Date.now()
        }
    }, {collection: 'star'});

    return starSchema;
}