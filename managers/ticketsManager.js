/**
 * Created by ArturK on 2015-09-18.
 */


var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    branchId: String,
    serviceId: String,
    origId: Number,
    branchOrigId: Number,
    serviceOrigId: Number,
    serviceSubOrigId: Number,
    status: String,
    letter: String,
    number: Number
})
var model  = mongoose.model('Ticket', schema, 'tickets' );
var manager = {
    get : function(id, callback){
        model.findOne({'_id': id}, callback)
    },
    getAll : function(serviceId,callback ){
        model.find({'serviceId': serviceId}, callback);
    },
    getByOrigId : function(branchId, origId, callback){
        model.findOne({'branchId': branchId,'origId': origId}, callback)
    },
    store : function(ticket, callback){
        if (ticket._id !== undefined){
            model.findOneAndUpdate({'_id': ticket._id}, {new: true}, ticket, callback);
        }else{
            model.create(ticket, callback);
        }
    },
    delete : function(ticket, callback){
        model.remove({'_id': ticket._id}, callback);
    },
    clear : function(callback){
        model.remove({}, callback);
    }
}

module.exports = manager;