import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import spotifyApi, { LOGIN_URL } from '@src/lib/spotify';

async function refreshAccessToken(token) {
	try {
		spotifyApi.setAccessToken(token.accessToken);
		spotifyApi.setRefreshToken(token.refreshToken);

		const { body: refreshedToken } = await spotifyApi.refreshAccessToken();

		console.log('refreshed token: ', refreshedToken);
		return {
			...token,
			accessToken: refreshedToken,
			accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
			refreshedToken: refreshedToken.refresh_token ?? token.refreshToken,
		};
	} catch (error) {
		console.log(error);
		return {
			...token,
			error: 'refreshAccessTokenError',
		};
	}
}
export default NextAuth({
	// https://next-auth.js.org/configuration/providers
	providers: [
		SpotifyProvider({
			clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
			clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
			authorization: LOGIN_URL,
		}),
	],

	secret: process.env.JWT_SECRET,

	// You can define custom pages to override the built-in ones. These will be regular Next.js pages
	// so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
	// The routes shown here are the default URLs that will be used when a custom
	// pages is not specified for that route.
	// https://next-auth.js.org/configuration/pages
	pages: {
		signIn: '/login', // Displays signin buttons
		// signOut: '/auth/signout', // Displays form with sign out button
		// error: '/auth/error', // Error code passed in query string as ?error=
		// verifyRequest: '/auth/verify-request', // Used for check email page
		// newUser: null // If set, new users will be directed here on first sign in
	},

	// https://next-auth.js.org/configuration/callbacks
	callbacks: {
		// async signIn({ user, account, profile, email, credentials }) { return true },
		// async redirect({ url, baseUrl }) { return baseUrl },
		async session({ session, token, user }) {
			session.user.accessToken = token.accessToken;
			session.user.refreshToken = token.refreshToken;
			session.user.username = token.username;

			return session;
		},

		async jwt({ token, user, account, profile, isNewUser }) {
			console.log({ token, user, account, profile, isNewUser });
			// if initial sigin in
			if (account && user) {
				return {
					...token,
					accessToken: account.access_token
						? account.access_token
						: '',
					refreshToken: account.refresh_token
						? account.refresh_token
						: '',
					username: account.providerAccountId
						? account.providerAccountId
						: '',
					accessTokenExpires: account.expires_at
						? account.expires_at * 1000
						: 0,
				};
			}

			// Return previous token if the access token has not expired yet
			if (Date.now() < token.accessTokenExpires) {
				console.log('exisitng access token is valid');
				return token;
			}

			// Access token has expired, so we need to refresh it

			return await refreshAccessToken(token);
		},
	},
});
