import type { NextPage } from 'next';
import Head from 'next/head';
import SideBar from '@components/SideBar';
import Center from '@components/Center';
import { getSession } from 'next-auth/react';
import Player from '@src/components/Player';

const Home: NextPage = () => {
	return (
		<div className='bg-black h-screen overflow-hidden'>
			<Head>
				<title>Spotify Clone</title>
				<meta name='description' content='Spotify Clone with NextJS' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='flex'>
				<SideBar />
				<Center />
			</main>
			<div className='sticky bottom-0 border-t border-gray-900'>
				<Player />
			</div>
		</div>
	);
};

export default Home;

export async function getServerSideProps(context) {
	const session = await getSession(context);
	return {
		props: {
			session,
		},
	};
}
