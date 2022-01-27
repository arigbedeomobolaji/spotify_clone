import { playlistState } from '@src/atoms/playlistAtoms';
import { useRecoilValue } from 'recoil';
import Song from './Song';

export type Track = {
	name: string;
	duration_ms: number;
	id: string;
	album: Album;
	artists: Artist[];
	uri: string;
};

type Album = {
	images: Image[];
	name: string;
};

type Image = {
	height: number;
	url: string;
	width: number;
};

type Artist = {
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
};

export interface Songs {
	track: Track;
	index: number;
}

function Songs() {
	const playlist = useRecoilValue(playlistState);
	return (
		<div className='px-8 flex flex-col space-y-1 pb-20 text-white'>
			{playlist?.tracks?.items.map(({ track }: Songs, index: number) => (
				<Song key={track.id + index} track={track} index={index} />
			))}
		</div>
	);
}

export default Songs;
