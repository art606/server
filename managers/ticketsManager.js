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

        model.findOne({'_id': id},function(err, data){

            callback(err,data)
        })
    },
    getAll : function(serviceId,callback ){
        model.find({'serviceId': serviceId}, callback);
    },
    getByOrigId : function(branchOrigId, origId, callback){

        model.findOne({branchOrigId: branchOrigId, origId: origId},function(err, data){
          //  console.log('err',err);
          //  console.log('data',data);
            callback(err,data)
        })
    },
    store : function(ticket, callback){

        if (ticket._id !== null){

            model.findOneAndUpdate({"_id": ticket._id}, {new: true}, ticket, callback);
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