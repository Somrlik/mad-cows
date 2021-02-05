import { GameState, Input, Player } from './GameState';
import Victor = require('victor');

const body = document.getElementsByTagName('body')[0];
let canvas = document.getElementsByTagName('canvas')[0];
canvas = canvas || document.createElement('canvas');

window.onload = () => {
    body.setAttribute('style', 'margin: 0; padding: 2.5vh, 2.5vw; width: 100vw; overflow: none');
    canvas.setAttribute('style', 'max-width: 1600px; max-height: 900px;');
    canvas.setAttribute('width', body.clientWidth + 'px');
    canvas.setAttribute('height', body.clientWidth * 9/16 + 'px');
    body.appendChild(canvas);
};

/**
 * Renders the game
 *
 * It is capable of rendering any
 */
class Renderer {
    private game: GameState;
    private canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;

    /**
     * Describes how the game coordinates should transform to view
     */
    private viewTransform: Victor;

    public constructor(game: GameState, canvas: HTMLCanvasElement) {
        this.game = game;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    public draw() {
        this.viewTransform = new Victor(
            game.fieldXSize / this.canvas.width,
            game.fieldYSize / this.canvas.height
        );

        // Clear the whole display
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        game.entities.forEach((entity) => {
            entity.draw(this.viewTransform, this.ctx);
        });
    }
}
const input = new Input(document.getElementsByTagName('html')[0]);

// The underlying gameState is actually a smaller field. This does not really matter since I use floats to keep the state.
// This is basically the global plane, renderer uses the display/rotation plane
let game = new GameState(1600, 900, input);
let renderer = new Renderer(game, canvas);

// TODO: Move elsewhere
let player = new Player(game, new Victor(500, 50), 0.0);
game.addPlayer(player);

let lastTick = performance.now();
function mainLoop() {
    const delta = (performance.now() - lastTick) / 1000.0;

    game.tick(delta);
    renderer.draw();

    requestAnimationFrame(mainLoop);
    lastTick = performance.now();
}
mainLoop();

if (module.hot) {
    module.hot.accept([], () => {
        // TODO: I am too lazy to do stuff with the state, so I just reload the window
        window.location = window.location;
    });
}
