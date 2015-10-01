var express = require('express');
var router = express.Router();
var accountManager = require('./../managers/accountManager');

router.get("/account/:username", function (req, res) {
    accountManager.getAccount(req.params.username, function (err, user) {
        if (err) {
            res.status(400);
            res.end(JSON.stringify("Failed to find account for username."));
            return;
        }
        res.header("Content-type", "application/json");
        res.end(JSON.stringify(user));
    })
})
router.post("/account", function (req, res) {

    accountManager.createAccount(req.body, function (err, account) {
        if (err) {
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}));
            return;
        }
        res.header("Content-type", "application/json");
        res.end(JSON.stringify(account));
    })

})
router.post("/isUsernameAvailable", function (req, res) {
    accountManager.isUsernameAvailable(req.body.username, function (isAvailable) {
        res.header("Content-type", "application/json");
        res.end(JSON.stringify({username: req.body.username, available: isAvailable}));
    })
});
router.post("/checkCredentials", function (req, res) {
    accountManager.checkCredentials(req.body.username, req.body.password, function (result) {

        res.header("Content-type", "application/json");
        res.end(JSON.stringify(result));
    })
});

router.get("/user/:username", function (req, res) {
    accountManager.getUserByUsername(req.params.username, function (err, user) {
        if (err) {
            res.status(400);
            res.end(JSON.stringify("User with given id does not exist."));
            return;
        }
        res.header("Content-type", "application/json");
        res.end(JSON.stringify(user));
    })
})

router.put("/account/:username", function (req, res) {
    accountManager.updateAccount(req.params.username, req.body.account, function (err, account) {
        if (err) {
            res.status(err.status || 400);
            res.end(JSON.stringify({error: err.toString()}));
            return;
        }
        return account;
        /*
         //check if a new user name is the same as the old one
         accountManager.findUserByUserName(account.username, function (err, result) {
         if (err) {
         res.status(err.status || 400);
         res.end(JSON.stringify({error: err.toString()}));
         return;
         }

         if (account.username == result.username) {
         res.status(400);
         res.end(JSON.stringify("New username has to be different from the old one."))
         return;
         }

         res.header("Content-type", "application/json");
         res.end(JSON.stringify(account));
         })*/

    })
});

router.put("/changePassword", function (req, res) {
    if (req.body.newPassword != req.body.newPasswordConfrm) {
        res.status(400);
        res.end(JSON.stringify("Passwords are not equal."));
        return;
    }
    if (req.body.oldPassword == undefined) {
        res.status(400);
        res.end(JSON.stringify("Old password must be filled."));
        return;
    }
    if (req.body.oldPassword == req.body.newPassword) {
        res.status(400);
        res.end(JSON.stringify("New password must be different than the old one."));
        return;
    }
    else {
        accountManager.changePassword(req.body.username, req.body.oldPassword, req.body.newPassword, function (err, result) {
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