const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");
const progressBar = document.getElementById("progress-bar");

const allSongs = [
    {
        id: 0,
        title: "Out of Touch",
        artist: "Daryl Hall & John Oates",
        src: "music/out-of-touch.mp3",
        img: "https://fastly-s3.allmusic.com/artist/mn0000674887/400/mW5KusJ8gKFOmOTGsurLYg4Q1ghY8VaPylnm7PwcKNY=.jpg"
    },
    {
        id: 1,
        title: "Another Day in Paradise",
        artist: "Phil Colins",
        src: "music/another-day-in-paradise.mp3",
        img: "https://pics.filmaffinity.com/phil_collins_another_day_in_paradise-631623571-large.jpg"
    },
    {
        id: 3,
        title: "Time After Time",
        artist: "Cyndi Lauper",
        src: "music/time-after-time.mp3",
        img: "https://i1.sndcdn.com/artworks-CuP8d09L0gvkyEYi-5eaOBw-t500x500.jpg"
    }
];

const audio = new Audio();
let userData = {
    songs: [...allSongs],
    currentSong: null,
    songCurrentTime: 0,
};


// Update progress bar as the song plays
audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        const progressPercentage = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }
});


// Helper functions
const getCurrentSongIndex = () => userData.songs.indexOf(userData.currentSong);
const setPlayButtonAccessibleText = () => {
    const song = userData.currentSong || userData.songs[0];
    playButton.setAttribute("aria-label", song ? `Play ${song.title}` : "Play");
};

const renderSongs = (songs) => {
    playlistSongs.innerHTML = songs.map(song => `
        <li class="playlist-song flex border-b py-3 cursor-pointer hover:shadow-md px-2" id="song-${song.id}">
            <img class='w-10 h-10 object-cover rounded-lg' src='${song.img}' alt='${song.title} album cover'>
            <div class="flex flex-col px-2 w-full">
                <button class="playlist-song-info" onclick="playSong(${song.id})">
                    <span class="playlist-song-title text-sm text-red-500 capitalize font-semibold pt-1">${song.title}</span>
                    <span class="playlist-song-artist text-xs text-gray-500 uppercase font-medium">${song.artist}</span>
                </button>
            </div>
        </li>
    `).join("");
};

const setPlayerDisplay = () => {
    const title = document.getElementById("player-song-title");
    const artist = document.getElementById("player-song-artist");
    const img = document.getElementById("player-song-img");

    title.textContent = userData.currentSong?.title || "No song playing";
    artist.textContent = userData.currentSong?.artist || "No artist";
    img.src = userData.currentSong?.img || "https://t4.ftcdn.net/jpg/00/47/91/87/360_F_47918751_6KYmK01HuduPKu2JYGOk67HQGw5RG1uC.jpg";  // Use placeholder image if no song is playing
};

const highlightCurrentSong = () => {
    document.querySelectorAll(".playlist-song").forEach(songEl => songEl.removeAttribute("aria-current"));
    const currentSongEl = document.getElementById(`song-${userData.currentSong?.id}`);
    if (currentSongEl) currentSongEl.setAttribute("aria-current", "true");
};

// Play song function with button toggle
const playSong = (id) => {
    const song = userData.songs.find(song => song.id === id);
    audio.src = song.src;
    audio.title = song.title;

    if (userData.currentSong === null || userData.currentSong.id !== song.id) {
        audio.currentTime = 0;
    } else {
        audio.currentTime = userData.songCurrentTime;
    }
    
    userData.currentSong = song;
    highlightCurrentSong();
    setPlayerDisplay();
    setPlayButtonAccessibleText();

    // Show pause button and hide play button
    playButton.classList.add("hidden");
    pauseButton.classList.remove("hidden");
    
    audio.play();
};

// Pause song function with button toggle
const pauseSong = () => {
    userData.songCurrentTime = audio.currentTime;
    audio.pause();

    // Show play button and hide pause button
    playButton.classList.remove("hidden");
    pauseButton.classList.add("hidden");
};

const playNextSong = () => {
    const currentIndex = getCurrentSongIndex();
    const nextSong = userData.songs[(currentIndex + 1) % userData.songs.length];
    playSong(nextSong.id);
};

const playPreviousSong = () => {
    const currentIndex = getCurrentSongIndex();
    const prevSong = userData.songs[(currentIndex - 1 + userData.songs.length) % userData.songs.length];
    playSong(prevSong.id);
};

const shuffleSongs = () => {
    userData.songs = [...userData.songs].sort(() => Math.random() - 0.5);
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    renderSongs(userData.songs);
    pauseSong();
    setPlayerDisplay();
    setPlayButtonAccessibleText();
};

const deleteSong = (id) => {
    userData.songs = userData.songs.filter(song => song.id !== id);
    if (userData.currentSong?.id === id) pauseSong();
    renderSongs(userData.songs);
    highlightCurrentSong();
};

audio.addEventListener("ended", playNextSong);

playButton.addEventListener("click", () => {
    if (!userData.currentSong) playSong(userData.songs[0].id);
    else playSong(userData.currentSong.id);
});

pauseButton.addEventListener("click", pauseSong);
nextButton.addEventListener("click", playNextSong);
previousButton.addEventListener("click", playPreviousSong);
shuffleButton.addEventListener("click", shuffleSongs);

renderSongs(userData.songs);
setPlayButtonAccessibleText();
setPlayerDisplay();
