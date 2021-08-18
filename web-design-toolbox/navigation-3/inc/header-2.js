//
// header-2.js  usp 2021-07-27
//

export function initPage( ) {
	/// Creates the page header container with the embedded SVG graphics.
	const header = document.createElement( "DIV" );
	header.className = "page-header" ;
	document.body.insertBefore( header, document.body.firstChild );
	// Create the SVG element. 
	header.innerHTML = '<svg viewBox="5 0 142 50" width="213" height="75" version="1.1" xmlns="http://www.w3.org/2000/svg"><text x="13" y="43" class="clef">?</text><line x1="10" y1="10" x2="40" y2="10"/><line x1="10" y1="18" x2="40" y2="18"/><line x1="10" y1="26" x2="142" y2="26"/><line x1="10" y1="34" x2="40" y2="34"/><line x1="10" y1="42" x2="40" y2="42"/><text x="140" y="24" class="logotext logotext-1">Bassmati</text><text x="140" y="38" class="logotext logotext-2">on Code</text></svg>' ;
	}

