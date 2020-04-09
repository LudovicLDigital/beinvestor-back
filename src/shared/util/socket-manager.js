const GroupMessageRepository = require('../../app/repository/group/groups-message-repository');
const SocketManager = {
    ioSocketServer: null,
    prepareConnection(http) {
        this.ioSocketServer = require('socket.io')(http, [{
            pingTimeout: 1000000
        }]);
        const that = this;
        this.ioSocketServer.on('connection', function(socket) {
            socket.on('joinGroupChannel', function (groupId) {
                console.log('An user join channel of group : ' + groupId);
                socket.join(`channel-group-${groupId}`)
            });
            socket.on('leaveGroupChannel', function (groupId) {
                socket.leave(`channel-group-${groupId}`, () => {console.log('An user leave channel : ' + groupId)})
            });
            socket.on('disconnect', function (reason) {
                console.log('A client has been disconnected reason :');
                console.log(reason);
            });
            socket.on('sendMessage', function(groupMessage) {
                that.ioSocketServer.in(`channel-group-${groupMessage.groupId}`).emit(`receivedMessage-${groupMessage.groupId}`, groupMessage);
                GroupMessageRepository.createMessage(groupMessage);
            })
        });
    },
};
module.exports = SocketManager;