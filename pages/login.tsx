import { getProviders, signIn } from 'next-auth/react';

type Provider = {
	callbackUrl: string;
	id: string;
	name: string;
	signinUrl: string;
	type: string;
};
function Login({ providers }) {
	return (
		<div className='flex flex-col bg-black h-screen overflow-hidden items-center justify-center '>
			<img
				className='w-52 mb-4'
				src='https://links.papareact.com/9xl'
				alt='spotify'
			/>
			{Object.values(providers).map(
				(provider: Provider): JSX.Element => (
					<div key={provider.id}>
						<button
							className='bg-[#18D858] text-white p-5 rounded-lg'
							onClick={() =>
								signIn(provider.id, { callbackUrl: '/' })
							}
						>
							Login with {provider.name}
						</button>
					</div>
				)
			)}
		</div>
	);
}

export default Login;

export async function getServerSideProps() {
	const providers = await getProviders();

	return {
		props: {
			providers,
		},
	};
}
