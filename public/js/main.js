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
	let getValueTitle = document.querySelector("#searcherInput").value;

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
<<<<<<< HEAD
	titleMovie.id = d.Search[0];
}

function loginWithGoogle(e){
	e.preventDefault();
	//window.location.assign("http://localhost:8888/loginG");
	window.location.href = "/loginG";
}

document.getElementById("bt").addEventListener("click", loginWithGoogle);
=======
	// titleMovie.id = d.Search[0];
}
>>>>>>> 7724c606297bb9b1e808f89e7fc6eef296c2b26f
