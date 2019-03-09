const body = document.getElementsByTagName('body')[0];
let canvas = document.getElementsByTagName('canvas')[0];
canvas = canvas || document.createElement('canvas');

if (module.hot) {
    module.hot.accept();
    // TODO: Cull objects on rendering hot-reload
    startRendering(body, canvas);
}

window.onload = () => {
    startRendering(body, canvas);
};

function startRendering(body: HTMLBodyElement, canvas: HTMLCanvasElement) {
    body.setAttribute('style', 'margin: 0; padding: 2.5vh, 2.5vw; width: 95vw; height: 95vh; overflow: none');
    canvas.setAttribute('width', body.clientWidth + 'px');
    canvas.setAttribute('height', body.clientHeight + 'px');
    body.appendChild(canvas);

    let context2D = canvas.getContext("2d");
    let square = {
        x: 25,
        y: 25,
        directionX: -1,
        directionY: 1,
        speed: 2,
        width: 50,
        height: 50,
        color: 'red',
    };

    function mainLoop() {
        move();
        draw();
        requestAnimationFrame(mainLoop);
    }
    mainLoop();

    function move() {
        if (square.x + square.width + square.speed * square.directionX > canvas.width)
            square.directionX = -1;
        if (square.x + square.speed * square.directionX < 0)
            square.directionX = 1;
        if (square.y + square.height + square.speed * square.directionY > canvas.height)
            square.directionY = -1;
        if (square.y + square.speed * square.directionY < 0)
            square.directionY = 1;

        changeToRandomColor();
        square.x += square.speed * square.directionX;
        square.y += square.speed * square.directionY;
    }

    function draw() {
        context2D.fillStyle = square.color;
        context2D.fillRect(square.x, square.y, square.width, square.height);
    }

    function changeToRandomColor() {
        const colors = ['green', 'blue', 'red', 'yellow'];
        square.color = colors[Math.floor(Math.random() * colors.length)];
    }

}
