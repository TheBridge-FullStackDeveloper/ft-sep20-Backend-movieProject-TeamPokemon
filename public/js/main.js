let bodySelector = document.querySelector("body");

function paintIndex(){
	let searcherInput = document.createElement("input");
	searcherInput.type = "text";
	searcherInput.id = "searcherInput";
	bodySelector.appendChild(searcherInput);

	let btnToSearch = document.createElement("button");
	btnToSearch.id = "btnToSearch";
	bodySelector.appendChild(btnToSearch);
	btnToSearch.addEventListener("click", SearchMovies);
}

paintIndex();

function SearchMovies(){


	let getValueTitle = document.querySelector("#searcherInput");

	fetch(`http://localhost:8080/SearchMovies/${getValueTitle}`);
}