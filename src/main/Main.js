import {Link} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import useMousePosition from "./useMousePosition";

function EyeSVG({ mousePosition }) {
    const [rotation, setRotation] = useState(0);
    const reference = useRef();

    useEffect(() => {
        if (reference?.current && mousePosition?.x) {
            // https://stackoverflow.com/questions/48343436/how-to-convert-svg-element-coordinates-to-screen-coordinates
            const p1 = mousePosition;
            const svgPoint = reference.current.createSVGPoint();
            svgPoint.x = 150;
            svgPoint.y = 150;
            const p2 = svgPoint.matrixTransform(reference.current.getScreenCTM());
            const angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
            setRotation(angleDeg - 90);
        }
    }, [mousePosition]);

    return(
        <svg ref={reference} className="inline h-6 w-6" viewBox="0 0 300 300" shapeRendering="geometricPrecision" textRendering="geometricPrecision">
            <g transform={ "rotate(" + rotation + ", 150, 150)" }>
                <ellipse rx="150" ry="150" transform="translate(150 150)" fill="#fff" strokeWidth="0"/>
                <ellipse rx="68.489347" ry="62.146887" transform="translate(150 66.672189)" strokeWidth="0"/>
            </g>
        </svg>
    );
}

function distance(p1, p2) {
    const a = p1.x - p2.x;
    const b = p1.y - p2.y;
    return Math.sqrt(a*a + b*b);
}

// from r1 to r2
function convertRange(value, r1, r2) {
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}

function MouthSVG({ mousePosition }) {
    const [scaleY, setScaleY] = useState(1);
    const reference = useRef();

    useEffect(() => {
        if (reference?.current && mousePosition?.x) {
            const svgPoint = reference.current.createSVGPoint();
            svgPoint.x = 150;
            svgPoint.y = 150;
            const screenSvgPoint = svgPoint.matrixTransform(reference.current.getScreenCTM());

            const upperLeftDist = distance({x: 0, y: 0}, screenSvgPoint);
            const upperRightDist = distance({x: window.innerWidth, y: 0}, screenSvgPoint);
            const lowerLeftDist = distance({x: 0, y: window.innerHeight}, screenSvgPoint);
            const lowerRightDist = distance({x: window.innerWidth, y: window.innerHeight}, screenSvgPoint)

            const maxDistance = Math.max(upperLeftDist, upperRightDist, lowerLeftDist, lowerRightDist);
            const mouseToMouthDistance = distance(mousePosition, screenSvgPoint);
            const scaledDistance = convertRange(mouseToMouthDistance, [0, maxDistance], [-1, 1]) * -1;

            setScaleY(scaledDistance);
        }
    }, [mousePosition]);

    return(
        <svg ref={reference} className="w-20 -mt-2" viewBox="0 0 300 300" shapeRendering="geometricPrecision" textRendering="geometricPrecision">
            <path d="
                    M-150,0
                    c0,0,300,0,300,0
                    s-10,150-150,150-150-150-150-150
                    Z"
                  transform={"translate(150 150) scale(1," + scaleY + ")"} strokeWidth="0"/>
        </svg>


    );
}

export function Main() {
    const [hasMouse, setHasMouse] = useState(false);
    const mousePosition = useMousePosition();

    useEffect(() => {
        // https://stackoverflow.com/questions/54763579/distinguish-between-touch-only-and-mouse-and-touch-devices
        // const hasTouch = window.matchMedia("(any-pointer: coarse)").matches;
        const hasMouse = window.matchMedia('(pointer:fine)').matches;

        if (hasMouse) {
            setHasMouse(true);
        }
    }, []);

    return(
        <div className="flex flex-col h-full">
            <div className="h-full flex flex-col text-center items-center justify-center space-y-9">
                {
                    hasMouse &&
                    <a className="flex justify-between w-64 bg-amber-500 p-6"
                       href="https://www.linkedin.com/in/chris-p-ryan/">
                        <EyeSVG mousePosition={mousePosition}/>
                        <MouthSVG mousePosition={mousePosition}/>
                        <EyeSVG mousePosition={mousePosition}/>
                    </a>
                }
                <div
                    className="flex items-center justify-center text-center row-span-1 text-5xl font-extralight lowercase overline">
                    Chris Ryan
                </div>
                <Link to="/boids">flocking</Link>
                <Link to="/flow-field">flow field</Link>
                <Link to="/blobby">blobby</Link>
                <a href="https://solitaireplayfree.com/">Very Basic Solitaire</a>
                <Link to="/retirement-calculator">retirement calculator</Link>
                <Link to="/baker-calculator">baker percentages calculator</Link>
            </div>
            <div className="grid grid-cols-3 justify-items-center bg-black p-6 mt-9">
                <img src="/frog cowboy.svg" alt="Frog Cowboy" className="w-64 bg-white"/>
                <img src="/frog cowboy.svg" alt="Frog Cowboy" className="w-64 bg-white"/>
                <img src="/frog cowboy.svg" alt="Frog Cowboy" className="w-64 bg-white"/>
            </div>
        </div>
    );
}

