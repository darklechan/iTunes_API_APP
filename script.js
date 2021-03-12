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
    });
}

/*
  Con esta función he intentado hacer lo del array.sort() ya que era lo que había
  visto en la documentación, pero al intentar añadirlo me salían problemas. No sé
  si me he complicado mucho y en realidad es más sencillo pero como no me salía
  he decidido dejarlo. La idea la he sacado de aquí: https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
  Ej: data.sort(sortFilesByType("song"));
  */

// function sortFilesByType(kind) {
//   return function (a, b) {
//     if (a[kind] > b[kind]) {
//       return 1;
//     } else if (a[kind] < b[kind]) {
//       return -1;
//     }
//     return 0;
//   };
// }

/*
  Con esta función hago el display de los datos de getDataFromApi
  y los muestro en una lista
  */
function renderData(data) {
  let touchStartX = 0;
  let touchEndX = 0;
  output_list.innerHTML = "";
  data.results.forEach((song) => {
    let li = document.createElement("li"); //voy creando lis
    li.classList.add("collection-item"); //de esta manera se crea igual que en HTML
    li.innerHTML += `
      <span class="center-align""><i class="small material-icons">play_arrow</i></span>
      <span class="title" id="track">${song.artistName} - ${song.trackName}</span>
      `;
    li.addEventListener("click", () => {
      li.style.backgroundColor = "grey";
      if(li.previousSibling === null) {
        console.log("no hay elemento anterior");
      } else {
        li.previousSibling.removeAttribute("style");
      }
      
      // li.nextElementSibling.style.backgroundColor = "initial";
      showMediaPlayer(song); //esto es lo mismo que ponerlo en el html
    });
    output_list.appendChild(li);

    /*
    En esta parte empieza el evento del swipe, funciona un poco de aquella manera
    pero no he sabido hacerlo mejor, se puede optimizar muchísimo mejor pero no
    he lo he conseguido. Además el problema que hay es que cuando borras esa canción
    se queda en autoplay porque es el primer evento que se ejecuta.
    */
    li.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    li.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX) {
        // alert('¿Deseas borrar esa canción?');
        let removeButton = "";
        removeButton += `
        <button class="waves-effect btn-small" id="removeBtn">Delete</button>
        `;
        li.innerHTML = removeButton;
        let removeBtn = document.getElementById("removeBtn");
        removeBtn.addEventListener("click", () => {
          li.remove();
        });
      } else if (touchEndX < touchStartX) {
        let removeButton = "";
        li.innerHTML = removeButton;
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
    /*
    En este apartado he intentado hacer lo del play pero el problema es que se queda
    en el mismo elemento y hace un loop de la canción. He probado de varias maneras
    pero no he conseguido que pasara al siguiente elemento de la lista. Imagino que
    en lugar de iterar sobre el player, debo iterar sobre la lista y que vaya detectando
    el final de la canción.
    */
    var nextsrc = song.previewUrl;
    var player = document.getElementById("player");
    player.onended = function () {
      for (var i = 0; i < nextsrc.length; i++) {
        player.play(nextsrc[i]);
      }
    };
  }
}
