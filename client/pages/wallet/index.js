import Head from 'next/head'
import { WalletNavbar, WalletCard } from "/components/wallet";
import "/sass/wallet/wallet.module.css";

export default function Wallet() {
    return (
        <div className="App p-8">
            <Head>
                <title>Anomura Wallet</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <WalletNavbar></WalletNavbar>
            {/* Main Wrapper */}
            <div className='mt-4'>
                <h1 className="text-2xl">Welcome to your personal NFT wallet on Anomura</h1>
                <h1 className="text-6xl">Wallet</h1>
                {/* Card Components */}
                <div>
                    <WalletCard></WalletCard>
                </div>
            </div>

        </div>
    )
}
