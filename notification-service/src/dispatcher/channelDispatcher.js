const EmailChannel = require('../channel/EmailChannel');


const channels = {
    email: new EmailChannel(),
};

function getChannel(type) {
    return channels[type];
}

module.exports = {
    getChannel
};