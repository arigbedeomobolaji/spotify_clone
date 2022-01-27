import { debounce } from 'lodash';
import { currentTrackIdState, isPlayingState } from '@src/atoms/songAtom';
import useSpotify from '@src/hooks/useSpotify';
import useSongInfo from '@src/hooks/useSongInfo';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
	HeartIcon,
	VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline';
import {
	FastForwardIcon,
	PauseIcon,
	PlayIcon,
	ReplyIcon,
	VolumeUpIcon,
	RewindIcon,
	SwitchHorizontalIcon,
} from '@heroicons/react/solid';

function Player() {
	const spotifyApi = useSpotify();
	const songInfo = useSongInfo();
	const { data: session, status } = useSession();
	const [currentTrackId, setCurrentTrackId] =
		useRecoilState(currentTrackIdState);
	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
	const [volume, setVolume] = useState(50);

	async function fetchCurrentSong(): void {
		if (!songInfo) {
			const currentPlayingTrack =
				await spotifyApi.getMyCurrentPlayingTrack();
			console.log('currentPlayingTrack >>>', currentPlayingTrack);
			setCurrentTrackId(currentPlayingTrack.body?.item.id);
			const currentPlaybackState =
				await spotifyApi.getMyCurrentPlaybackState();
			console.log('currentPlaybackState >>>', currentPlaybackState);
			setIsPlaying(currentPlaybackState?.body?.is_playing);
		}
	}

	async function handlePlayPause(): void {
		const currentPlayBackState =
			await spotifyApi.getMyCurrentPlaybackState();
		if (currentPlayBackState.body.is_playing) {
			spotifyApi.pause();
			setIsPlaying(false);
		} else {
			spotifyApi.play();
			setIsPlaying(true);
		}
	}

	const debouncedAdjustVolume = useCallback(() => {
		debounce(async (volume) => {
			try {
				await spotifyApi.setVolume(volume);
			} catch (error) {
				console.log('setting Volume error', error);
			}
		}, 500);
	}, []);

	useEffect(() => {
		if (!currentTrackId && spotifyApi.getAccessToken()) {
			fetchCurrentSong();
			setVolume(50);
		}
	}, [currentTrackId, spotifyApi, session, songInfo]);

	useEffect(() => {
		if (volume > 0 && volume < 100) {
			debouncedAdjustVolume(volume);
		}
	}, [volume]);
	return (
		<div className='text-xs md:text-base px-2 md:px-8 h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3'>
			{/* Left */}
			<div className='flex items-center space-x-4'>
				<img
					className='hidden md:inline-flex h-10 w-10'
					src={songInfo?.album?.images?.[0]?.url}
					alt=''
				/>
				<div>
					<h3>{songInfo?.name}</h3>
					<p>{songInfo?.artists?.[0]?.name}</p>
				</div>
			</div>

			{/* Center */}
			<div className='flex items-center justify-evenly'>
				<SwitchHorizontalIcon className='button' />
				<RewindIcon className='button' />
				{isPlaying ? (
					<PauseIcon
						className='playbutton'
						onClick={handlePlayPause}
					/>
				) : (
					<PlayIcon
						className='playbutton'
						onClick={handlePlayPause}
					/>
				)}
				<FastForwardIcon className='button' />
				<ReplyIcon className='button' />
			</div>

			{/* Right - Volume */}
			<div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5'>
				<VolumeDownIcon
					className='button'
					onClick={() => volume > 0 && setVolume(volume - 10)}
				/>
				-
				<input
					className='w-14 md:w-28 '
					type='range'
					value={volume}
					onChange={(e) => setVolume(Number(e.target.value))}
					min={0}
					max={100}
				/>
				<VolumeUpIcon
					className='button'
					onClick={() => volume < 100 && setVolume(volume + 10)}
				/>
			</div>
		</div>
	);
}

export default Player;
