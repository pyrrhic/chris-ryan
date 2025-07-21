import {useEffect, useRef} from "react";
import p5 from "p5";

const width = 1000;
const height = 800;
const gridSquareSize = 1;
const maxBoids = 1000;

function insertFlockIntoGrid(flock, grid) {
    for (let boid of flock) {
        const { xGrid, yGrid } = boid.gridPosition();
        if (grid[xGrid][yGrid] == null) grid[xGrid][yGrid] = [];
        grid[xGrid][yGrid].push(boid);
    }
}

function resetGrid(grid) {
    for (let xGrid = 0; xGrid < grid.length; xGrid++) {
        for (let yGrid = 0; yGrid < grid[xGrid].length; yGrid++) {
            grid[xGrid][yGrid] = [];
        }
    }
}

function getSurroundingBoids(boidSelf, grid) {
    const nearByFlock = [];

    const { xGrid, yGrid } = boidSelf.gridPosition();
    nearByFlock.push(...grid[xGrid][yGrid]);

    if (xGrid + 1 < grid.length) {
        nearByFlock.push(...grid[xGrid+1][yGrid]);
    }
    if (xGrid - 1 >= 0) {
        nearByFlock.push(...grid[xGrid-1][yGrid]);
    }

    if (yGrid + 1 < grid[xGrid].length) {
        nearByFlock.push(...grid[xGrid][yGrid + 1]);
    }
    if (yGrid - 1 >= 0) {
        nearByFlock.push(...grid[xGrid][yGrid - 1]);
    }

    if (xGrid + 1 < grid.length && yGrid + 1 < grid[xGrid].length) {
        nearByFlock.push(...grid[xGrid + 1][yGrid + 1]);
    }
    if (xGrid + 1 < grid.length && yGrid - 1 >= 0) {
        nearByFlock.push(...grid[xGrid + 1][yGrid - 1]);
    }

    if (xGrid - 1 >= 0 && yGrid + 1 < grid[xGrid].length) {
        nearByFlock.push(...grid[xGrid - 1][yGrid + 1]);
    }
    if (xGrid - 1 >= 0 && yGrid - 1 >= 0) {
        nearByFlock.push(...grid[xGrid -1 ][yGrid - 1]);
    }

    return nearByFlock;
}

