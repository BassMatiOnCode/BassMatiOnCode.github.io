//
// collapsible-block-5.js  2021-08-27  usp
//

export function initPage ( container ) {
	// Decorate controller elements in collapsible trees.
	console.log( "collapsible:initPage" );
	if ( ! container ) container = document;
	let collapsibles = container.querySelectorAll( ".collapsible" );
	for ( let i = 0 ; i < collapsibles.length ; i ++ ) {
		let collapsible = collapsibles[ i ];
		let blocks = collapsible.querySelectorAll( "UL" );
		for ( let j = 0 ; j < blocks.length ; j ++ ) {
			let block = blocks[ j ];
			// Set a reference from controller to associated collapsible block.
			let controller = block.parentNode;
			if ( ! controller.hasAttribute( "cbc" )) controller.setAttribute( "cbc", "expanded" );
			if ( ! controller.synesis ) controller.synesis = { } ;
			controller.synesis.collapsibleBlock = block ;
			}
		let statics = collapsible.querySelectorAll( "LI:not([cbc])" );
		for ( let j = 0 ; j < statics.length ; j ++ ) statics[ j ].setAttribute( "cbc", "static" );
		}
	// Prepare collapsible blocks and their controllers
	let controllers = container.querySelectorAll( "[cbc]" );
	const defaultState = new RegExp( "collapse=all" )
		.test( document.location.search ) ? "collapsed" : "expanded" ;
	for ( let i = 0 ; i < controllers.length ; i ++ ) {
		let controller = controllers[ i ];
		if ( controller.getAttribute( "cbc" ) === "" ) controller.setAttribute( "cbc", defaultState );
		else if ( controller.getAttribute( "cbc" ) === "static" ) continue;
		// Set a reference from controller to collapsible block if not done above.
		controller.synesis = controller.synesis || { } ;
		let block =  controller.synesis.collapsibleBlock;
		if ( ! block ) {
			block = controller.synesis.collapsibleBlock = controller.nextElementSibling ;
			if ( block ) {
				// It is easier to set the block styles here than in CSS.
				block.style.transition = "max-height 0.6s ease-out" ;
				block.style.overflow = "hidden" ;
				} }
		// Initialize controller state and add event handlers.
		if ( controller.getAttribute( "cbc" ) === "collapsed" ) block.style.maxHeight = "0px" ;
		controller.addEventListener( "click" , iconClickHandler );
		block.addEventListener( "transitionend", transitionEndHandler );
		} 
	}

function toggleBlockState( controller ) {
	const block = controller.synesis.collapsibleBlock ;
	if ( controller.getAttribute( "cbc" ) === "collapsed" ) expand ( controller );
	else if ( controller.getAttribute( "cbc" ) === "expanded" ) collapse( controller );
	}
	
function iconClickHandler ( evt ) { 
	// if ( evt.x > 30 ) return;
	if ( ! this.synesis || ! this.synesis.collapsibleBlock || evt.target.tagName === "A" ) return ;
	toggleBlockState( this );
	evt.preventDefault();
	evt.stopPropagation( );
	}

function transitionEndHandler ( evt ) { 
	if ( evt.target.style.maxHeight !== "0px" ) evt.target.style.maxHeight = "none" ;
	evt.preventDefault();
	evt.stopPropagation( );
	}

function expand( controller ) {
	const block = controller.synesis.collapsibleBlock;
	block.style.maxHeight = block.scrollHeight + "px";
	controller.setAttribute( "cbc", "expanded" );
	}

function collapse( controller ) {
	const block = controller.synesis.collapsibleBlock;
	block.style.maxHeight = block.scrollHeight + "px" ;
	controller.setAttribute( "cbc", "collapsed" );
	window.requestAnimationFrame( function ( ) { block.style.maxHeight = "0px" ; } ) ;
	}

export function expandAllBlocks (  ) {
	/// Expand all collapsible content blocks.
	document.querySelectorAll( "#content [cbc='collapsed']" ).forEach( expand );
	}

export function collapseAllBlocks ( ) {
	/// Collapse all collapsible content blocks.
	document.querySelectorAll( "#content [cbc='expanded']" ).forEach( collapse );
	}

export function toggleAllBlocks ( evt ) {
	/// Toggles the visibility of collapsible blocks inside the content div element.
	/// Used as button click event handler.
	if ( this.toggleAttribute( "expand" )) collapseAllBlocks( ); else expandAllBlocks( );
	}

export function expandPath( id ) {
	let e = document.getElementById( id );
	if ( ! e ) return;
	if ( e.tagName === "LI" ) {
		if ( e.getAttribute( "cbc" ) === "collapsed" ) iconClickHandler( { target : e } );
		e = e.parentNode;
		}
	else {
		if ( e.previousElementSibling.getAttribute( "cbc" ) === "collapsed" ) iconClickHandler( { target : e.previousElementSibling } ) ;
		e = e.parentNode;
		} }