import React, { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";

import { ethers, utils } from "ethers";
import axios from "axios";
import Enums from "enums";
import WalletConnectProvider from "@walletconnect/web3-provider";

const util = require("util");
const API_ADMIN = `${Enums.BASEPATH}/api/admin`;
const API_USER = `${Enums.BASEPATH}/api/user`;
const API_SIGNUP = `${Enums.BASEPATH}/api/user/signup`;

export const Web3Context = React.createContext();

export function Web3Provider({ session, children }) {
    const [web3Error, setWeb3Error] = useState(null);

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

    useEffect(async () => {
        if (session && window?.ethereum) {
            if (window?.ethereum) {
                SubscribeProvider(window.ethereum);
            }
        }
    }, [session]);

    const SubscribeProvider = async (provider) => {
        try {
            provider.on("error", (e) => console.error("WS Error", e));
            provider.on("end", (e) => console.error("WS End", e));

            provider.on("accountsChanged", async (accounts) => {
                console.log("On account changed, would need to login again");

                SignOut();
            });

            provider.on("chainChanged", async (chainId) => {
                SignOut();
            });

            provider.on("connect", (info) => {});

            provider.on("disconnect", async (error) => {
                SignOut();
            });
        } catch (error) {}
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

            const admin = await axios.get(API_ADMIN, {
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
                const signature = await signer.signMessage(`${Enums.ADMIN_SIGN_MSG}: ${nonce}`);
                const address = await signer.getAddress();

                await signIn("admin-authenticate", {
                    redirect: true,
                    signature,
                    address,
                });
            }, 1000);
        } catch (error) {}
    };

    const TryConnectAsUser = async (walletType) => {
        if (!walletType) {
            throw new Error("Missing type of wallet when trying to setup wallet provider");
        }
        try {
            let addresses, providerInstance;

            if (walletType === Enums.METAMASK) {
                providerInstance = new ethers.providers.Web3Provider(window.ethereum);
                addresses = await providerInstance.send("eth_requestAccounts", []);
                SubscribeProvider(window.ethereum);
            } else if (walletType === Enums.WALLETCONNECT) {
                let provider = new WalletConnectProvider({
                    infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
                    qrcodeModalOptions: {
                        mobileLinks: ["trust", "metamask", "coinbase", "rainbow"],
                        desktopLinks: ["encrypted ink"],
                    },
                });
                await provider.enable();

                providerInstance = new ethers.providers.Web3Provider(provider);

                addresses = provider?.accounts;
                SubscribeProvider(provider);
            }

            if (addresses.length === 0) {
                setWeb3Error("Account is locked, or is not connected, or is in pending request.");
                return;
            }
            const user = await axios.get(API_USER, {
                params: {
                    address: addresses[0],
                },
            });

            if (!user || !user.data || user.data.isError) {
                setWeb3Error("User not found, please sign up.");
                return;
            }

            signMessageTimeout = setTimeout(async () => {
                const signer = await providerInstance.getSigner();

                const signature = await signer
                    .signMessage(`${Enums.USER_SIGN_MSG}`)
                    .catch((err) => {
                        setWeb3Error(err.message);
                    });

                const address = await signer.getAddress();

                signIn("non-admin-authenticate", {
                    redirect: true,
                    signature,
                    address,
                })
                    .then(({ ok, error }) => {
                        if (ok) {
                            return true;
                        } else {
                            console.log("Authentication failed");
                            return false;
                        }
                    })
                    .catch((err) => {});
            }, 1000);
        } catch (error) {
            setWeb3Error(error.message);
        }
    };

    const TrySignUpWithWallet = async (walletType) => {
        try {
            if (!walletType) {
                throw new Error("Missing type of wallet when trying to setup wallet provider");
            }

            let addresses, providerInstance;

            if (walletType === Enums.METAMASK) {
                providerInstance = new ethers.providers.Web3Provider(window.ethereum);
                addresses = await providerInstance.send("eth_requestAccounts", []);
                // SubscribeProvider(window.ethereum);
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
                // SubscribeProvider(provider);
            }

            if (addresses.length === 0) {
                setWeb3Error("Account is locked, or is not connected, or is in pending request.");
                return;
            }

            let signUpRes = await signUp(providerInstance, addresses[0]).catch((err) => {
                setWeb3Error(err.message);
                return false;
            });

            if (signUpRes === "User sign up successful") {
                return true;
            } else {
                setWeb3Error(signUpRes);
            }

            return false;
        } catch (error) {
            setWeb3Error(error.message);
        }
    };

    const SignOut = async () => {
        RemoveLocalStorageWalletConnect();
        signOut();
    };

    const signUp = (providerInstance, address) => {
        var promise = new Promise(function (resolve, reject) {
            let timeout = setTimeout(async () => {
                const signer = await providerInstance.getSigner();
                const signature = await signer
                    .signMessage(`${Enums.USER_SIGN_MSG}`)
                    .catch((err) => {
                        reject(err.message);
                    });

                const newUser = await axios.post(
                    API_SIGNUP,

                    {
                        address,
                        signature,
                    }
                );

                if (newUser?.data?.isError) {
                    setWeb3Error(newUser?.data?.message);
                    resolve(newUser?.data?.message);
                    clearTimeout(timeout);
                } else {
                    resolve("User sign up successful");
                    clearTimeout(timeout);
                }
            }, 1000);
        });
        return promise;
    };

    const doWalletAuth = async (walletType) => {
        try {
            if (!walletType) {
                throw new Error("Missing type of wallet when trying to setup wallet provider");
            }

            let addresses, providerInstance;

            if (walletType === Enums.METAMASK) {
                providerInstance = new ethers.providers.Web3Provider(window.ethereum);
                addresses = await providerInstance.send("eth_requestAccounts", []);
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
            }

            if (addresses.length === 0) {
                setWeb3Error("Account is locked, or is not connected, or is in pending request.");
                return;
            }
            let doQuest = await walletAuth(providerInstance, addresses[0]).catch((err) => {
                console.log(err);
                setWeb3Error(err);
                return false;
            });

            if (doQuest == "Wallet Auth successful") {
                return true;
            } else {
                setWeb3Error(doQuest);
            }

            return false;
        } catch (error) {
            setWeb3Error(error.message);
        }
    };

    const walletAuth = (providerInstance, address) => {
        try {
            var promise = new Promise(function (resolve, reject) {
                let timeout = setTimeout(async () => {
                    const signer = await providerInstance.getSigner();
                    const signature = await signer
                        .signMessage(`${Enums.USER_SIGN_MSG}`)
                        .catch((err) => {
                            reject(err.message);
                        });

                    const doQuest = await axios
                        .post(`${Enums.BASEPATH}/api/user/quest/submit/wallet-auth`, {
                            address,
                            signature,
                        })
                        .catch((err) => {
                            console.log(err.message);
                            reject(err.message);
                        });

                    if (doQuest?.data?.isError) {
                        setWeb3Error(doQuest?.data?.message);
                        resolve(doQuest?.data?.message);
                        clearTimeout(timeout);
                    } else {
                        resolve("Wallet Auth successful");
                        clearTimeout(timeout);
                    }
                }, 1000);
            });
            return promise;
        } catch (error) {
            setWeb3Error(error.message);
            reject(error.message);
        }
    };

    return (
        <Web3Context.Provider
            value={{
                TryConnectAsAdmin,
                TryConnectAsUser,
                SignOut,
                TrySignUpWithWallet,

                web3Error,
                setWeb3Error,
                session,
                doWalletAuth,
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
