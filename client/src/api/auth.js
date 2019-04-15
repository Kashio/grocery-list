import protobuf from 'protobufjs';
import axios from 'axios';
import config from 'config';

const resource = 'auth/';

let AuthResponseMessage;

protobuf.load('./protos/grocery/api/response/auth.proto')
    .then(root => {
        AuthResponseMessage = root.lookupType('grocery.api.response.AuthResponse');
    })
    .catch(error => {
        console.error(error);
    });

const auth = () => {
    return new Promise((resolve, reject) => {
        const waitForAuthResponseMessageAndFireAuth = () => {
            if (!AuthResponseMessage) {
                setTimeout(waitForAuthResponseMessageAndFireAuth, 1000);
            } else {
                axios.get(config.api.url + resource, {
                    responseType: 'arraybuffer',
                    headers: {
                        'Content-Type': 'application/octet-stream'
                    }
                })
                    .then(response => {
                        // TODO: unwrap response.data from, Uint8Array - protobuf.BufferReader is not used bug ? https://github.com/protobufjs/protobuf.js/issues/986
                        resolve(AuthResponseMessage.decode(new Uint8Array(response.data)));
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        };
        waitForAuthResponseMessageAndFireAuth();
    });
};

export default {
    auth
};