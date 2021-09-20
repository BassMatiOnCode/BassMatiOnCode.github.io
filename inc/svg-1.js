//
//  svg-1.js    2021-09-17    usp
//

const svgNameSpace = "http://www.w3.org/2000/svg" ;

export function createElement( name, attributes = { } ) {
	const e = document.createElementNS( svgNameSpace, name );
	for ( const [key, value] of Object.entries( attributes )) e.setAttribute( key, value );
	return e ;
	}

export function circle ( x, y, r, attributes = { } ) {
	attributes.cx = x ;
	attributes.cy = y ;
	attributes.r = r ;
	return createElement( "circle", attributes );
	}

export function line ( x1, y1, x2, y2, attributes = { } ) {
	attributes.x1 = x1 ;
	attributes.y1 = y1 ;
	attributes.x2 = x2 ;
	attributes.y2 = y2 ;
	return createElement( "line", attributes );
	}

export function text ( x, y, s, attributes = { } ) {
	attributes.x = x ;
	attributes.y = y ;
	const e = createElement( "text", attributes );
    e.textContent = s ;
    return e ;
	}


function lineIntersection ( m1, b1, m2, b2 ) {
    if ( m1 === m2 ) throw new Error("parallel slopes");
    const x = (b2 - b1) / (m1 - m2);
    return {x: x, y: m1 * x + b1};
}

function pStr ( point ) {
  return `${point.x},${point.y} `;
}

export function spiral (x0, y0, r0, deltaR, a0, a2, deltaA, attributes = { }) {
    // Rename spiral parameters for the formula r = r0 + deltaRθ
    // r0 = start distance from center
    deltaR = deltaR / Math.PI / 2; // space between each loop

    let count = (a2 - a0) / deltaA + 1;
    console.log ( "count=", count );
    // convert angles to radians
    a2 += a0 ;
    let a1 = a0 = a0 * Math.PI / 180;
    a2 = a2 * Math.PI / 180;
    deltaA = deltaA * Math.PI / 180;

    // radii
    r0 -= deltaR * a0;
    let oldR, newR = r0 + deltaR * a1;

    // start and end points
    const oldPoint = {x: 0, y: 0};
    const newPoint = {
        x: x0 + newR * Math.cos(a1), 
        y: y0 + newR * Math.sin(a1)
    };

    // slopes of tangents
    let oldSlope,
        newSlope = (deltaR * Math.sin(a0) + (r0 + deltaR * a1) * Math.cos(a0)) /
                   (deltaR * Math.cos(a0) - (r0 + deltaR * a1) * Math.sin(a0));

    let path = "M " + pStr( newPoint );
    
    while ( -- count ) {
        const a0 = a1; a1 += deltaA;

        oldR = newR;
        newR = r0 + deltaR * a1;

        oldPoint.x = newPoint.x;
        oldPoint.y = newPoint.y;
        newPoint.x = x0 + newR * Math.cos(a1);
        newPoint.y = y0 + newR * Math.sin(a1);

        // Slope calculation with the formula:
        // (deltaR * sinΘ + (r0 + deltaRΘ) * cosΘ) / (deltaR * cosΘ - (r0 + deltaRΘ) * sinΘ)
        const aPlusBTheta = r0 + deltaR * a1;

        oldSlope = newSlope;
        newSlope = (deltaR * Math.sin(a1) + aPlusBTheta * Math.cos(a1)) /
                   (deltaR * Math.cos(a1) - aPlusBTheta * Math.sin(a1));

        const oldIntercept = -(oldSlope * oldR * Math.cos(a0) - oldR * Math.sin(a0));
        const newIntercept = -(newSlope * newR* Math.cos(a1) - newR * Math.sin(a1));

        const controlPoint = lineIntersection(oldSlope, oldIntercept, newSlope, newIntercept);

        // Offset the control point by the center offset.
        controlPoint.x += x0;
        controlPoint.y += y0;

        path += "Q " + pStr(controlPoint) + pStr(newPoint);
    }
    
    attributes.d = path ;
    return createElement( "path", attributes );
}

