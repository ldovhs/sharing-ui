import Image from "next/image";
import Crab from "/img/wallet/crab.gif";
export default function WalletCards() {
    return (
        <div className="flex flex-col justify-center items-center
          w-[15vw] mt-2 h-[45vh] text-center card">
            {/* Nft Wrapper */}
            <div className="border-8 w-[50%] aspect-square rounded-md">
                <Image src={Crab} width={50} height={50} layout="responsive" />
            </div>
            {/*<img src="" alt="question" />*/}
            {/* Card Text */}
            <div>
                <p className="text-3xl">Anomura</p>
                <p className="text-3xl">Battle Pass</p>
                <p className="text-3xl text-[#c7ff6c]">Solarian Edition</p>
            </div>
            <p>You own: 1</p>
            <button className="w-[25%] bg-[#99c539] shadow-[rgb(79 169 52) -6px -6px inset]">Traits</button>
        </div>

        /*
        box-shadow: rgb(79 169 52) -6px -6px inset; 
        
        .nes-btn.is-success:hover::after {
        /* box-shadow: inset -6px -6px #4aa52e; 
        
        .nes-btn.is-success::after {
        /* box-shadow: rgb(79 169 52) -4px -4px inset; 
        
        .nes-btn:hover::after 
         box-shadow: rgb(88 95 98) -6px -6px inset; */

    )
}
