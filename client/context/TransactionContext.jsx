import React, { useEffect, useState } from 'react'
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);


    return transactionContract;
}

export function TransactionProvider({ children }) {
    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" })
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
    const [transactions, setTransactions] = useState([]);

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }

    const getAllTransactions = async () => {
        try {
            if (!ethereum) return alert("Please install metamask");
            const transactionContract = getEthereumContract();
            const availableTransactions = await transactionContract.getAllTransactions();

            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.rceiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleDateString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)

            }))

            console.log(structuredTransactions);

            setTransactions(structuredTransactions);
        } catch (error) {
            console.log(error);
        }
    }

    //#region Arrow Functions for wallet connection and checking.
    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("Please install metamask");
            /*
                The below ethereum.request comes from the Ethereum provider API from metamask
                This method checks to see if their is a eth metamask account or accounts in the window.
            */
            const accounts = await ethereum.request({ method: "eth_accounts" });
            if (accounts.length) {
                setCurrentAccount(accounts[0]);

                getAllTransactions();
            }
            else {
                console.log("No accounts found");
            }
            console.log(accounts);
        } catch (error) {
            console.log(error);
            throw new error("No ethereum object from Metamask");
        }
    }

    const checkIfTransactionsExist = async () => {
        try {
            const transactionContract = getEthereumContract();
            const transactionCount = await transactionContract.getTransactionsCount();

            window.localStorage.setItem("transactionCount", transactionCount);
        } catch (error) {
            console.log(error);
            throw new error("No ethereum object from Metamask");
        }
    }
    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install metamask");
            /*
                The below ethereum.request comes from the Ethereum provider API from metamask
                This method pulls up the metamask plugin and requests the user to login and connect their account
            */
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new error("No ethereum object from Metamask");
        }
    }

    const sendTransaction = async () => {
        try {
            if (!ethereum) return alert("Please install metamask");

            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract();
            // Need to have a way to convert the amount in the form to gwei. We use ethers built in parse function for that.
            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208", //Hexidecimal value only this current value is 21000 Gwei or about 0.000021
                    value: parsedAmount._hex, //0.00001 is the value in gwei

                }]
            });

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionsCount();

            setTransactionCount(transactionCount.toNumber());

            window.reload()

        } catch (error) {
            console.log(error);
            throw new error("No ethereum object from Metamask");
        }
    }
    //#endregion
    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    }, []);
    return (
        //If the key and the value are the same you only need to pas the key. Same as in name wise
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, transactions, isLoading }}>
            {children}
        </TransactionContext.Provider>
    )
}
