const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = document.querySelector('.main').scrollHeight;

addEventListener('resize', () => {
  canvas.width = innerWidth;
  canvas.height = document.querySelector('.main').scrollHeight;
})

class Star {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  show() {
    c.fillStyle = '#FCA311';
    c.beginPath();
    c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    c.fill();
    c.closePath();
  }
}

class Planet {
  constructor(x, y, r, speed = 0.05, distance = 100) {
    this.x = x;
    this.y = y;
    this.px = x;
    this.py = y;
    this.r = r;
    this.speed = speed;
    this.distance = distance;
    this.radians = 0;
  }

  show() {
    c.beginPath();
    c.arc(this.px, this.py, this.distance * 2, 0, 2 * Math.PI);
    c.closePath();

    c.beginPath();
    c.fillStyle = '#FCA311';
    c.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    c.fill();
    c.closePath();

  }

  update() {
    this.radians += this.speed;
    this.x = this.px + Math.cos(this.radians) * this.distance;
    this.y = this.py + Math.sin(this.radians) * this.distance;
  }
}

let star;
let planet1;
let planet2;

star = new Star(innerWidth - 75, innerHeight - 75, 60);

const mediaQuery = window.matchMedia('(max-width: 768px)');
if (mediaQuery.matches) {
  star = new Star(innerWidth - 50, innerHeight - 50, 60);

}
planet1 = new Planet(star.x, star.y, 15, 0.05, star.r + 80);
planet2 = new Planet(star.x, star.y, 40, 0.005, star.r + 400);


function draw() {
  star.show();
  planet1.show();
  planet1.update();
  planet2.show();
  planet2.update();
}

function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  draw();
}
animate();
