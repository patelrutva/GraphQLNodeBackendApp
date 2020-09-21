const Vehicles = require('../mongo-models/AllVehicleMakes');
const VehicleTypes = require('../mongo-models/VehicleTypesForMakeIds');
const VehicleModels = require('../mongo-models/ModelsForMake');
const { default: Axios } = require("axios");
const xml2js = require('xml2js');

function xml2json(data){
    var details = {};
    ///--- Parse all the data from xml to json starts ---///
    xml2js.parseString(data,{ explicitArray : false }, function (err, result) {    
        if (err) return {};
        details = result.Response.Results;
    });
    return details;
    ///--- Parse all the data from xml to json ends ---///
};

////-------------- INITIALIZE FUNTION ADDING VEHICLE MODELS --------------////
const addVehicleModels = async() => {
    ///--- FUNCTION ADD VEHICEL MODELS STARTS ---///
    
    //---- Getting all vehicle makes to find their vehicle models ---//
    const all_vehicle_makes = await Vehicles.find({},function(err, response) {
        if (err) { }
        return response;
    });

    //---- Getting all vehicle model details using vehicle make_id ---//
    all_vehicle_makes.forEach( async(vehicle_make) => { 
        const allvehicleModelsxmlurl= "http://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeId/"+vehicle_make.Make_ID+"?format=xml";
        try{
            return await Axios.get(allvehicleModelsxmlurl, {}).then((api_response) => {
                const vehicle_modellist = [];

                const vehicle_model_json_list = xml2json(api_response.data).ModelsForMake;

                if(vehicle_model_json_list !== undefined) {
                    if (vehicle_model_json_list.length == undefined){ //if it is just one object
                    vehicle_modellist.push(vehicle_model_json_list);
                    }else{}

                    //---- looping all the vehicletypes to add it ine the datastore ---//
                    for(var k in vehicle_modellist) { 
                        var vehicle_model = vehicle_modellist[k];
                        vehicle_modelObject = {
                            $set: {Model_ID: vehicle_model.Model_ID, Model_Name: vehicle_model.Model_Name, VehicleMake: vehicle_make._id} //reference of Vehicle Make
                        };

                        //---- If vehicle Model already exist just update the Vehicle Make Object---//
                        VehicleModels.findOneAndUpdate({"Model_ID": vehicle_model.Model_ID},  vehicle_modelObject, {upsert: true}, function(err, doc) {
                            if (err) {  }
                            console.log("Record Added/Updated for Model_ID:: " + vehicle_make.Make_ID);
                        });
                    }
                }else{}
            }).catch((response) => {} );
        } catch (error) { }
    })
    ///--- FUNCTION ADD VEHICEL MODELS ENDS ---///
};
////-------------- END OF FUNTION ADDING VEHICLE TYPES --------------////

module.exports = {
    addVehicleModels: addVehicleModels()
};