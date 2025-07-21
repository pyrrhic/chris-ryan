import {useEffect, useRef} from "react";
import p5 from "p5";

const height = 600;
const width = 600;
const scale = 1;
const columns = Math.floor(width / scale);
const rows = Math.floor(height / scale);

class Particle {
    private p: p5;

    position: p5.Vector;
    private velocity: p5.Vector;
    private acceleration: p5.Vector;

    private readonly maxSpeed = 1;

    constructor(p: p5) {
        this.p = p;

        this.position = this.p.createVector(0,0);
        this.velocity = this.p.createVector(-1, 0);
        this.acceleration = this.p.createVector(0, 0);
    }

    update = () => {
        this.acceleration.setMag(0.01);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);

        this.position.add(this.velocity);

        this.acceleration.mult(0);
    }

    followForce = (flowField: p5.Vector[]) => {
        const x = Math.floor(this.position.x / scale);
        const y = Math.floor(this.position.y / scale);
        let index = x + (y * columns);
        if (index >= flowField.length) {
            index = flowField.length - 1;
        }
        const force = flowField[index];
        if (force === undefined) {
            console.log(x, y, index, force);
        }
        this.applyForce(force);
    }

    applyForce = (force: p5.Vector) => {
        this.acceleration.add(force);
    }

    draw = () => {
        this.p.stroke(0, 10);
        this.p.point(this.position.x, this.position.y);
    }

    edgeWrap = () => {
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
}

const sketch = (p: p5) => {
    let flowField: p5.Vector[];

    let particles: Particle[] = [];

    p.setup = () => {
        p.createCanvas(width, height);

        flowField = new Array(rows * columns);

        let xOff = 0;
        for (let y = 0; y < rows; y++) {
            let yOff = 0;
            for (let x = 0; x < columns; x++) {

                const index = x + y * columns;
                const angle = p.noise(xOff, yOff) * p.TWO_PI;
                const vector = p5.Vector.fromAngle(angle);
                vector.setMag(1);
                flowField[index] = vector;

                // p.push();
                //     p.stroke(0, 50);
                //     p.strokeWeight(1);
                //     p.translate(x * scale + (scale/2), y * scale + (scale/2));
                //     p.rotate(vector.heading());
                //     p.line(0, 0, scale/2, 0);
                // p.pop();

                yOff += 0.1;
            }
            xOff += 0.1;
        }

        for (let i = 0; i < 1000; i++) {
            const par = new Particle(p);
            const x = p.random(width - 1);
            const y = p.random(height - 1);
            par.position = p.createVector(x, y);
            particles.push(par);
        }
    };

    p.draw = () => {
        // p.background(255);
        for (let par of particles) {
            par.update();
            par.edgeWrap();
            par.followForce(flowField);
            par.draw();
        }
    };
}

export function FlowField() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const myP5 = new p5(sketch, containerRef.current!);
        return myP5.remove;
    }, []);

    return(
        <div className="h-full bg-black py-24">
            <div className="text-center text-white">flow field</div>
            <div className="flex justify-center">
                <div className="border-4 border-black bg-white" ref={containerRef}>

                </div>
            </div>
        </div>
    );
}