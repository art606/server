
var mongoose = require('mongoose');
var schema = new mongoose.Schema({
    username: String,
    password: String,
    emailAddress: String,
    firstName: String,
    lastName: String,
    properties: {},
    created: {type : Date, default: Date.now},
    updated: {type : Date, default: Date.now}
});

var model  = mongoose.model('Account', schema, 'account' );
var manager = {
    createAccount : function(account, callback){
        console.log("In accManager, create Account", account );
        model.create(account, callback);
    },

    checkCredentials: function(username, password, callback){
        model.findOne({'username': username, 'password': password}, callback)
    },
    findUserByUserName: function(username, callback){
        model.findOne({'username': username}, callback);
    },

    getUserById: function(id, callback){
        model.findOne({'_id': id}, callback);
    },

    updateAccount: function(username, account, callback){
       model.findOneAndUpdate({'username': username }, account, {new: true}, callback);
    },

    changePassword: function(username, newpassword, callback){
        model.findOneAndUpdate({'username': username},{'password': newpassword}, {new: true}, callback);
    }
}

module.exports = manager;