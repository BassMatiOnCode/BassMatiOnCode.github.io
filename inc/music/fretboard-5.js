//
//  fretboard-4.js  2021-09-12  usp
//
const svgNameSpace = "http://www.w3.org/2000/svg";
const noteNameRegex = "^[0-9]" ;
let romanNumerals = ",I,,III,,V,,VII,,IX,,,XII,,,XV,,XVII,,IXX,,XXI,,,XXIV";
let target, options, x, y, w, h, maxx, maxy, stringspacing, fretspacing, cellfontsize, headerfontsize, markerfontsize;

export function createFretboard ( t , o ) {
	///		Generates the fretboad diagram
	///		t : Target object reference or ID string
	///		o : Configuration options object. 
	target = t ;
	options = o ;
	// Configure default options.
	if ( ! options.orientation ) options.orientation = "tblr" ;
	if ( ! options.fretmarkers ) options.fretmarkers = "bottom" ;
	if ( typeof romanNumerals === "string" ) romanNumerals = romanNumerals.split( "," );
	if ( ! options.spacing ) options.spacing = [ 20, 20 ] ;
	stringspacing = options.spacing[ 1 ];
	fretspacing = options.spacing[ 0 ];
	if ( options.fontsizes ) {
		cellfontsize = options.fontsizes[ 0 ]; 
		headerfontsize = options.fontsizes[ 1 ]; 
		markerfontsize = options.fontsizes[ 2 ]; }
	else {
		cellfontsize = Math.max( Math.min( stringspacing, fretspacing ) * 0.5, 11 ) ;
		headerfontsize = Math.max( Math.min( stringspacing, fretspacing ) * 0.4, 9 ) ;
		markerfontsize = Math.max( Math.min( stringspacing, fretspacing ) * 0.5, 8 ) ; }
	if ( ! options.fretrange ) options.fretrange = [ 0, 5 ];
	if ( ! options.strings ) options.strings = [ "E4", "B3", "G3", "D3", "A2", "E2" ];
	if ( ! options.stringheaders ) options.stringheaders = [ ];
	if ( ! options.cellsets ) options.cellsets = [ ] ;
	if ( ! options.showcellset ) options.showcellset = 0 ;
	if ( options.cells ) { options.cellsets.push ( options.cells ) ; delete options.cells } ;
	if ( ! options.show ) options.show = "intervalName" ;
	target = document.getElementById( target ) || target ;
	// Create the diagram
	createStringLines( );
	createFretLines( );
	createStringHeaders( );
	createFretmarkers( );
	createCells( 0 );
	// Set viewbox and size
	maxx += 10;
	target.setAttribute( "viewbox", `0 0 ${maxx} ${maxy}` );
	target.setAttribute( "width" , maxx );
	target.setAttribute( "height" , maxy );
	}

function createStringLines ( ) {
	// Calculate diagram dimensions
	x = 0, y = stringspacing / 2 ;
	// Fretmarker row at the top requires additional space
	switch( options.fretmarkers ) { case "top": case "both" : y += markerfontsize }
	// Headers at the left side require additional space
	if ( options.stringheaders ) {
		x += 5 ;
		for ( let i = 0 ; i < options.stringheaders.length ; i ++ ) {
			switch ( options.stringheaders[ i ] ) {
			case "number" : x += 16 ; break
			case "note" : x += 16 ; break
			case "fullnote" : x += 24 ; break
		}	}	}
	w = ( options.fretrange[ 1 ] - options.fretrange[ 0 ] + 1) * fretspacing ;
	h = ( options.strings.length - 1 ) * stringspacing;
	// Set diagram size
	maxx = x + w ;
	maxy = y + h + stringspacing / 2;
	// Create string lines
	let g = document.createElementNS( svgNameSpace, "g" );
	g.setAttribute( "class", "grid strings" );
	target.appendChild( g );
	for ( let i = 0 ; i < options.strings.length ; i ++ ) {
		g.appendChild( createLine( x, y + i * stringspacing, x + w, y + i * stringspacing ));	
		}	
	}
function createFretLines ( ) {
	// Create fret lines
	const g = document.createElementNS( svgNameSpace, "g" );
	g.setAttribute( "class", "grid frets" );
	target.appendChild( g );
	for ( let i = options.fretrange[ 0 ] ; i < options.fretrange[ 1 ] + 2 ; i ++ ) {
		if ( i === 0 ) continue ;
		const a = x + ( i - options.fretrange[ 0 ] ) * fretspacing ;
		g.appendChild( createLine( a, y,  a, y + h, i === 1 ? "nut" : undefined ));	
		}	
	}
