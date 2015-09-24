/**
 * Created by ArturK on 2015-09-18.
 */

var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    origId: Number,
    name: String,
    description: String
});
var model  = mongoose.model('Branch', schema, 'branches' );
var manager = {
    get : function(id, callback){
        model.findOne({'_id': id}, callback)
    },
    getAll : function(callback ){
        model.find({}, callback);
    },
    getByOrigId : function(origId, callback){
        model.findOne({'origId': origId}, callback)
    },
    store : function(branch, callback){
        if (branch._id !== undefined){
            model.findOneAndUpdate({'_id': branch._id}, {new: true}, branch, callback);
        }else{
            model.create(branch, callback);
        }
    },
    delete : function(branch, callback){
        model.remove({'_id': branch._id}, callback);
    },
    clear : function(callback){
        model.remove({}, callback);
    }
}

module.exports = manager;