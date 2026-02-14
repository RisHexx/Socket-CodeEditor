import {io} from "socket.io-client";

export const initSocket = async () => {
    const options = {
        'force new connection': true,
        // BUG FIX: reconnectionAttempts should be a number, not a string
        // "Infinity" (string) would be evaluated as NaN, causing reconnection to fail
        reconnectionAttempts: Infinity,
        timeout: 10000,
        transports: ["websocket"],
    };
    return io("http://localhost:3000", options);
    // return io("https://socket-backend-ztzw.onrender.com", options);
}