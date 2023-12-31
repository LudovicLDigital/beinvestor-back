const SocketManager = {
    ioSocketServer: null,
    prepareConnection(http) {
        this.ioSocketServer = require('socket.io')(http, [{
            pingTimeout: 1000000
        }]);
        this.ioSocketServer.on('connection', function(socket) {
            socket.on('joinGroupChannel', function (groupId) {
                console.log(new Date() + ' An user join channel of group : ' + groupId);
                socket.join(`channel-group-${groupId}`)
            });
            socket.on('leaveGroupChannel', function (groupId) {
                socket.leave(`channel-group-${groupId}`, () => {console.log(new Date() + ' An user leave channel : ' + groupId)})
            });
            socket.on('disconnect', function (reason) {
                console.log(new Date() + ' A client has been disconnected reason :');
                console.log(reason);
            });
        });
    },
    emitAMessage(groupMessage) {
        console.log(new Date() + '===========EMIT A MESSAGE FROM SOCKET==========');
        this.ioSocketServer.in(`channel-group-${groupMessage.groupId}`).emit(`receivedMessage-${groupMessage.groupId}`, groupMessage);
    }
};
module.exports = SocketManager;