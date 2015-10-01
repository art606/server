var mongoose = require('mongoose');
var passwordHash = require('password-hash');
var schema = new mongoose.Schema({
    username: String,
    password: String,
    emailAddress: String,
    firstName: String,
    lastName: String,
    properties: {},
    created: {type: Date, default: Date.now},
    updated: Date
});

var model = mongoose.model('Account', schema, 'account');

clearPassword = function (storedAccount) {
    var hashedpassword = passwordHash.generate(storedAccount.password);
    storedAccount.password = hashedpassword;
    return storedAccount;
}

convertToUser = function(storedAccount){
    var userToReturn ={
        username: storedAccount.username,
        password: storedAccount.password,
        emailAddress: storedAccount.emailAddress,
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

    checkCredentials: function (username, password, callback) {
        model.findOne({'username': username, 'password': password}, function (err, storedAccount) {
            if (storedAccount == null  || storedAccount == undefined) {
                callback(false);
            }
            else {
                callback(true);
            }

        })
    },
    isUsernameAvailable: function (username, callback) {
        model.findOne({'username': username}, function (err, storedAccount) {
            if (storedAccount === null || storedAccount === undefined) {
                callback(true);
            }
            else {
                callback(false);
            }
        })
    },
    getUserByUsername: function (username, callback) {
        model.findOne({'username': username}, function (err, storedAccount) {
            callback(err, convertToUser(storedAccount));
        });
    },

    getUserById: function (id, callback) {
        model.findOne({'_id': id}, function (err, storedAccount) {
            callback(err, convertToUser(storedAccount));
        });
    },

    updateAccount: function (username, account, callback) {
        //TODO//
        model.findOneAndUpdate({'username': username}, account, {new: true}, callback);
    },
    getAccount: function (username, callback) {
        model.findOne({'username': username}, function (err, storedAccount) {
            callback(err, clearPassword(storedAccount));
        });
    },


    changePassword: function (username, password, newpassword, callback) {
        //TODO Pobranie konta dla username/password
        var foundAccount = model.findOne({'username': username, 'password': password}, function (err, storedAccount) {
            return storedAccount;
        })
        console.log("in acc manager, found account for username and password", foundAccount)
        model.findOneAndUpdate({'_id': foundAccount._id}, {'password': newpassword}, {new: true}, callback);
    }
}

module.exports = manager;
