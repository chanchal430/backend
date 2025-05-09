import * as http from 'http';
import * as serverHandlers from './serverHandlers';
import server from './server';

const Server: http.Server = http.createServer(server);

/**
 * Binds and listens for connections on the specified host
 */
Server.listen(server.get('port'));

/**
 * Server Events
 */
Server.on('error', (error: Error) => serverHandlers.onError(error, server.get('port')));
Server.on('listening', () => {
    serverHandlers.onListening.bind(Server);
    console.log(`\x1b[36mServer is running on port ${server.get('port')}\x1b[0m`);
});
