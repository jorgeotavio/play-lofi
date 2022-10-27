import { useCallback, useEffect, useRef, useState } from "react";
import NextSvg from "../../components/NextSvg";
import PauseSvg from "../../components/PauseSvg";
import PlaySvg from "../../components/PlaySvg";
import PrevSvg from "../../components/PrevSvg";
import musics from "../../data/musics";
import { Music } from "../../types";

function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playBtnRef = useRef<HTMLButtonElement | null>(null);

  const [currentIndexPlaylist, setCurrentIndexPlaylist] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [music, setMusic] = useState<Music>();

  const createAudioElement = useCallback(async () => {
    if (music) {
      audioRef.current = new Audio(music.urlMusic);
      audioRef.current.src = music.urlMusic;

      audioRef.current.addEventListener("loadedmetadata", (event) => {
        const target = event.target as HTMLAudioElement;
        setDuration(Math.round(target?.duration));
      });

      try {
        audioRef.current?.play();
      } catch (e) {
        console.log(e);
      }
    }
  }, [music]);

  const clearAudio = () => {
    audioRef.current?.pause();
    audioRef.current = null;
  };

  const prevMusic = useCallback(() => {
    clearAudio();
    setCurrentIndexPlaylist((current) => {
      if (current - 1 < 0) {
        return musics.length - 1;
      }
      return current - 1;
    });
  }, []);

  const nextMusic = useCallback(() => {
    clearAudio();
    setCurrentIndexPlaylist((current) => {
      if (current + 1 >= musics.length) {
        return 0;
      }
      return current + 1;
    });
  }, []);

  useEffect(() => {
    let timer = setInterval(() => {
      if (audioRef.current?.currentTime !== undefined) {
        setProgress(audioRef.current?.currentTime);
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    setMusic(musics[currentIndexPlaylist]);
  }, [currentIndexPlaylist]);

  useEffect(() => {
    createAudioElement();
  }, [music]);

  const formatTime = (value: number) => {
    let seconds = parseInt(Math.floor(Math.abs(value)).toFixed(0));
    seconds %= 60;
    return (value - (value %= 60)) / 60 + (9 < seconds ? ":" : ":0") + seconds;
  };

  return (
    <div className="main-container" style={{ textAlign: "center" }}>
      <div className="player-container">
        <div>
          <img src={music?.image} alt="" />
        </div>
        <div className="info">
          <h1>{music?.name}</h1>
          <h2>{music?.artist}</h2>
        </div>
        {duration && (
          <div className="progress">
            <progress value={progress} max={duration}></progress>
            <div className="time-info">
              <div className="info">{formatTime(duration)}</div>
              <div className="info">{formatTime(progress - duration)}</div>
            </div>
          </div>
        )}
        <div className="commands">
          <button title="Prev" onClick={prevMusic}>
            <PrevSvg />
          </button>
          <button
            title="Play/Pause"
            ref={playBtnRef}
            onClick={() => {
              audioRef.current?.paused
                ? audioRef.current?.play()
                : audioRef.current?.pause();
            }}
          >
            {audioRef.current?.paused ? <PlaySvg /> : <PauseSvg />}
          </button>
          <button title="Next" onClick={nextMusic}>
            <NextSvg />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
