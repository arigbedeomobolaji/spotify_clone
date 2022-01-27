import spotifyApi from '@src/lib/spotify';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';

function useSpotify() {
	const { data: session, status } = useSession();
	useEffect(() => {
		if (session) {
			// If refresh access token attempt fails, direct user to login..
			if (session.error === 'refreshAccessTokenError') {
				signIn();
			}

			spotifyApi.setAccessToken(session.user.accessToken);
		}
	}, [session]);

	return spotifyApi;
}

export default useSpotify;
