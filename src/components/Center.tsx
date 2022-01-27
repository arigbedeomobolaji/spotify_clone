import { signOut, useSession } from 'next-auth/react';
import { UserIcon } from '@heroicons/react/solid';
import { LogoutIcon } from '@heroicons/react/outline';
import { shuffle } from 'lodash';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistState, playlistIdState } from '@src/atoms/playlistAtoms';
import useSpotify from '@src/hooks/useSpotify';
import Songs from './Songs';

const colors = [
	'from-indigo-500',
	'from-blue-500',
	'from-green-500',
	'from-red-500',
	'from-yellow-500',
	'from-pink-500',
	'from-purple-500',
];
function Center() {
	const spotifyApi = useSpotify();
	const { data: session } = useSession();
	const [color, setColor] = useState(null);
	const [playlist, setPlaylist] = useRecoilState(playlistState);
	const playlistId = useRecoilValue(playlistIdState);

	useEffect(() => {
		setColor(shuffle(colors).pop());
	}, [playlistId]);

	useEffect(() => {
		async function getPlaylist() {
			try {
				if (spotifyApi.getAccessToken()) {
					const currentPlaylist = await spotifyApi.getPlaylist(
						playlistId
					);
					setPlaylist(currentPlaylist.body);
				}
			} catch (error) {
				console.log('something went wrong!!!>>>', error);
			}
		}
		getPlaylist();
	}, [playlistId]);
	return (
		<div className='flex-grow h-[85vh] pb-5 overflow-y-scroll scrollbar-hide text-white'>
			<header className='absolute top-5 right-8'>
				<div className='flex items-center text-white capitalize bg-black space-x-3 opacity-90 rounded-full p-1 pr-2 hover:opacity-80'>
					{session?.user?.image ? (
						<img
							src={session?.user?.image}
							alt='pics'
							className='w-6 h-6 rounded-full'
						/>
					) : (
						<UserIcon className='h-6 w-6 rounded-full bg-white text-gray-500' />
					)}
					<h2>{session?.user?.name}</h2>
					<LogoutIcon
						className='h-5 w-5 cursor-pointer'
						onClick={() => signOut()}
					/>
				</div>
			</header>

			<section
				className={`flex items-end h-80 space-x-7 bg-gradient-to-b ${color} to-black text-white p-8`}
			>
				{playlist && (
					<>
						<img
							className='h-24 w-24 shadow-2xl md:h-44 md:w-44'
							src={playlist?.images?.[0]?.url}
						/>
						<div>
							<p className='text-sm md:text-md'>PLAYLIST</p>
							<h1 className='text-xl font-bold md:text-3xl xl:text-5xl'>
								{playlist?.name}
							</h1>
						</div>
					</>
				)}
			</section>
			<Songs />
		</div>
	);
}

export default Center;
