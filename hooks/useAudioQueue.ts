import { useState, useRef } from 'react';
import { useAudioPlayer } from 'expo-audio';

export default function useAudioQueue() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [queue, setQueue] = useState<any[]>([]);
  const [audioGroups, setAudioGroups] = useState<{[key: string]: any[]}>({});
  const [currentGroup, setCurrentGroup] = useState<string | null>(null);
  const [playbackPositions, setPlaybackPositions] = useState<{[key: string]: number}>({});

  const player = useAudioPlayer();
  const queueRef = useRef<any[]>([]);
  const isPlayingRef = useRef(false);
  const currentTrackRef = useRef<any>(null);
  const groupFirstInstanceRef = useRef<Set<string>>(new Set());
  const currentListenerRef = useRef<any>(null);

  const playNext = async () => {
    if (queueRef.current.length === 0) {
      isPlayingRef.current = false;
      setIsPlaying(false);
      setCurrentTrack(null);
      currentTrackRef.current = null;
      return;
    }

    const track = queueRef.current.shift();
    setQueue([...queueRef.current]);

    try {
      // Remove previous listener if exists
      if (currentListenerRef.current) {
        player.removeListener('playbackStatusUpdate', currentListenerRef.current);
      }

      // load and play the track
      player.replace({ uri: track.url });
      player.play();

      isPlayingRef.current = true;
      currentTrackRef.current = track;
      setIsPlaying(true);
      setCurrentTrack(track);
      setCurrentGroup(track.groupId);

      // listen for when track ends
      const listener = (status: any) => {
        // Check if playback has finished
        if (status.isLoaded && !status.isPlaying && status.currentTime >= status.duration - 0.1) {
          // save position
          setPlaybackPositions(prev => ({
            ...prev,
            [track.filename]: player.duration,
          }));
          playNext();
        }
      };
      
      currentListenerRef.current = listener;
      player.addListener('playbackStatusUpdate', listener);

    } catch (error) {
      console.error('Error playing track:', error);
      playNext();
    }
  };

  const addToQueue = async (track: any) => {
    // 5 second delay for first instance of group
    // if (!groupFirstInstanceRef.current.has(track.groupId)) {
    //   groupFirstInstanceRef.current.add(track.groupId);
    //   await new Promise(resolve => setTimeout(resolve, 5000));
    // }

    queueRef.current.push(track);
    setQueue([...queueRef.current]);

    setAudioGroups(prev => ({
      ...prev,
      [track.groupId]: [...(prev[track.groupId] || []), track]
    }));
  };

  const playPause = async () => {
    if (!isPlayingRef.current && queueRef.current.length > 0) {
      await playNext();
      return;
    }

    if (player.playing) {
      player.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      player.play();
      setIsPlaying(true);
      isPlayingRef.current = true;
    }
  };

  const switchToGroup = async (groupId: string) => {
    if (!audioGroups[groupId] || audioGroups[groupId].length === 0) return;

    // clear current queue and load group tracks
    queueRef.current = [...audioGroups[groupId]];
    setQueue([...queueRef.current]);

    // stop current playback
    player.pause();
    isPlayingRef.current = false;
    setCurrentGroup(groupId);

    // start playing from this group
    await playNext();
  };

  const skipToNext = async () => {
    player.pause();
    await playNext();
  };

  const skipToPrevious = async () => {
    player.seekTo(0);
    player.play();
  };

  const clearQueue = async () => {
    queueRef.current = [];
    setQueue([]);

    player.pause();
    isPlayingRef.current = false;
    setIsPlaying(false);
    setCurrentTrack(null);
    currentTrackRef.current = null;
    setCurrentGroup(null);
  };

  return {
    addToQueue,
    isPlaying,
    currentTrack,
    queue,
    audioGroups,
    currentGroup,
    playbackPositions,
    playPause,
    switchToGroup,
    skipToNext,
    skipToPrevious,
    clearQueue,
  };
}