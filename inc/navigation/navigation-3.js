//
// navigation-panel.js  2021-08-03  usp
//

	// Store a reference to the frequently needed navigation panel
let navpanel;
	// Special site links
export let parent = "#", first = "#", previous = "#", next = "#", last = "#" ;
	// Link list, the nodes between root and the current document node
export let parents = [ ] ;

export function initPage ( tocsrc = "/toc.htm" ) {
	/// tocsrc : path to the table-of-contents file
	navpanel = navpanel || document.createElement( "DIV" );
	navpanel.id = "navigation-panel" ;
	navpanel.setAttribute( "load-src", tocsrc );
	navpanel.style.maxWidth = "0px" ;
	navpanel.addEventListener( "transitionend", transitionEndHandler );
	navpanel.addEventListener( "click", panelClickHandler );
	document.body.insertBefore( navpanel, null );	
	}

function panelClickHandler ( evt ) {
	if ( evt.target.id === "navigation-panel" ) navigateButtonClickHandler( evt );
	}

export function navigateButtonClickHandler ( evt ) {
	if ( navpanel.style.maxWidth === "0px" ) 
		navpanel.style.maxWidth = Math.min( navpanel.scrollWidth + 10, document.body.clientWidth ) + "px" ;
	else {
		if ( navpanel.style.maxWidth === "none" ) navpanel.style.maxWidth = document.body.clientWidth + "px" ;
		window.requestAnimationFrame( ( ) => navpanel.style.maxWidth = "0px" ) ;
		}
	evt.preventDefault( );
	evt.stopPropagation( );
	}

function transitionEndHandler ( evt ) {
	if ( evt.target.style.maxWidth === document.body.clientWidth + "px" ) evt.target.style.maxWidth = "none" ;
	evt.preventDefault();
	evt.stopPropagation( );
	}

export function findCurrentDocument( ) {
	const links = navpanel.getElementsByTagName( "A" );
	for ( let i = 0 ; i < links.length ; i ++ ) {
		const link = links[ i ];
		if ( link.href === document.location.href ) {
			if ( i > 0 ) previous = links[ i - 1 ].href;
			if ( i < links.length - 1 ) next = links[ i + 1 ].href;
			let e = link.parentNode.parentNode.firstElementChild.querySelector( "LI>A" );
			if ( e ) first = e.href;
			e = link.parentNode.parentNode.lastElementChild.querySelector( "LI>A" );
			if ( e ) last = e.href;
			activateLinkChain( link );
			if ( parents.length > 0 ) parent = parents[ parents.length - 1 ];
			break;
	} } }

export function activateLinkChain( e ) {
	while ( (e = e.parentNode) ) {
		if ( e.tagName === "LI" ) {
			let link = e.querySelector( "LI>A" );
			if ( link ) parents.unshift( link.href );
			e.setAttribute( "active", "" );
			if ( e.getAttribute( "cbc" ) === "collapsed" ) {
				e.setAttribute( "cbc", "expanded" );
				e.synesis.collapsibleBlock.style.maxHeight = e.synesis.collapsibleBlock.scrollHeight + "px";
	} } } 
	if (parents.length > 0) parents.pop( );
	}

