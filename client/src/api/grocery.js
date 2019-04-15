import protobuf from 'protobufjs';
import axios from 'axios';
import config from 'config';

const resource = 'grocery/';

let GroceryMessage;
let GroceryListResponseMessage;
let GroceryAddResponseMessage;

protobuf.load('./protos/grocery/grocery.proto')
    .then(root => {
        GroceryMessage = root.lookupType('grocery.Grocery');
    })
    .catch(error => {
        console.error(error);
    });
protobuf.load('./protos/grocery/api/response/grocery-list.proto')
    .then(root => {
        GroceryListResponseMessage = root.lookupType('grocery.api.response.GroceryListResponse');
    })
    .catch(error => {
        console.error(error);
    });
protobuf.load('./protos/grocery/api/response/grocery-add.proto')
    .then(root => {
        GroceryAddResponseMessage = root.lookupType('grocery.api.response.GroceryAddResponse');
    })
    .catch(error => {
        console.error(error);
    });

const list = username => {
    return axios.get(config.api.url + resource, {
        responseType: 'arraybuffer',
        withCredentials: true,
        params: {
            username
        }
    })
        .then(response => {
            // TODO: unwrap response.data from, Uint8Array - protobuf.BufferReader is not used bug ? https://github.com/protobufjs/protobuf.js/issues/986
            return GroceryListResponseMessage.decode(new Uint8Array(response.data));
        });
};

const add = (name, username) => {
    return new Promise((resolve, reject) => {
        const message = GroceryMessage.create({name, username});
        const error = GroceryMessage.verify(message);
        if (error) {
            reject(error);
        } else {
            axios.post(config.api.url + resource, GroceryMessage.encode(message).finish(), {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/octet-stream'
                },
                withCredentials: true
            })
                .then(response => {
                    // TODO: unwrap response.data from, Uint8Array - protobuf.BufferReader is not used bug ? https://github.com/protobufjs/protobuf.js/issues/986
                    resolve(GroceryAddResponseMessage.decode(new Uint8Array(response.data)));
                })
                .catch(error => {
                    reject(error);
                });
        }
    });
};

export default {
    list,
    add
};