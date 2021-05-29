//
//	recursive-snippet-loader
//	2021-04-12 usp
//

async function loadSnippet ( target, options ) {
	const uri = (( options.path + "/" ) || "" ) + target.getAttribute( "snippet" );
	console.log( "fetching " + uri );
	const response = await fetch( uri )
		.then( r => r.text() )
		.then( t => { target.innerHTML = t; return target; } );
	console.log( "fetched " + uri );
	return response;
	};

export async function loadSnippets ( container=document.body, options={ } ) {
	/// Loads snippets defined in the container, and in loaded snippets, recursively.
	/// container : HTML element that is searched for snippet elements. Default = document.body.
	/// options.finishers : Array of function references, applied on the loaded snippets.
	let requests = [ ];
	let targets = container.querySelectorAll( "[snippet]" );
	debugger;
	targets.forEach( target => requests.push( loadSnippet( target, options )));
	return Promise.all( requests ).then( targets => targets.forEach ( 
		target => console.log( target.getAttribute( "snippet" ))));
	debugger;
	}

