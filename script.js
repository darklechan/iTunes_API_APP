//Creo las variables que necesito:
let button = document.getElementById("submit");
let input = document.getElementById("input_text");
let output_list = document.getElementById("output_list");

//añado un evento al botón de buscar:
button.addEventListener("click", getDataFromApi);

function getDataFromApi() {
  const url = "https://itunes.apple.com/search?term=" + input.value;
//   console.log(url);
  fetch("https://itunes.apple.com/search?term=" + input.value)
  .then((response) => response.json())
  .then((json) => console.log(json))
  .catch((error) => console.log(error));
}
// console.log(input.value);
