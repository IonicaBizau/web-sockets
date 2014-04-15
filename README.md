Web Sockets
===========

Mono module implementation for web sockets.

# Documentation
## Configuration Example

```js
"webSockets": {
    "module": "github/IonicaBizau/web-sockets/MODULE_VERSION"
  , "roles": MONO_ROLES
  , "config": {
        "binds": BIND_CONFIGURATION   // optional
      , "listen": EVENT_CONFIGURATION // optional
    }
  , "operations": {
        "init": {
            "roles": MONO_ROLES
          , "params": []
        }
    }
},
```

## Client

### `self.socketInit (options, callback)`

Inits the socket in the page. This is called automatically!

 - `options`: an object containing the following fields:
   - `force`: if the websocket is already inited and `force` is `true`, the websocket will be reinited
   - `log`: log level passed to socket.io

 - `callback`: a function that is called when the socket it inited


### `self.clientEmit (object, function)`
Emits an event and data to the server

 - `options`: an object containing
    - event: the event name
    - data:  the data that goes to server side

 - `callback`: a function that is passed too to the emit function from socket emit function


### `self.clientListen (object, function)`
Listen an event that comes from the server

 - `options`: an object containing
    - `event`: the event name

callback: a function that is passed too to the on function

### `self.serverSend (options)`
Call the sendMessage from the server

 - `message`: an object containing
    - `type1 (string): client, session, group, or all
    - `session` (session id): which clinet should recive this message; all if undefined
    - `data` (object)


### `self.serverEmitGlobal (options)`
Emits a global event using M.emit()

 - `options`:
    - `event`: the event name that is emited
    - `data`: data to be emited

## Server

The module listens for the following server events:

 - `sockets.init`
 - `sockets.emit`
 - `sockets.listen`
 - `sockets.send`

# Changelog

## v0.3.0
 - Fixed bugs in `clientEmit` method
 - Fixed #3: send a refresh signal on the client
 - Fixed #2: set the debug mode (default: `false`)
 - Syntax changes
 - Comments
 - Additional checks for preventing errors

## v0.2.2
 - Upgrade to Events v0.1.8 and Bind v0.2.1

## v0.2.1
 - Emit a global event on the server side using functions from the client side.
 - Added more public functions.
 - Removed obsolete Mono operations. The only module operation is `init()`.

## v0.2.0
 - TODO

## v0.1.0
 - Initial version.
