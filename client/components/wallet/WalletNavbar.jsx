import "/sass/wallet/wallet.module.css";
export default function WalletNavbar() {
    return (
        <nav className="flex justify-between">
            <div className="grow" >
                <h1 className="text-5xl text-[#202060]">Anomura Shop</h1>
            </div>
            <div className="flex justify-around grow">
                <button className="bg-[#bc3a20] w-[15%]" type="button">Buy</button>
                <button className="bg-[#ebc80f] w-[15%]" type="button">Sell</button>
            </div>
            <div className="flex justify-around grow">
                <button className=" w-[30%] border-[#4949ce] border-2 rounded-md">
                    <h2 className="text-3xl text-[#202060]">Solana</h2>
                </button>
                <button className=" w-[30%] border-[#4949ce] border-2 rounded-md">
                    <h2 className="text-3xl text-[#202060]">Wallet</h2>
                    {/*<img src="" alt="wallet" />*/}
                </button>
                <div>
                    <img src="" alt="sun" />
                    <img src="" alt="moon" />
                </div>
            </div>
        </nav>
    )
}
