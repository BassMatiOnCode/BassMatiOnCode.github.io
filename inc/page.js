
var Synesis = { } ;

if ( ! Synesis.CollapsibleBlock ) {
	///		Implements collapsible block functions.
	Synesis.CollapsibleBlock = { } ;
	Synesis.CollapsibleBlock.setState = function ( element, state ) {
		///		Sets or toggles the collapsible block controller state.
		if ( state === undefined ) state = element.getAttribute( "cbs" ) === "1" ? "0" : "1" ;
		element.setAttribute( "cbs", state );
		switch ( element.tagName ) {
		case "DT" : 
			while ( (element = element.nextElementSibling) && element.tagName !== "DT" )
				element.setAttribute( "collapsed", state );
			break;
		case "LI" :
			for ( const child of element.children ) 
				if ( child.tagName === "UL" || child.tagName === "OL" ) {
					child.setAttribute( "collapsed", state );
					break; }
			break;
		default : 
			element.nextElementSibling.setAttribute( "collapsed", state );
			break;
			}
		} ;
	Synesis.CollapsibleBlock.controllerClickHandler = function ( event ) { 
		///		Toggles the collapsible block controller state. 
		let controller = event.target;
		if ( controller.hasAttribute( "cbs" )) { 
			Synesis.CollapsibleBlock.setState( controller );	
			event.stopPropagation( );
		} } ;
	Synesis.CollapsibleBlock.setCollapseLockValue = function ( value ) {
		///		Sets or toggles the collapse lock value.
		if ( value === undefined ) value = document.body.getAttribute( "disable-collapse" ) === "1" ? "0" : "1" ;
		switch ( value ) {
		case null :
			value = "0" ;
			// indended fall through
		case "0" : 
			this.textContent = "Show Collapsed Content" ;
			break;
		default :
			value = "1" ; 
			// intended fall through
		case "1" : 
			this.textContent = "Hide Collapsed Content" ;
			break;
			}
		document.body.setAttribute( "disable-collapse", value );
		} ;
	///		Module Init
	///		The DOM tree must be complete at this point.
	for ( const controller of document.querySelectorAll( "[cbs]" )) {
		///		Initializes collapsible blocks and their controller elements.
		controller.addEventListener( "click", Synesis.CollapsibleBlock.controllerClickHandler );
		Synesis.CollapsibleBlock.setState( controller, controller.getAttribute( "cbs" ) === "0" ? "0" : "1" );
		}
	let button = document.getElementById( "stopHide" );
	if ( button ) {
		button.addEventListener ( "click" , function ( ) { Synesis.CollapsibleBlock.setCollapseLockValue.call( this ); } );
		Synesis.CollapsibleBlock.setCollapseLockValue.call( button, document.body.getAttribute( "disable-collapse" ));
		}
	if ( document.location.hash ) {
		///		Expand collapsibe elements that contain the link target element.
		let e = document.getElementById( document.location.hash.substring( 1 ));
		let target = e;
		while ( e && e !== document.body ) {
			if ( e.hasAttribute( "cbs" )) {
				Synesis.CollapsibleBlock.setState( e, "0" );
				e = e.parentElement;
				}
			else if ( e.hasAttribute( "collapsed" ))
				e = e.previousElementSibling ;
			}
		window.addEventListener( "load", function ( ) {
			console.log( "hello2" );
			window.requestAnimationFrame ( function(  ) {
				target.scrollIntoView( { behavior : "smooth" , block : "start" } ); 
				} ) ;
			} ) ;
		}
	
	}