function createStringHeaders ( ) {
	///		String header can have multiple items (string number, short 
	///		and long note name), each requires a certain horizontal space.
	let x = 0, g ;
	for ( let i = 0 ; i < options.stringheaders.length ; i ++ ) {
		switch ( options.stringheaders[ i ] ) {
		case "number" :
			g = document.createElementNS( svgNameSpace, "g" );
			g.setAttribute( "class", "stringnumbers" );
			g.setAttribute( "font-size", headerfontsize );
			target.appendChild( g );
			x += 8;
			for ( let i = 0 ; i < options.strings.length ; i ++ ) {
				g.appendChild( createCircle( x, y + i * stringspacing, 7 ));
				g.appendChild( createText( x , y + 3.5 + i * stringspacing, i )); 
				}
			x += 8 ;
			break;
		case "note" :
			g = document.createElementNS( svgNameSpace, "g" );
			g.setAttribute( "class", "stringnames" );
			g.setAttribute( "font-size", headerfontsize );
			target.appendChild( g );
			x += 8 ;
			for ( let i = 0 ; i < options.strings.length ; i ++ ) {
				g.appendChild( createCircle( x, y + i * stringspacing, 7 ));
				g.appendChild( createText( x , y + 3.5 + i * stringspacing, options.strings[ i ].match( noteNameRegex ))); 
				}
			x += 8 ;
			break;
		case "fullnote" :
			g = document.createElementNS( svgNameSpace, "g" );
			g.setAttribute( "class", "stringnames" );
			g.setAttribute( "font-size", headerfontsize );
			target.appendChild( g );
			x += 12 ;
			for ( let i = 0 ; i < options.strings.length ; i ++ ) {
				g.appendChild( createOval( x, y + i * stringspacing, 7 ));
				g.appendChild( createText( x , y + 3.5 + i * stringspacing, options.strings[ i ] )); 
				}
			x += 12 ;
			break;
		}	}
	}
function createFretmarkers ( ) { 
	switch ( options.fretmarkers ) { case "top" : case "both" : createFretmarkerRow( x, y - stringspacing / 2.5 ) }
	switch ( options.fretmarkers ) { case "bottom" : case "both" : createFretmarkerRow( x, y + h + stringspacing / 2 + markerfontsize ) }
	}
function createFretmarkerRow( x, y ) {
	x += fretspacing / 2 ;
	maxy = Math.max( maxy, y + 5 );
	const g = document.createElementNS( svgNameSpace, "g" );
	g.setAttribute( "class", "fretmarkers" );
	g.setAttribute( "font-size", markerfontsize );
	g.setAttribute( "stroke-width", "0.9" );
	target.appendChild( g );
	for ( let i = options.fretrange[ 0 ] ; i <= options.fretrange[ 1 ] ; i ++ , x += fretspacing ) {
		g.appendChild( createText( x, y, romanNumerals[ i ] ));
	}	}
function createCells( cellset ) { 
	let g = document.createElementNS( svgNameSpace, "g" );
	g.setAttribute( "class", "cellset" );
	g.setAttribute( "font-size", cellfontsize );
	g.setAttribute( "stroke-width", "0.9" );
	target.appendChild( g );
	let cells = options.cellsets[ cellset ] ;
	const cw = Math.min(stringspacing, fretspacing) - 3, ch = cw, cr = ch / 2 ;
	for ( let i = 0 ; i < cells.length ; i ++ ) {
		const cell = cells[ i ];
		const cx = x + fretspacing / 2 + (cell.f - options.fretrange[ 0 ]) * fretspacing ;
		const cy = y + ( cell.s - 1 ) * stringspacing ;
		g.appendChild( setFlags( createRectangle( cx, cy, cw, cw, cr ), cell ) );
		if ( cell.opt === 1 ) g.setAttribute( "optional", "" );
		const o = createText ( cx, cy + cellfontsize / 3, String.empty );
		setFlags( o, cell );
		o.setAttribute( "noteName" , cell.nn );
		o.setAttribute( "intervalName" , cell.in );
		o.setAttribute( "fingerNumber" , cell.fn );
		setCellText( o, options.show );
		g.appendChild( o );
	}	}
	
function setCellText ( celltext, what ) {
	let s = celltext.hasAttribute ( what ) ? celltext.getAttribute( what ) : "" ;
	celltext.textContent = s === "O" ? "R" : s ;
	}
function setFlags ( e , cell ) {
	switch( cell.in ) {
		case "R" : e.setAttribute( "root" , "" ) ; break 
		case "O" : e.setAttribute( "octave" , "" ) ; break
		}
	if ( cell.opt === 1 ) e.setAttribute( "optional", "" ) ;
	return e ;
	}
	
function createLine( x1, y1, x2, y2, classname ) {
	let line = document.createElementNS( svgNameSpace, "line" );
	line.setAttribute( "x1", x1 );
	line.setAttribute( "y1", y1 );
	line.setAttribute( "x2", x2 );
	line.setAttribute( "y2", y2 );
	if ( classname ) line.setAttribute( "class", classname );
	return line;
	}
function createCircle( x, y, r, classname ) {
	let e = document.createElementNS( svgNameSpace, "circle" );
	e.setAttribute( "cx", x );
	e.setAttribute( "cy", y );
	e.setAttribute( "r", r );
	if ( classname ) e.setAttribute( "class", classname );
	return e;
	}
function createOval( x, y, r, classname ) {
	let e = document.createElementNS( svgNameSpace, "path" );
	e.setAttribute( "d", `M ${x-3} ${y-r} A ${r} ${r} 0 0 0  ${x-3} ${y+r} L  ${x+3} ${y+r} A  ${r} ${r} 0 0 0  ${x+3} ${y-r} Z` );
	if ( classname ) e.setAttribute( "class", classname );
	return e;
	}
function createRectangle( x, y, w, h, r, classname ) {
	let e = document.createElementNS( svgNameSpace, "rect" );
	e.setAttribute( "x", x - w / 2 );
	e.setAttribute( "y", y - h / 2 );
	e.setAttribute( "width", w );
	e.setAttribute( "height", h );
	e.setAttribute( "rx", r );
	e.setAttribute( "ry", r );
	return e;
	}
function createText ( x, y, text, classname ) {
	let e = document.createElementNS( svgNameSpace, "text" );
	e.setAttribute( "x", x );
	e.setAttribute( "y", y );
	e.textContent = text ;
	if ( classname ) e.setAttribute( "class", classname );
	return e;
	}


