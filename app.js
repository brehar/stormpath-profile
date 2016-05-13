'use strict';

const PORT = process.env.PORT || 3000;

var express = require('express');
var morgan = require('morgan');
var stormpath = require('express-stormpath');
var bodyParser = require('body-parser');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(stormpath.init(app, {
    website: true,
    expand: {
        customData: true
    },
    web: {
        me: {
            expand: {
                customData: true
            }
        }
    }
}));
app.use(express.static('public'));

app.put('/updateProfile', stormpath.loginRequired, (req, res) => {
    req.user.customData.profile = req.body.customData.profile;

    req.user.customData.save((err, savedUser) => {
        res.status(err ? 400 : 200).send(err || savedUser);
    });
});

app.listen(PORT, err => {
    console.log(err || `Server listening on port ${PORT}`);
});