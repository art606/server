var express = require('express');
var router = express.Router();
var accountManager = require('./../managers/accountManager');

router.post("/createAccount", function (req, res) {
    accountManager.createAccount(req.body, function (err, account) {
        if (err) {
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}));
            return;
        }
        res.header("Content-type", "application/json");
        res.end(JSON.stringify(account));
    })
});

router.get("/checkCredentials/:username/:password", function (req, res) {
    accountManager.checkCredentials(req.params.username, req.params.password, function (err, credentials) {
        if (err) {
            res.end(JSON.stringify("Wrong username or password."));
        }
        res.header("Content-type", "application/json");
        res.end(JSON.stringify(credentials));
    })
});

router.get("/getUser/:_id", function (req, res) {
    accountManager.getUserById(req.params._id, function (err, user) {
        if (err) {
            res.end(JSON.stringify("User with given id does not exist."));
            return;
        }
        console.log("in acc manager, getUser, after db", user)
        res.header("Content-type", "application/json");
        res.end(JSON.stringify(user));
    })
})

router.put("/updateAccount/:username", function (req, res) {
    accountManager.updateAccount(req.body.username, req.body, function (err, account) {
        if (err) {
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}));
            return;
        }
        //check if a new user name is the same as the old one
        accountManager.findUserByUserName(account.username, function (err, result) {
            if (err) {
                res.status(err.status || 400);
                res.end(JSON.stringify({error: err.toString()}));
                return;
            }

            if (account.username == result.username){
                res.end(JSON.stringify("New username has to be different from the old one."))
                return;
            }

            res.header("Content-type", "application/json");
            res.end(JSON.stringify(account));
        })

    })
});

router.put("/changePassword/:username/:newPassword/:newPasswordConfrm", function (req, res) {
    if (req.params.newPassword != req.params.newPasswordConfrm) {
        res.end(JSON.stringify("Passwords are not equal."));
        return;
    }
    else {
        accountManager.changePassword(req.params.username, req.params.newPassword, function (err, result) {
            if (err) {
                res.status(err.status || 400);
                res.end(JSON.stringify({error: err.toString()}));
                return;
            }
            res.header("Content-type", "application/json");
            res.end(JSON.stringify(result));
        })
    }

})
module.exports = router

