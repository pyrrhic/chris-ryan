import {useEffect, useRef} from "react";
import p5 from "p5";

const height = 600;
const width = 600;

const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(width, height);
    };

    let zOffset = 0;

    p.draw = () => {
        p.background(0);

        p.translate(width / 2, height / 2);

        const radius = 150;

        p.beginShape();
        p.stroke(255,255,255);
        p.noFill();
        for (let a = 0; a < p.TWO_PI; a += 0.01) {
            const xOffset = p.map(p.cos(a), -1, 1, 0, 20);
            const yOffset = p.map(p.sin(a), -1, 1, 0, 20);
            let offset = p.map(p.noise(xOffset, yOffset, zOffset), 0, 1, 0, 100);
            let r = radius + offset;
            let x = r * p.cos(a);
            let y = r * p.sin(a);
            p.vertex(x, y);
        }
        zOffset += 0.01;
        p.endShape();
    }
}

export default function Blobby() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const myP5 = new p5(sketch, containerRef.current!);
        return myP5.remove;
    }, []);

    return(
        <div className="py-24">
            <div className="text-center">blobby</div>
            <div className="flex justify-center">
                <div className="border-4 border-black" ref={containerRef}>

                </div>
            </div>
        </div>
    );
}