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

	fetch(`http://localhost:8080/SearchMovies/title/${getValueTitle}`)
		.then(res => res.json())
		.then(data => {

			data.map(d => {
				paintSearchedMovies(d);
			});
		});
}

function paintSearchedMovies(d, i){

	document.querySelector("input").remove();
	document.querySelector("button").remove();

	let movieContainer = document.createElement("div");
	movieContainer.id = `MovieContainer ${d[i]}`;

	let titleMovie = document.createElement("h2");
	titleMovie.id = d.Search[0];
}