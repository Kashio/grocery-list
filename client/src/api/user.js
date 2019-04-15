import protobuf from 'protobufjs';
import axios from 'axios';
import config from 'config';

const resource = 'user/';

let UserMessage;
let RegisterResponseMessage;
let LoginResponseMessage;

protobuf.load('./protos/grocery/user.proto')
    .then(root => {
        UserMessage = root.lookupType('grocery.User');
    })
    .catch(error => {
        console.error(error);
    });
protobuf.load('./protos/grocery/api/response/register.proto')
    .then(root => {
        RegisterResponseMessage = root.lookupType('grocery.api.response.RegisterResponse');
    })
    .catch(error => {
        console.error(error);
    });
protobuf.load('./protos/grocery/api/response/login.proto')
    .then(root => {
        LoginResponseMessage = root.lookupType('grocery.api.response.LoginResponse');
    })
    .catch(error => {
        console.error(error);
    });

const register = (username, password) => {
    return new Promise((resolve, reject) => {
        const message = UserMessage.create({username, password});
        const error = UserMessage.verify(message);
        if (error) {
            reject(error);
        } else {
            axios.post(config.api.url + resource + 'register', UserMessage.encode(message).finish(), {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            })
                .then(response => {
                    // TODO: unwrap response.data from, Uint8Array - protobuf.BufferReader is not used bug ? https://github.com/protobufjs/protobuf.js/issues/986
                    resolve(RegisterResponseMessage.decode(new Uint8Array(response.data)));
                })
                .catch(error => {
                    reject(error);
                });
        }
    });
};

const login = (username, password) => {
    return new Promise((resolve, reject) => {
        const message = UserMessage.create({username, password});
        const error = UserMessage.verify(message);
        if (error) {
            reject(error);
        } else {
            axios.post(config.api.url + resource + 'login', UserMessage.encode(message).finish(), {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            })
                .then(response => {
                    // TODO: unwrap response.data from, Uint8Array - protobuf.BufferReader is not used bug ? https://github.com/protobufjs/protobuf.js/issues/986
                    resolve(LoginResponseMessage.decode(new Uint8Array(response.data)));
                })
                .catch(error => {
                    reject(error);
                });
        }
    });
};

export default {
    register,
    login
};