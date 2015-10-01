var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var schema = new mongoose.Schema({
    emailAddress: String,
    password: String,
    firstName: String,
    lastName: String,
    properties: {},
    created: {type: Date, default: Date.now},
    updated: Date
});

var model = mongoose.model('Account', schema, 'account');

clearPassword = function (storedAccount) {
    if(storedAccount !=null) {
        var hashedpassword = passwordHash.generate(storedAccount.password);
        storedAccount.password = hashedpassword;
    }
    return storedAccount;
}

convertToUser = function(storedAccount){
    var userToReturn ={
        emailAddress: storedAccount.emailAddress,
        password: storedAccount.password,
        firstName: storedAccount.firstName,
        lastName: storedAccount.lastName
    }
    return userToReturn;
}
var manager = {
    createAccount: function (account, callback) {
        model.create(account, function (err, storedAccount) {
            callback(err, clearPassword(storedAccount));
        });
    },

    checkCredentials: function (emailAddress, password, callback) {
        model.findOne({'emailAddress': emailAddress, 'password': password}, function (err, storedAccount) {
            if (storedAccount == null  || storedAccount == undefined) {
                callback(false);
            }
            else {
                callback(true);
            }

        })
    },
    isEmailAddressAvailable: function (emailAddress, callback) {
        model.findOne({'emailAddress': emailAddress,}, function (err, storedAccount) {
            if (storedAccount === null || storedAccount === undefined){
                callback(true);
            }
            else {
                callback(false);
            }
        })
    },

    getUserByEmailAddress: function (emailAddress, callback) {
        model.findOne({'emailAddress': emailAddress}, function (err, storedAccount) {
            console.log(storedAccount)
            callback(err, convertToUser(storedAccount));
        });
    },

    getUserById: function (id, callback) {
        model.findOne({'_id': id}, function (err, storedAccount) {
            callback(err, convertToUser(storedAccount));
        });
    },

    updateAccount: function (emailAddress, account, callback) {
        //TODO//
        model.findOneAndUpdate({'emailAddress': emailAddress}, account, {new: true}, callback);
    },
    getAccount: function (emailAddress, callback) {
        model.findOne({'emailAddress': emailAddress}, function (err, storedAccount) {
            callback(err, clearPassword(storedAccount));
        });
    },


    changePassword: function (emailAddress, password, newpassword, callback) {
        //TODO Pobranie konta dla username/password
        var foundAccount = model.findOne({'username': emailAddress, 'password': password}, function (err, storedAccount) {
            return storedAccount;
        })
        model.findOneAndUpdate({'_id': foundAccount._id}, {'password': newpassword}, {new: true}, callback);
    }
}

module.exports = manager;
