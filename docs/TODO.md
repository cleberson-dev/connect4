# TODO

- [x] Show loading before creating a room
- [x] Implement basic HTTP server for trivial and non-bidirectional stuff.
- [x] Store game information on redis.
- [x] List rooms
- [x] Refactor Server Messages (Organize peers)
- [x] Refactor Client Messages (Enum to Action Types, Message Sender Function)
- [x] Players should be able to add their name
- [x] Make rooms joinable by password
- [x] Spectators should be able to add their name
- [x] Make Room creator enter the room without password
- [x] Users that enter through link should be propmted to enter username as well
- [x] Create a playground room for testing purposes (without WebSockets)
- [x] Make playground not available in prod
- [x] Add a state info card that is draggable (playground)
- [x] Label each piece when empty (playground)
- [x] Move to Server Actions 
- [x] Migrate to zustand or other state management library
- [x] Add Unit tests (Components)
- [] Add dev/debug actions to simulate events. (playground)
- [] Refactor WebSocket Use (Implement a hook with context)
- [] Add E2E Tests
- [] Add Unit Tests (Server)
- [] Find a way to enforce payload type based on action type