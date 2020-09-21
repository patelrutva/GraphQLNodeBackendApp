const mongo = require('mongoose');
const Schema = mongo.Schema;

const VehicleModelchema = new Schema({
    Model_ID: {
        type     : Number,
        required : true,
        unique   : true
    },
    Model_Name: {
        type     : String,
        required : true
    },
   VehicleMake: { type: Schema.Types.ObjectId, ref: 'VehicleMake' }
});

module.exports = mongo.model('VehicleModel', VehicleModelchema);