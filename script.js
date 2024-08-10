const button = document.getElementById("submit");
const input = document.getElementById("input_text");
const output_list = document.getElementById("output_list");
const media_player = document.getElementById("media_player");

button.addEventListener("click", getDataFromApi);

async function getDataFromApi() {
  const searchTerm = input.value
  
  const url =
    `https://itunes.apple.com/search?term=${searchTerm}&country=es&media=music&limit=25`;
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      const data = json;
      renderData(data);
    }).catch((error) => {
      console.log(error);
    });
}


function renderData(data) {
  output_list.innerHTML = "";
  data.results.forEach((song) => {
    let li = document.createElement("li");
    li.setAttribute("id", song.trackId);
    li.classList.add("collection-item");
    li.innerHTML += `
      <span class="center-align""><i class="small material-icons">play_arrow</i></span>
      <span class="title" id="track">${song.artistName} - ${song.trackName}</span>
      `;
    li.addEventListener("click", () => {
      const currentGrey = document.querySelector(".background-grey");
      if (currentGrey) {
        currentGrey.classList.remove("background-grey");
        
      }

      li.classList.add("background-grey");
      showMediaPlayer(song, data.results);
    });

    output_list.appendChild(li);
  });
}

function showMediaPlayer(song, data) {
  let html = "";
  if (song.kind === "song") {
     html += `
    <li class="collection-item" id="tracklist">
    <img src="${song.artworkUrl60}" alt="" class="circle" id="artistPhoto">
    <span class="title" id="artistname">${song.artistName} - ${song.trackName}</span><br><br>
    <video controls autoplay id="player" width="300" height="auto" name="media"><source id="source" src="${song.previewUrl}" type="audio/x-m4a"></video>
    </li>
    `;
    media_player.innerHTML = html;

    nextSongFunction(player, data, song)
  }

  function nextSongFunction(player, data, currentSong) {
    player.addEventListener('ended', () => {
        const currentSongPosition = data.indexOf(currentSong)
        let nextSong = data[currentSongPosition + 1]

        if (currentSongPosition >= 0 && currentSongPosition < data.length - 1) {
          let artistImage = document.querySelector("#artistPhoto");
          artistImage.src = nextSong.artworkUrl60;
  
          let artistName = document.querySelector("#artistname");
          artistName.innerText = nextSong.artistName + ' - ' + nextSong.trackName;
  
          document.querySelector('video').src = nextSong.previewUrl;

          player.play()
          let currentliSong = document.getElementById(currentSong.trackId)
          currentliSong.classList.remove("background-grey");
          let liSong = document.getElementById(nextSong.trackId)
          liSong.classList.add("background-grey");
        }

        nextSongFunction(player, data, nextSong)
    })
  }
}
