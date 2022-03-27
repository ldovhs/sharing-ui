import React, { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { ethers, utils } from "ethers";
import axios from "axios";
import Enums from "enums";

const util = require("util");

export const Web3Context = React.createContext();

export function Web3Provider({ children }) {
    const [web3Error, setWeb3Error] = useState(null);
    let web3Modal;
    let provider;
    let signMessageTimeout;

    let providerOptions = {
        metamask: {
            id: "injected",
            name: "MetaMask",
            type: "injected",
            check: "isMetaMask",
        },
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: "8422374653a5417ca923479ca904ed65", // Required
                // network: "rinkeby",
                qrcodeModalOptions: {
                    mobileLinks: ["metamask", "trust"],
                },
            },
        },
    };

    useEffect(() => {
        return () => {
            if (signMessageTimeout) {
                clearTimeout(signMessageTimeout);
            }
        };
    });

    const SubscribeProvider = async (provider) => {
        provider.on("error", (e) => console.error("WS Error", e));
        provider.on("end", (e) => console.error("WS End", e));

        provider.on("accountsChanged", async (accounts) => {
            console.log("On account changed, would need to sign out and login again");

            SignOut();
        });

        provider.on("chainChanged", async (chainId) => {
            SignOut();
            console.log(chainId);
        });

        provider.on("connect", (info) => {
            console.log(info);
        });

        provider.on("disconnect", async (error) => {
            console.log("disconnect");
            console.log(error);
            SignOut();
        });
    };

    const TryConnectAsAdmin = async () => {
        web3Modal = new Web3Modal({
            network: "mainnet",
            cacheProvider: true,
            providerOptions,
        });
        try {
            provider = await web3Modal.connect();
            //   await provider.enable();
            SubscribeProvider(provider);

            const providerInstance = new ethers.providers.Web3Provider(provider);

            let addresses;

            if (provider.isMetaMask) {
                console.log("Login using metamask ");
                addresses = await providerInstance.send("eth_requestAccounts", []);
            } else {
                console.log("Login using wallet connect ");
                addresses = provider.accounts;
            }

            if (addresses.length === 0) {
                setWeb3Error("Account is locked, or is not connected, or is in pending request.");
                return;
            }

            const admin = await axios.get("/api/admin/admin", {
                params: {
                    address: addresses[0],
                },
            });

            if (!admin.data) {
                setWeb3Error("Cannot authenticate as admin with current wallet account");
                return;
            }

            const nonce = admin.data.nonce.trim();

            signMessageTimeout = setTimeout(async () => {
                const signer = await providerInstance.getSigner();
                console.log(signer);

                const signature = await signer.signMessage(`${Enums.ADMIN_SIGN_MSG}: ${nonce}`);
                const address = await signer.getAddress();

                signIn("admin-authenticate", {
                    redirect: false,
                    signature,
                    address,
                }).then(({ ok, error }) => {
                    if (ok) {
                        console.log(ok);
                    } else {
                        console.log(error);
                        router.push("/admin");
                        return error;
                    }
                });
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    };

    const TryConnectAsUser = async () => {
        web3Modal = new Web3Modal({
            network: "rinkeby",
            cacheProvider: true,
            providerOptions,
        });
        try {
            provider = await web3Modal.connect();
            SubscribeProvider(provider);

            const providerInstance = new ethers.providers.Web3Provider(provider);

            let addresses;
            if (provider.isMetaMask) {
                console.log("Login using metamask ");
                addresses = await providerInstance.send("eth_requestAccounts", []);
            } else {
                console.log("Login using wallet connect ");
                addresses = provider.accounts;
            }

            if (addresses.length === 0) {
                setWeb3Error("Account is locked, or is not connected, or is in pending request.");
                return;
            }

            const user = await axios.get("/api/user", {
                params: {
                    address: addresses[0],
                },
            });

            console.log(user);
            if (user.data?.isError === true) {
                console.log(123);
                setWeb3Error(user.data?.message);
                return;
            }

            signMessageTimeout = setTimeout(async () => {
                const signer = await providerInstance.getSigner();

                const signature = await signer.signMessage(`${Enums.USER_SIGN_MSG}`);
                const address = await signer.getAddress();

                signIn("non-admin-authenticate", {
                    redirect: false,
                    signature,
                    address,
                }).then(({ ok, error }) => {
                    if (ok) {
                        console.log(ok);
                    } else {
                        console.log(error);
                        return error;
                    }
                });
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    };

    const SignOut = async () => {
        if (web3Modal) {
            await web3Modal.clearCachedProvider();
        }
        const web3ModalCache = localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER");
        if (web3ModalCache) {
            localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER");
        }
        signOut();
    };
    return (
        <Web3Context.Provider
            value={{
                TryConnectAsAdmin,
                TryConnectAsUser,
                SignOut,
                web3Error,
            }}
        >
            {children}
        </Web3Context.Provider>
    );
}
