//Creo las variables que necesito:
const button = document.getElementById("submit");
const input = document.getElementById("input_text");
const output_list = document.getElementById("output_list");
const media_player = document.getElementById("media_player");

//añado un evento al botón de buscar:
button.addEventListener("click", getDataFromApi);

/*
Con esta función obtengo los datos de la api:
*/

function getDataFromApi() {
  const url =
    "https://itunes.apple.com/search?term=" + input.value + "&country=es";
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      const data = json;
      renderData(data);
      // console.log("esto es lo k hay: ", data);
    });
  }
  
  function sortFilesByType(kind) {
    return function (a, b) {
      if (a[kind] > b[kind]) {
        return 1;
      } else if (a[kind] < b[kind]) {
        return -1;
      }
      return 0;
    };
  }

  
  /*
  Con esta función hago el display de los datos de getDataFromApi
  y los muestro en una lista
  */
 function renderData(data) {
   let touchStartX = 0;
   let touchEndX = 0;
   output_list.innerHTML = "";
   data.results.forEach((song) => {
    //hay que mostrar el título y el autor
    let li = document.createElement("li"); //voy creando lis
    li.classList.add("collection-item"); //de esta manera se crea igual que en HTML ?
    li.innerHTML += `
      <span class="center-align""><i class="small material-icons">play_arrow</i></span>
      <span class="title" id="track">${song.artistName} - ${song.trackName}</span>
      `;
    li.addEventListener("click", (e) => {
      li.style.backgroundColor = "grey";
      // console.log("que color es:",li.classList.remove(changeColor)); //esto en teoria tiene que borrar el color :/
      // console.log("sibling?", li.nextSibling);
      showMediaPlayer(song); //esto es lo mismo que ponerlo en el html 
    });
    output_list.appendChild(li);

    //swipe and remove:
    li.addEventListener("touchstart", e => {
      touchStartX = e.changedTouches[0].screenX;
    });
    li.addEventListener("touchend", e => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX) {
        // alert('¿Deseas borrar esa canción?');
        let removeButton = "";
          removeButton += `
            <button class="waves-effect btn-small">Delete</button>
          `;
        // li.remove(); 
        
      } else {
        alert('swipe left bitch');
      }
      
    });
  });
}

function showMediaPlayer(song) {
  let html = "";
  if (song.kind === "feature-movie" || song.kind === "music-video") {
    html += `
    <li class="collection-item" id="tracklist">
    <img src="${song.artworkUrl60}" alt="" class="circle">
    <span class="title" id="artistname">${song.artistName} - ${song.trackName}</span><br><br>
    <video controls autoplay id="player" width="300" height="auto" name="media"><source src="${song.previewUrl}" type="audio/x-m4a"</video>
    </li>
    `;
    media_player.innerHTML = html;
  } else if (song.wrapperType === "audiobook") {
    let html = "";
    media_player.innerHTML = html;
  } else {
    html += `
    <li class="collection-item" id="tracklist">
    <img src="${song.artworkUrl60}" alt="" class="circle">
    <span class="title" id="artistname">${song.artistName} - ${song.trackName}</span><br><br>
    <video controls autoplay id="player" width="300" height="50" name="media"><source src="${song.previewUrl}" type="audio/x-m4a"</video>
    </li>
    
    `;
    media_player.innerHTML = html;
    var nextsrc = song.previewUrl;
    var player = document.getElementById("player");
    console.log(player);
    player.onended = function() {
      for (var i = 0; i < nextsrc.length; i++) {
        player.play(nextsrc[i]); 
      }
    }
  }
}
