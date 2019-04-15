const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connection = require('../db');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    logged: {
        type: Boolean,
        default: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});

const saltRounds = 10;

UserSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

UserSchema.methods.checkPassword = function(password) {
    return new Promise((resolve, reject) => {
        if(bcrypt.compareSync(password, this._doc.password)) {
            resolve(true)
        } else {
            resolve(false);
        }
    });
};

UserSchema.statics.register = ({username, password}) => {
    return User
        .findOne({
            username
        })
        .then(result => {
            if (!result) {
                const user = {
                    username,
                    password
                };
                return User.create(user);
            }
            throw new Error('Username exists');
        });
};

UserSchema.statics.login = ({username, password}) => {
    return User
        .findOne({
            username
        })
        .then(user => {
            if (user) {
                return user
                    .checkPassword(password)
                    .then(same => {
                        if (same) {
                            return User.findOneAndUpdate({_id: user._doc._id}, {$set: {logged: true}})
                                .then(result => {
                                    return result._doc;
                                });
                        } else {
                            throw new Error('Incorrect username or password');
                        }
                    });
            } else {
                throw new Error('Incorrect username or password');
            }
        });
};

UserSchema.statics.logout = ({_id}) => {
    return User.findOneAndUpdate({_id}, {$set: {logged: false}});
};

const User = connection.model('User', UserSchema);

module.exports = User;