/**
 * Created by ArturK on 2015-09-18.
 */

var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    origId: Number,
    branchId : String,
    branchOrigId: Number,
    subServiceOrigId : Number,
    name: String,
    description: String,
    letter : String
});
var model  = mongoose.model('Service', schema, 'service');
var manager = {
    get : function(_id, callback){
        model.findOne({'_id': _id}, callback);
    },
    getBranchServices : function(branchId, callback){
        model.find({'branchId': branchId}, callback);
    },
    getByOrigId : function(branchOrigId,origId,subServiceOrigId,callback){
        model.findOne({'origId': origId,'branchOrigId' :branchOrigId ,'subServiceOrigId' : subServiceOrigId}, callback)
},
    store : function(service, callback){
        if (service._id !== undefined){
            model.findOneAndUpdate({'_id': service._id}, {new: true}, service, callback);
        }else{
            model.create(service, callback);
        }
    },
    delete : function(service, callback){
        model.remove({'_id': service._id}, callback);
    },
    clear : function(callback){
        model.remove({}, callback);
    }
}

module.exports = manager;