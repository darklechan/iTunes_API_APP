//Creo las variables que necesito:
let button = document.getElementById("submit");
let input = document.getElementById("input_text");
let output_list = document.getElementById("output_list");


//añado un evento al botón de buscar:
button.addEventListener("click", getDataFromApi);

function getDataFromApi() {
  const url = "https://itunes.apple.com/search?term=" + input.value;
  fetch(url)
  .then((response) => response.json())
  .then(data => {
    let html = "";
    console.log("esto es lo k hay: ",data);
    data.results.forEach(song => {
          //hay que mostrar el título y el autor
          html += `
              <li class="collection-item avatar">
                <img src=${song.artworkUrl60} alt="" class="circle">
                <span class="title">${song.artistName}</span>
                <p>${song.trackName}<br>
                </p>
              </li>
          `;
        })
      
      
      output_list.innerHTML = html;
    });
}

// .catch((error) => console.log(error));