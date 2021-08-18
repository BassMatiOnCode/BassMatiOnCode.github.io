//
// toolbar-2.js
//

let toolbar ;

export function initPage ( ) {
	/// Creates the main toolbar.
	toolbar = document.createElement( "DIV" );
	toolbar.className = "toolbar" ;
	toolbar.id = "main-menu" ;
	document.body.insertBefore( toolbar, document.body.firstChild );
	}

export function createButtons( navigation, collapsible ) {
	/// Creates the toolbar buttons.
	/// Parameters provide the necessary methods that are used by the buttons.
	let button;
	createButton( "svg", "navigate", "svg", steeringWheel, navigation.navigateButtonClickHandler ); 
	createButton( "a", "navigate-up", "svg", upArrow, navigation.parent );
	createButton( "a", "navigate-first", "svg", leftEndArrow, navigation.first );
	createButton( "a", "navigate-previous", "svg", leftArrow, navigation.previous );
	createButton( "a", "navigate-next", "svg", rightArrow, navigation.next );
	createButton( "a", "navigate-last", "svg", rightEndArrow, navigation.last );
	if ( document.querySelector( "body > #content > [cbc]" )) {
		button = createButton( "svg", "collapse-toggle", "svg", circledPlusMinus, collapsible.toggleAllBlocks );
		button.setAttribute( "expand", "" );
		}
	}

function createButton( tag, name, imgtype, imgurl, option ) {
	/// Creates a button in the toolbar.
	/// tag : Element tag name, A, DIV, SVG or other element tag name
	/// name : Button name attribute as required by toolbar.css
	/// imgtype : "svg" or "url"
	/// imgurl : svg object reference, or image URL
	/// option : URL for A butttons, or event handler reference for other elements
	let button;
	tag = tag.toUpperCase( );
	// Create the button element
	button = tag === "SVG" ? createSVG( imgurl ) : document.createElement( tag );
	button.setAttribute( "class", "toolbutton" );
	button.setAttribute( "name", name ) ;
	// A buttons have an href element, the others have an event handler attached.
	if ( tag === "A" ) button.setAttribute( "href", option );
	else button.addEventListener( "click", option );
	// SVG buttons have no image, they are the image.
	switch ( tag ) {
	case "A" :
	case "DIV" : 
		switch ( imgtype ) {
		case "url" : button.appendChild( createImage( imgurl )); break;
		case "svg" : button.appendChild( createSVG( imgurl )); break;
		case "obj" : button.appendChild( imgurl ); break;
		} }
	toolbar.insertBefore( button, null );
	return button;
	}

function createImage( url ) {
	const image = document.createElement( "IMG" );
	image.setAttribute( "src", url );
	return image;
	}

function createSVG( content ) {
	const e = document.createElementNS( "http://www.w3.org/2000/svg", "svg" );
	e.setAttribute( "xmlns:xlink", "http://www.w3.org/1999/xlink" );
	e.setAttribute( "viewBox", "-50 -50 100 100" );
	// Make sure width and height matches attributes in toolbar.css .toolbutton, plus 1!
	e.setAttribute( "width", "33" );
	e.setAttribute( "height", "33" );
	e.setAttribute( "version", "1.1" );
	e.setAttribute( "class", "svg-toole" );
	e.innerHTML = content ;
	return e ;
	/*
	var svgimg = document.createElementNS( "http://www.w3.org/2000/svg","image");
	svgimg.setAttribute("height","100");
	svgimg.setAttribute("width","100");
	svgimg.setAttribute("id","testimg2");
	svgimg.setAttributeNS("http://www.w3.org/1999/xlink","href","some/imgae.jpg");
	svgimg.setAttribute("x","0");
	svgimg.setAttribute("y","0");
	button.appendChild(svgimg);
	*/
	}

	// Toolbar icons SVG code
const steeringWheel = "<g stroke-width='7'><ellipse cx='0' cy='0' rx='37' ry='37'' /><ellipse cx='0' cy='0' rx='12' ry='12' /><path d='M 0, -46 L 0, 46 M -46, 0 L 46, 0 M -32.53, -32.53 L 32.53, 32.53 M 32.53, -32.53 L -32.53, 32.53' />" ;
const upArrow = "<path d='M 0, -35 L 0, 35 M -35, 0 L 0, -35 L 35, 0' />" ;
const leftEndArrow = "<path d='M -35, 0 L 35, 0 M -35, 40 L -35, -40 M 10, 35 L -28, 0 L 10, -35' />" ;
const leftArrow =  "<path d='M -35, 0 L 35, 0 M 0, 35 L -35, 0 L 0, -35' />" ;
const rightArrow = "<path d='M -35, 0 L 35, 0 M 0, 35 L 35, 0 L 0, -35' />" ;
const rightEndArrow = "<path d='M -35, 0 L 35, 0 M 35, -40 L 35, 40 M -10, 35 L 28, 0 L -10, -35' />" ;
const circledPlusMinus = "<ellipse cx='0' cy='0' rx='45' ry='45' /><path d='M -25, 0 L 25, 0' /><path class='expand' d='M 0, -25 L 0, 25' />" ;
