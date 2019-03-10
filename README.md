Mad cows
--------

This game is based on an archaic flash game. 
I don't know the name of the original, because we used
to play it during IT classes in high school and my memory
is pretty bad. All I know was that it ran in Flash and 
was pretty buggy. It supported local multi-player only,
but me and my friends enjoyed it,
because it was the only thing running at a decent framerate
on our school workstations.


Installation and running
------------------------

```sh
$ yarn install
$ yarn run dev # Runs development server
$ yarn run build # Builds everything into ./dist
$ NODE_ENV=production ./dist/server.js # Runs production level server 
```

Running in docker
-----------------

Docker is cool I guess, so I included a Dockerfile.

The image is quite huge, but the layering should be
fine. 

For those versed in docker, ignore the next lines, 
because I am not that great in docker and I forget.

```sh
$ docker build -t mad-cowz .
$ docker run -p 49160:8080 -d mad-cowz
```

CLI arguments
-------------

| arg    | description                 |
|--------|-----------------------------|
| -q     | sets minimal logging        |
| -v     | sets additional logging     |
| -vv    | sets debug logging          |
| -vvv   | sets silly logging          |


Development
-----------

All files under `./src/client` are hot-reloaded in browser.
Compilation of server scripts will also not load anything from 
`./src/client`.

All other files in `./src/` cause the dev server to restart
and recompile.


TODO
----

- [x] Rudimentary rendering using canvas
- [ ] Rudimentary collision detection
- [x] Rudimentary physics engine
- [ ] Local multi-player
- [ ] Clean up dependencies
- [ ] Improvements over rudimentary implementations
    - [ ] Graphics - sprites / ?vector
    - [ ] ? Key rebinding
- [ ] ? AI
- [ ] Online multi-player using websocket
    - [ ] Lag compensation
    - [ ] Server-side physics checks
    - [ ] Client prediction
    - [ ] Clean up dependencies
- [ ] ? Multi-player lobbies
- [ ] ? Rudimentary chat
- [ ] ? Player stats tracking
- [ ] ? P2P Multi-player
    
