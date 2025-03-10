const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: [ 'GET', 'POST' ]
        }
    });

    io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('join', async (data) => {
        try {
            const { userId, userType } = data;
            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        } catch (error) {
            console.error("Error updating socket ID:", error);
            socket.emit('error', { message: 'Failed to update user socket ID' });
        }
    });

    socket.on('update-location-captain', async (data) => {
        try {
            const { userId, location } = data;

            if (!location || !location.lat || !location.lng) { // Fix ltd -> lat
                return socket.emit('error', { message: 'Invalid location data' });
            }

            await captainModel.findByIdAndUpdate(userId, {
                location: { lat: location.lat, lng: location.lng }
            });

        } catch (error) {
            console.error("Error updating location:", error);
            socket.emit('error', { message: 'Failed to update location' });
        }
    });

    // Handle errors on the socket
    socket.on('error', (err) => {
        console.error(`Socket error on ${socket.id}:`, err);
        socket.destroy(); // Destroy the socket safely
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

}

const sendMessageToSocketId = (socketId, messageObject) => {

console.log(messageObject);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };