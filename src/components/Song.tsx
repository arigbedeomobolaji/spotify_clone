import { currentTrackIdState, isPlayingState } from '@src/atoms/songAtom';
import useSpotify from '@src/hooks/useSpotify';
import milliToMinute from '@src/lib/time';
import { useRecoilState } from 'recoil';
import { Songs } from './Songs';

function Song({ track, index }: Songs) {
	const spotifyApi = useSpotify();
	const [currentTrackId, setCurrentTrackId] =
		useRecoilState(currentTrackIdState);
	const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

	async function playSong() {
		setCurrentTrackId(track.id);
		setIsPlaying(true);
		// if (spotifyApi.getAccessToken()) {
		// 	await spotifyApi.play({
		// 		uris: [track.uri],
		// 	});
		// }
		alert('We are very sorry we have cancelled subscription to spotify.');
	}

	return (
		<div
			className='grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg'
			onClick={playSong}
		>
			<div className='flex items-center space-x-4 cursor-pointer'>
				<div>{index + 1}</div>
				<img className='h-10 w-10' src={track.album.images[0].url} />
				<div>
					<p className='w-36 lg:w-64 truncate text-white'>
						{track?.name}
					</p>
					<p className='w-40'>{track.artists[0].name}</p>
				</div>
			</div>
			<div className='flex items-center justify-between ml-auto md:ml-0'>
				<p className='hidden md:inline-flex w-40'>{track.album.name}</p>
				<p>{milliToMinute(track.duration_ms)}</p>
			</div>
		</div>
	);
}

export default Song;
