import protobuf from 'protobufjs';
import axios from 'axios';
import config from 'config';

const resource = 'grocery/';

let GroceryMessage;
let GroceryListResponseMessage;

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

export default {
    list
};