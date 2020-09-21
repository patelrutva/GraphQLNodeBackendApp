const graphql = require('graphql');
const { ObjectId } = require('mongodb');

const Vehicles = require('../mongo-models/AllVehicleMakes');
const VehicleTypes = require('../mongo-models/VehicleTypesForMakeIds');
const VehicleModels = require('../mongo-models/ModelsForMake');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull
} = graphql;

////-------------- INITIALIZE QueryType OF VEHICLE MAKES --------------////
const VehicleMakeQueryType = new GraphQLObjectType({
    name: 'VehicleMakes',
    fields: () => ({
        Make_ID: {
            type: GraphQLID
        },
        Make_Name: {
            type: GraphQLString
        },
        VehicleTypes: {
            type: new GraphQLList(VehicleQueryType),
            resolve(parent) {
                return VehicleTypes.find({VehicleMake : parent._id})
            }
        },
        VehicleModels: {
            type: new GraphQLList(VehicleModelQueryType),
            resolve(parent) {
                return VehicleModels.find({VehicleMake : parent._id})
            }
        }
    })
});
////-------------- END OF VEHICLE MAKES QueryType--------------////

////-------------- INITIALIZE QueryType OF VEHICLE TYPES --------------////
const VehicleQueryType = new GraphQLObjectType({
    name: 'VehicleTypes',
    fields: () => ({
        VehicleTypeId: {
            type: GraphQLID
        },
        VehicleTypeName: {
            type: GraphQLString
        }
    })
});

const VehicleOnlyType = new GraphQLObjectType({
    name: 'VehicleoNLY',
    fields: () => ({
        Make_ID: {
            type: GraphQLID
        },
        Make_Name: {
            type: GraphQLString
        }
    })
});
////-------------- END OF VEHICLE TYPES QueryType--------------////

////-------------- INITIALIZE QueryType OF VEHICLE MODELS --------------////
const VehicleModelQueryType = new GraphQLObjectType({
    name: 'VehicleModels',
    fields: () => ({
        Model_ID: {
            type: GraphQLID
        },
        Model_Name: {
            type: GraphQLString
        },
        VehicleMake: {
            type: VehicleMakeQueryType,
        }
    })
});
////-------------- END OF VEHICLE MODELS QueryType--------------////

////-------------- INITIALIZE GRAPHQL Queries --------------////
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        VehicleByMakeIds: {
            type: VehicleMakeQueryType,
            args: {
                Make_ID: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                return Vehicles.findOne({Make_ID : args.Make_ID});
            }
        },
        VehicleTypesForMakeIds: {
            type: new GraphQLList(VehicleQueryType),
            args: {
                Make_ID: {
                    type: GraphQLID
                },
                VehicleTypeId: {
                    type: GraphQLID
                },
                VehicleTypeName: {
                    type: GraphQLString
                }
            },
            async resolve (parent, args) {
                if(args.Make_ID){
                    var vehicle_make_object = await Vehicles.findOne({Make_ID: args.Make_ID});
                    return VehicleTypes.find().or([{VehicleMake: {$elemMatch: {$eq : vehicle_make_object._id}}} , {VehicleTypeId: args.VehicleTypeId}, {VehicleTypeName : args.VehicleTypeName}]);
                }
                return VehicleTypes.find().or([{VehicleTypeId: args.VehicleTypeId}, {VehicleTypeName : args.VehicleTypeName}]);
            }
        },
        VehicleModelsForMakeIds:{
            type: VehicleModelQueryType,
            args: {
                Model_ID:{
                    type: new GraphQLNonNull(GraphQLID)
                }
            },
            async resolve (args) {
                return VehicleModels.findOne({Model_ID: args.Model_ID}).populate("VehicleMake");
            }
        },
        AllVehicleMakes: {
            type: new GraphQLList(VehicleMakeQueryType),
            resolve(parent, args) {
                return Vehicles.find({});
            }
        },
        AllVehicleTypes: {
            type: new GraphQLList(VehicleQueryType),
            resolve(parent, args) {
                return VehicleTypes.find({});
            }
        },
        AllVehicleModels: {
            type: new GraphQLList(VehicleModelQueryType),
            resolve(parent, args) {
                return VehicleModels.find({}).populate("VehicleMake");
            }
        }
    }
});
////-------------- END OF GRAPHQL Queries --------------////

module.exports = new GraphQLSchema({
    query: RootQuery
});