function Boid(p, _position, _velocity) {
    this.position = _position || p.createVector(p.random(10, width - 10), p.random(10, height - 10));
    this.velocity = _velocity || p5.Vector.random2D();
    this.maxSpeed = 2;
    this.velocity.setMag(this.maxSpeed); // p.random(2, 4)
    this.acceleration = p.createVector();
    this.maxForce = 0.05;
    this.alignForce = 0.2;
    this.cohesionForce = 0.1;
    this.separationForce = 0.2;
    this.edgeForce = 1;
    this.r = p.random(0, 256);
    this.g = p.random(0, 256);
    this.b = p.random(0, 256);

    this.gridPosition = () => {
        let xGrid;
        if (this.position.x < 0) {
            xGrid = 0;
        } else if (this.position.x > width) {
            xGrid = width / gridSquareSize - 1;
        } else {
            xGrid = Math.floor(this.position.x / gridSquareSize);
        }

        let yGrid;
        if (this.position.y < 0) {
            yGrid = 0;
        } else if (this.position.y > height) {
            yGrid = height / gridSquareSize - 1;
        } else {
            yGrid = Math.floor(this.position.y / gridSquareSize);
        }

        return { xGrid, yGrid };
    }

    this.edges = () => {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }

    this.align = (flock, grid) => {
        let perceptionRadius = 12;
        let steering = p.createVector();
        let total = 0;
        const nearByFlock = getSurroundingBoids(this, grid);
        for (let other of nearByFlock) {
            // let d = p.dist(this.position.x, this.position.y, other.position.x, other.position.y);
            // if (other !== this && d < perceptionRadius) {
            steering.add(other.velocity);
            total++;
            // }
        }
        total = nearByFlock.length;
        if (total > 0) {
            steering.div(total);
            // steering.sub(this.velocity);
            steering.setMag(this.alignForce);
        }
        return steering;
    }

    this.cohesion = (flock, grid) => {
        let perceptionRadius = 12;
        let steering = p.createVector();
        let total = 0;
        const nearByFlock = getSurroundingBoids(this, grid);
        for (let other of nearByFlock) {
            // let d = p.dist(this.position.x, this.position.y, other.position.x, other.position.y);
            // if (other !== this && d < perceptionRadius) {
            steering.add(other.position);
            total++;
            // }
        }
        total = nearByFlock.length;
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.cohesionForce);
            // steering.sub(this.velocity);
            // steering.limit(this.maxForce);
        }
        return steering;
    }

    this.separation = (flock, grid) => {
        let perceptionRadius = 12;
        let steering = p.createVector();
        let total = 0;
        const nearByFlock = getSurroundingBoids(this, grid);
        for (let other of nearByFlock) {
            let d = p.dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other !== this && d < perceptionRadius) {
                let diff = p5.Vector.sub(this.position, other.position);
                // if (d < 1) d = 1;
                diff.div(d**2);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.separationForce);
            // steering.sub(this.velocity);
            // steering.limit(this.maxForce);
        }
        return steering;
    }

    this.avoidEdges = () => {
        const steering = p.createVector();
        const margin = 20;

        if (this.position.x > width - margin) {
            steering.add(-10, 0);
        } else if (this.position.x < margin) {
            steering.add(10, 0);
        }

        if (this.position.y > height - margin) {
            steering.add(0, -10);
        } else if (this.position.y < margin) {
            steering.add(0, 10);
        }

        steering.setMag(this.edgeForce);

        return steering;
    }

    this.nextSteps = (flock, grid) => {
        this.acceleration.mult(0);

        this.acceleration.add(this.align(flock, grid));
        this.acceleration.add(this.cohesion(flock, grid));
        this.acceleration.add(this.separation(flock, grid));

        this.acceleration.setMag(this.maxForce);

        this.acceleration.add(this.avoidEdges());
    }

    this.update = (flock) => {
        this.position.add(this.velocity);

        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
    }

    this.render = () => {
        p.strokeWeight(6);
        p.stroke(this.r, this.g, this.b);
        p.point(this.position.x, this.position.y);
    }
}

const sketch = (p) => {
    const flock = [];
    let avgPerf = [];

    let grid = new Array(width / gridSquareSize);
    grid.fill(new Array(height / gridSquareSize));

    p.setup = () => {
        p.createCanvas(width, height);

        for (let i = 0; i < maxBoids; i++) {
            flock.push(new Boid(p));
        }

        resetGrid(grid);
        insertFlockIntoGrid(flock, grid);
    }

    p.draw = () => {
        const start = performance.now();
        p.background(0);

        for (let boid of flock) {
            boid.nextSteps(flock, grid);
            // boid.avoidEdge();
        }

        for (let boid of flock) {
            boid.update(flock);
        }

        resetGrid(grid);
        insertFlockIntoGrid(flock, grid);

        for (let boid of flock) {
            boid.render();
        }

        const runTime = performance.now() - start;
        if (avgPerf.length >= 10) {
            avgPerf.shift();
        }
        avgPerf.push(runTime);
        if (avgPerf.length === 10) {
            let sum = 0;
            for (let p of avgPerf) {
                sum += p;
            }

            // console.log(sum / avgPerf.length);
        }
    }
}

function BoidsApp() {
    const containerRef = useRef();

    useEffect(() => {
        const myP5 = new p5(sketch, containerRef.current)
        return myP5.remove;
    }, []);

    return (
        <div className="h-full">
            <div className="text-center mt-9">flocking</div>
            <div className="flex justify-center">
                <div ref={containerRef}>

                </div>
            </div>
        </div>
    );
}

export default BoidsApp;
