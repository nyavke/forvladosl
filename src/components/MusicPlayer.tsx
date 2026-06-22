import { useEffect, useRef, useState } from 'react'
import cover from '../assets/serega-pirat-cover.jpg'
import track from '../assets/serega-pirat-dengimenjajut.mp3'
import '../styles/player.css'

const TITLE = '#деньгименяют'
const ARTIST = 'Серега Пират'

// Время в формате m:ss
function formatTime(sec: number): string {
  if (!Number.isFinite(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)

  // Подписки на события <audio>: прогресс, длительность, конец трека.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrent(audio.currentTime)
    const onMeta = () => setDuration(audio.duration)
    const onEnd = () => setPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnd)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      void audio.play()
      setPlaying(true)
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  // Перемотка по клику на полосу прогресса.
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audio.currentTime = Math.min(Math.max(ratio, 0), 1) * duration
  }

  const progress = duration ? (current / duration) * 100 : 0

  return (
    <div className="player">
      <audio ref={audioRef} src={track} preload="metadata" />

      {/* Карточка плеера */}
      <div className={`player__card ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="player__cover">
          <img src={cover} alt={`${ARTIST} — ${TITLE}`} />
        </div>

        <div className="player__meta">
          <span className="player__title">{TITLE}</span>
          <span className="player__artist">{ARTIST}</span>
        </div>

        <div
          className="player__bar"
          onClick={seek}
          role="slider"
          aria-label="Перемотка"
          aria-valuemin={0}
          aria-valuemax={Math.floor(duration)}
          aria-valuenow={Math.floor(current)}
        >
          <div className="player__bar-fill" style={{ width: `${progress}%` }}>
            <span className="player__bar-knob" />
          </div>
        </div>

        <div className="player__times">
          <span>{formatTime(current)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        <button
          className="player__play"
          onClick={togglePlay}
          aria-label={playing ? 'Пауза' : 'Играть'}
        >
          <i className={`fi ${playing ? 'fi-br-pause' : 'fi-br-play'}`} />
        </button>
      </div>

      {/* Незаметная стрелочка-переключатель */}
      <button
        className={`player__toggle ${open ? 'is-open' : ''} ${playing ? 'is-playing' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Свернуть плеер' : 'Открыть плеер'}
        aria-expanded={open}
      >
        <i className="fi fi-br-angle-small-up player__toggle-arrow" />
      </button>
    </div>
  )
}
