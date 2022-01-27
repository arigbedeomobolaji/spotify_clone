import {
	LogoutIcon,
	HomeIcon,
	SearchIcon,
	LibraryIcon,
	PlusCircleIcon,
	HeartIcon,
	RssIcon,
} from '@heroicons/react/outline';
import { playlistIdState } from '@src/atoms/playlistAtoms';
import useSpotify from '@src/hooks/useSpotify';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';

type Playlist = {
	collaborative: boolean;
	description: string;
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
};

function SideBar() {
	const spotifyApi = useSpotify();
	const { data: session, status } = useSession();
	const [playlists, setPlaylists] = useState<Playlist[]>([]);
	const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

	useEffect(() => {
		async function retrievePlaylists() {
			if (spotifyApi.getAccessToken()) {
				const spotifyPlayLists = await spotifyApi.getUserPlaylists(
					'31hmqduaun34in2ujl75audyespi'
				);
				setPlaylists(spotifyPlayLists.body.items);
			}
		}
		retrievePlaylists();
	}, [session, spotifyApi]);

	return (
		<div className='hidden md:inline-flex text-gray-500 p-5 pb-36 text-xs md:text-sm sm:max-w-[12rem] md:max-w-[15rem] border-r border-gray-900 overflow-y-scroll h-[85vh] scrollbar-hide'>
			<div className='space-y-4'>
				<button
					className='flex item-center space-x-2 hover:text-white'
					onClick={() => signOut()}
				>
					<LogoutIcon className='h-5 w-5' />
					<p>Logout</p>
				</button>
				<button className='flex item-center space-x-2 hover:text-white'>
					<HomeIcon className='h-5 w-5' />
					<p>Home</p>
				</button>
				<button className='flex item-center space-x-2 hover:text-white'>
					<SearchIcon className='h-5 w-5' />
					<p>Search</p>
				</button>
				<button className='flex item-center space-x-2 hover:text-white'>
					<LibraryIcon className='h-5 w-5' />
					<p>Library</p>
				</button>
				<div className='border-t-[0.1px] border-gray-900'></div>

				{/* aanother section */}
				<button className='flex item-center space-x-2 hover:text-white'>
					<PlusCircleIcon className='h-5 w-5' />
					<p>Create Playlist</p>
				</button>
				<button className='flex item-center space-x-2 hover:text-white'>
					<HeartIcon className='h-5 w-5' />
					<p>Liked Songs</p>
				</button>
				<button className='flex item-center space-x-2 hover:text-white'>
					<RssIcon className='h-5 w-5' />
					<p>Episode</p>
				</button>
				<div className='border-t-[0.1px] border-gray-900'></div>
				{playlists?.map((playlist: Playlist) => (
					<p
						key={playlist.id}
						className='cursor-pointer hover:text-white'
						onClick={() => setPlaylistId(playlist.id)}
					>
						{playlist.name}
					</p>
				))}
			</div>
		</div>
	);
}
export default SideBar;
