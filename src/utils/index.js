export const AUDIO_PATH_PLAYER_ARRAY = {
  jump: "/audio/saut.wav",
  dead: "/audio/mort.wav",
  start: "/audio/song.mp3",
  score: "/audio/score.wav",
};

export const playAudio = (path, volume = 0.1, audioPassed = undefined) => {
  const audio = audioPassed ?? new Audio(path);
  audio.volume = volume;
  audio.play();

  return audio;
};

export const stopAudio = (audio) => {
  audio.pause();
  audio.currentTime = 0;
};
