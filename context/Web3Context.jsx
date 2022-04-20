import React, { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";

import { ethers, utils } from "ethers";
import axios from "axios";
import Enums from "enums";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useRouter } from "next/router";

const util = require("util");

export const Web3Context = React.createContext();

export function Web3Provider({ children }) {
    const [web3Error, setWeb3Error] = useState(null);
    const router = useRouter();
    let signMessageTimeout;

    function iOS() {
        return (
            [
                "iPad Simulator",
                "iPhone Simulator",
                "iPod Simulator",
                "iPad",
                "iPhone",
                "iPod",
            ].includes(navigator.platform) ||
            // iPad on iOS 13 detection
            (navigator.userAgent.includes("Mac") && "ontouchend" in document)
        );
    }

    useEffect(() => {
        RemoveLocalStorageWalletConnect();
        document.addEventListener("visibilitychange", function () {
            // if (window.visibilityState === "hidden") {
            localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
            //  }
        });

        return () => {
            if (signMessageTimeout) {
                clearTimeout(signMessageTimeout);
            }
        };
    }, []);

    const SubscribeProvider = async (provider) => {
        provider.on("error", (e) => console.error("WS Error", e));
        provider.on("end", (e) => console.error("WS End", e));

        provider.on("accountsChanged", async (accounts) => {
            console.log("On account changed, would need to login again");

            SignOut();
        });

        provider.on("chainChanged", async (chainId) => {
            SignOut();
            console.log(chainId);
        });

        provider.on("connect", (info) => {});

        provider.on("disconnect", async (error) => {
            console.log("disconnect");
            console.log(error);
            SignOut();
        });
    };

    const TryConnectAsAdmin = async (walletType) => {
        if (!walletType) {
            throw new Error("Missing type of wallet when trying to setup wallet provider");
        }

        let addresses, providerInstance;
        if (walletType === Enums.METAMASK) {
            providerInstance = new ethers.providers.Web3Provider(window.ethereum);
            addresses = await providerInstance.send("eth_requestAccounts", []);
            SubscribeProvider(window.ethereum);
        } else if (walletType === Enums.WALLETCONNECT) {
            let provider = new WalletConnectProvider({
                infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
                qrcodeModalOptions: {
                    mobileLinks: ["trust"],
                    desktopLinks: ["encrypted ink"],
                },
            });
            await provider.enable();

            providerInstance = new ethers.providers.Web3Provider(provider);
            addresses = provider.accounts;

            SubscribeProvider(provider);
        }

        try {
            if (addresses.length === 0) {
                setWeb3Error("Account is locked, or is not connected, or is in pending request.");
                return;
            }

            const admin = await axios.get("/api/admin", {
                params: {
                    address: addresses[0],
                },
            });

            if (!admin.data) {
                console.log(admin);
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
                        return true;
                    } else {
                        console.log(error);
                        setWeb3Error("Authentication failed");
                        return false;
                        //router.push("/admin");
                        //return error;
                    }
                });
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    };

    const TryConnectAsUser = async (walletType) => {
        if (!walletType) {
            throw new Error("Missing type of wallet when trying to setup wallet provider");
        }

        let addresses, providerInstance;

        if (walletType === Enums.METAMASK) {
            providerInstance = new ethers.providers.Web3Provider(window.ethereum);
            addresses = await providerInstance.send("eth_requestAccounts", []);
            SubscribeProvider(window.ethereum);
        } else if (walletType === Enums.WALLETCONNECT) {
            let provider = new WalletConnectProvider({
                infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
                qrcodeModalOptions: {
                    mobileLinks: ["trust"],
                    desktopLinks: ["encrypted ink"],
                },
            });
            await provider.enable();

            providerInstance = new ethers.providers.Web3Provider(provider);
            addresses = provider.accounts;
            SubscribeProvider(provider);
        }
        try {
            if (addresses.length === 0) {
                setWeb3Error("Account is locked, or is not connected, or is in pending request.");
                return;
            }
            const user = await axios.get("/api/user/signin", {
                params: {
                    address: addresses[0],
                },
            });
            console.log(123);
            console.log(user);
            if (user.data.length === 0) {
                setWeb3Error("Cannot find any user in our db, please sign up");
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
                        return true;
                    } else {
                        console.log(error);
                        return false;
                    }
                });
            }, 1000);
        } catch (error) {
            console.log(error);
        }
    };

    const TrySignUpWithWallet = async (walletType) => {
        if (!walletType) {
            throw new Error("Missing type of wallet when trying to setup wallet provider");
        }

        let addresses, providerInstance;

        if (walletType === Enums.METAMASK) {
            providerInstance = new ethers.providers.Web3Provider(window.ethereum);
            addresses = await providerInstance.send("eth_requestAccounts", []);
            SubscribeProvider(window.ethereum);
        } else if (walletType === Enums.WALLETCONNECT) {
            let provider = new WalletConnectProvider({
                infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
                qrcodeModalOptions: {
                    mobileLinks: ["trust"],
                    desktopLinks: ["encrypted ink"],
                },
            });
            await provider.enable();

            providerInstance = new ethers.providers.Web3Provider(provider);
            addresses = provider.accounts;
            SubscribeProvider(provider);
        }
        try {
            if (addresses.length === 0) {
                setWeb3Error("Account is locked, or is not connected, or is in pending request.");
                return;
            }

            let signUpRes = await signUp(providerInstance, addresses[0]);
            if (signUpRes === "User sign up successful") {
                return true;
            }
            return false;
        } catch (error) {
            console.log(error);
        }
    };

    const SignOut = async () => {
        RemoveLocalStorageWalletConnect();
        signOut();
    };

    const signUp = (providerInstance, address) => {
        var promise = new Promise(function (resolve, reject) {
            setTimeout(async () => {
                const signer = await providerInstance.getSigner();
                const signature = await signer.signMessage(`${Enums.USER_SIGN_MSG}`);

                const newUser = await axios.post("/api/user/signup", {
                    address,
                    signature,
                });

                await signIn("non-admin-authenticate", {
                    redirect: false,
                    signature,
                    address,
                });

                if (newUser?.data?.wallet) {
                    resolve("User sign up successful");
                }

                if (newUser?.data?.isError) {
                    setWeb3Error(newUser?.data?.message);
                    resolve("error");
                }
            }, 1000);
        });
        return promise;
    };

    return (
        <Web3Context.Provider
            value={{
                TryConnectAsAdmin,
                TryConnectAsUser,
                SignOut,
                TrySignUpWithWallet,
                web3Error,
            }}
        >
            {children}
        </Web3Context.Provider>
    );
}

const RemoveLocalStorageWalletConnect = () => {
    const walletConnectCache = localStorage.getItem("walletconnect");
    if (walletConnectCache) {
        localStorage.removeItem("walletconnect");
    }
    const walletMobileCache = localStorage.getItem("WALLETCONNECT_DEEPLINK_CHOICE");
    if (walletMobileCache) {
        localStorage.removeItem("WALLETCONNECT_DEEPLINK_CHOICE");
    }
};
