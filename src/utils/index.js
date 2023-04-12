export const AUDIO_PATH_PLAYER_ARRAY = {
  jump: "/audio/saut.wav",
  dead: "/audio/mort.wav",
  start: "/audio/song.mp3",
  score: "/audio/score.wav",
};

export const playAudio = (audio, volume = 0.1) => {
  audio.volume = volume;
  audio.play();

  audio.onended = () => {
    audio.currentSrc = null;
    audio.src = "";
    audio.srcObject = null;
    audio.remove();
  };
};

export const stopAudio = (audio) => {
  audio.pause();
  audio.currentTime = 0;
};
