import { EventEmitter } from "events";
import { Key } from 'ts-key-enum';
import Victor = require('victor');

export class GameState extends EventEmitter {
    public readonly fieldXSize: number;
    public readonly fieldYSize: number;

    public readonly input: Input;

    private players: Set<Player> = new Set<Player>();
    public readonly entities: Set<Entity> = new Set<Entity>();

    constructor(fieldXSize: number, fieldYSize: number, input: Input) {
        super();
        this.fieldXSize = fieldXSize;
        this.fieldYSize = fieldYSize;
        this.input = input;
    }

    public addPlayer(player: Player) {
        this.players.add(player);
        this.entities.add(player);
    }

    public tick(delta: number) {
        this.players.forEach((player: Player) => {
            player.move(delta);
        });
    }
}

export class Input {
    private upActive = false;
    private downActive = false;
    private leftActive = false;
    private rightActive = false;

    public constructor(elem: HTMLElement) {
        elem.addEventListener('keydown', (ev: KeyboardEvent) => {
            switch (ev.key) {
                case Key.ArrowUp:
                    ev.preventDefault();
                    this.upActive = true;
                    break;
                case Key.ArrowDown:
                    ev.preventDefault();
                    this.downActive = true;
                    break;
                case Key.ArrowLeft:
                    ev.preventDefault();
                    this.leftActive = true;
                    break;
                case Key.ArrowRight:
                    ev.preventDefault();
                    this.rightActive = true;
                    break;
            }
        });
        elem.addEventListener('keyup', (ev: KeyboardEvent) => {
            ev.preventDefault();
            switch (ev.key) {
                case Key.ArrowUp:
                    ev.preventDefault();
                    this.upActive = false;
                    break;
                case Key.ArrowDown:
                    ev.preventDefault();
                    this.downActive = false;
                    break;
                case Key.ArrowLeft:
                    ev.preventDefault();
                    this.leftActive = false;
                    break;
                case Key.ArrowRight:
                    ev.preventDefault();
                    this.rightActive = false;
                    break;
            }
        });
    }

    public get isUpActive() {
        return this.upActive;
    }

    public get isDownActive() {
        return this.downActive;
    }

    public get isLeftActive() {
        return this.leftActive;
    }

    public get isRightActive() {
        return this.rightActive;
    }
}

class Entity {
    public readonly positionVector: Victor;
    public readonly sizeVector: Victor;

    public constructor(position: Victor, size: Victor) {
        this.positionVector = position;
        this.sizeVector = size;
    }

    public draw(viewTransform: Victor, ctx: CanvasRenderingContext2D): void {

    }
}

const INHERENT_DECELERATION = -30;
const MAX_SPEED = 65;
const TURNING_BIAS = 3;
const ACCELERATION_BIAS = 30;

export class Player extends Entity {
    private angle: number;
    private speed: number = 0;

    private speedVector: Victor = new Victor(0, 0);

    private game: GameState;

    public constructor(game: GameState, position: Victor, initialAngle: number) {
        super(position, new Victor(150, 150));
        this.angle = initialAngle;
        this.game = game;
    }

    public move(delta: number) {
        let acceleration = 0;
        let turning = 0;

        if (this.game.input.isUpActive) {
            acceleration = ACCELERATION_BIAS;
        } else if (this.game.input.isDownActive) {
            acceleration = -ACCELERATION_BIAS - 30;
        } else {
            acceleration = INHERENT_DECELERATION;
        }

        if (this.game.input.isLeftActive && this.game.input.isRightActive) {
            turning = 0;
        } else if (this.game.input.isLeftActive) {
            turning = - TURNING_BIAS;
        } else if (this.game.input.isRightActive) {
            turning = + TURNING_BIAS;
        } else {
            turning = 0
        }

        // TODO: Compute position and angle correctly
        this.speed = clamp(this.speed + acceleration * delta, 0, MAX_SPEED);
        this.angle += turning * delta;

        this.speedVector = (new Victor(this.speed, 0)).rotateBy(this.angle).multiplyScalar(delta * 10);
        this.positionVector.add(this.speedVector);
    }

    public draw(viewTransform: Victor, ctx: CanvasRenderingContext2D): void {
        super.draw(viewTransform, ctx);

        const finalPosition = this.positionVector.clone().multiply(viewTransform);

        const rotationCentre = new Victor(
            finalPosition.x + this.sizeVector.x / 2,
            finalPosition.y + this.sizeVector.y / 2,
        );

        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#000000';

        // Rotation is done around origin
        const points = [
            rotate((new Victor(
                finalPosition.x,
                finalPosition.y + this.sizeVector.y,
            )), rotationCentre, this.angle),
            rotate(new Victor(
                finalPosition.x + this.sizeVector.x,
                finalPosition.y + this.sizeVector.y / 2,
            ), rotationCentre, this.angle),
            rotate(new Victor(
                finalPosition.x + this.sizeVector.x,
                finalPosition.y + this.sizeVector.y,
            ), rotationCentre, this.angle),
        ];

        drawPolygon(points, ctx);
        ctx.beginPath();
        ctx.arc(rotationCentre.x, rotationCentre.y, 10, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fillStyle = '#FF0000';
        ctx.fill();

        const debugSpeedVector = this.speedVector.clone().add(rotationCentre);
        ctx.beginPath();
        ctx.moveTo(rotationCentre.x, rotationCentre.y);
        ctx.lineTo(debugSpeedVector.x, debugSpeedVector.y);
        ctx.closePath();
        ctx.stroke();
    }
}

function rotate(which: Victor, centre: Victor, angle: number): Victor {
    return which.subtract(centre).rotateBy(angle).add(centre);
}

function clamp(n: number, min: number, max: number): number {
    if (n < min) return min;
    if (n > max) return max;
    return n;
}

function drawPolygon(points: Victor[], ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#00FF00';

    const firstPoint = points.splice(0, 1).pop();
    ctx.beginPath();
    ctx.moveTo(firstPoint.x, firstPoint.y);
    points.forEach((point: Victor) => {
        ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}

class Rect {
    public readonly posX: number;
    public readonly posY: number;
    public readonly width: number;
    public readonly height: number;

    constructor(posX: number, posY: number, width: number, height: number) {
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;
    }
}
