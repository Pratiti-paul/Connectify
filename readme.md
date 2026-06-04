# Connectify

Connectify is a simple real-time chat application built with a Vite + React client and a Node.js + Express server using Socket.IO for realtime messaging. It's a minimal starter for building group chat features and experimenting with WebSocket-based apps.

## Features

- Real-time messaging via Socket.IO
- Simple, responsive chat UI (React)
- Lightweight Node.js server for socket handling

## Tech stack

- Client: React, Vite, Socket.IO client
- Server: Node.js, Express, Socket.IO

## Repo structure

- client/ — front-end (Vite + React)
- server/ — back-end (Node.js + Express + Socket.IO)
- docs/ — project documentation
- readme.md — this file

## Prerequisites

- Node.js 
- npm 

## Local setup

1. Clone the repo

	git clone <repo-url>
	cd Connectify

2. Start the server

	cd server
	npm install
	# start the server (defaults to port 3000)
	npm start

	# Alternatively
	node server.js

3. Start the client

	cd ../client
	npm install
	npm run dev

4. Open the app

	- Open your browser at the Vite dev server URL (usually http://localhost:5173)
	- The client will connect to the server's Socket.IO endpoint. If needed, update the socket URL in `client/src/socket.js` or `src/socket.js`.

## Environment / Configuration

- Server: set `PORT` to change the server port (default: 3000)
- Client: Vite dev server runs on `5173` by default; change Vite config if necessary

## Development notes

- The front-end entry is in `client/src` and the main socket client code is in `client/src/socket.js` or `client/socket.js` depending on your setup.
- The server socket handlers are in `server/server.js`.

## Contributing

Contributions are welcome. Open an issue or submit a pull request with a clear description of changes.

## License

This project is provided as-is. Add a license file if you plan to publish or share under a specific license.

## Contact

If you have questions or need help, open an issue in this repository.

