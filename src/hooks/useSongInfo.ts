import { currentTrackIdState } from '@src/atoms/songAtom';
import { Track } from '@src/components/Songs';
import useSpotify from '@src/hooks/useSpotify';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

function useSongInfo() {
	const spotifyApi = useSpotify();
	const [currentTrackId, setCurrentTrackId] =
		useRecoilState(currentTrackIdState);
	const [songInfo, setSongInfo] = useState<Track>(null);

	useEffect(() => {
		async function fetchSongInfo() {
			if (currentTrackId) {
				try {
					const response = await fetch(
						`https://api.spotify.com/v1/tracks/${currentTrackId}`,
						{
							headers: {
								Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
							},
						}
					);
					const trackInfo = await response.json();

					setSongInfo(trackInfo);
				} catch (error) {
					console.log('something went wrong >>>', error);
				}
			}
		}

		fetchSongInfo();
	}, [currentTrackId, spotifyApi]);

	return songInfo;
}

export default useSongInfo;
