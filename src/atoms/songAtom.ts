import { atom } from 'recoil';
// It holds the Id of the current track that's playing
export const currentTrackIdState = atom({
	key: 'currentTrackIdState',
	default: null,
});

// It holds the state of the currently playing song
// true if it's playing
// false if it's not playing
export const isPlayingState = atom({
	key: 'isPlayingState',
	default: false,
});
