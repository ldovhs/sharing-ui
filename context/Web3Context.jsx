import React, { useState, useEffect } from "react";
import { signIn, signOut } from "next-auth/react";

import { ethers, utils } from "ethers";
import axios from "axios";
import Enums from "enums";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useSession } from "next-auth/react";

const util = require("util");
const API_ADMIN = `${Enums.BASEPATH}/api/admin`; //  `${Enums.BASEPATH}/api/admin`   --  `/api/admin`
const API_USER = `${Enums.BASEPATH}/api/user`; // `${Enums.BASEPATH}/api/user`  --- `/api/user`
const API_SIGNUP = `${Enums.BASEPATH}/api/user/signup`; // `${Enums.BASEPATH}/api/user/signup` -- `$/api/user/signup`

export const Web3Context = React.createContext();

export function Web3Provider({ children }) {
    const [web3Error, setWeb3Error] = useState(null);
    const { data: session, status } = useSession({ required: false });
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
        if (session) {
            let providerInstance;
            if (window?.ethereum) {
                SubscribeProvider(window.ethereum);
            } else {
                // let provider = new WalletConnectProvider({
                //     infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
                //     qrcodeModalOptions: {
                //         mobileLinks: ["trust"],
                //         desktopLinks: ["encrypted ink"],
                //     },
                // });
                // await provider.enable();
                // SubscribeProvider(providerInstance);
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

                signIn("admin-authenticate", {
                    redirect: false,
                    signature,
                    address,
                }).then(({ ok, error }) => {
                    if (ok) {
                        return true;
                    } else {
                        setWeb3Error("Authentication failed");
                        return false;
                    }
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
                        mobileLinks: ["trust", "metamask", "coinbase"],
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
                    redirect: false,
                    signature,
                    address,
                })
                    .then(({ ok, error }) => {
                        if (ok) {
                            return true;
                        } else {
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

            if (addresses.length === 0) {
                setWeb3Error("Account is locked, or is not connected, or is in pending request.");
                return;
            }

            let signUpRes = await signUp(providerInstance, addresses[0]).catch((err) => {
                setWeb3Error(err);
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

    const TryValidate = async (walletType) => {
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
                        mobileLinks: ["trust"],
                        desktopLinks: ["encrypted ink"],
                    },
                });
                await provider.enable();

                providerInstance = new ethers.providers.Web3Provider(provider);
                addresses = provider.accounts;
                SubscribeProvider(provider);
            }

            if (addresses.length === 0) {
                setWeb3Error("Account is locked, or is not connected, or is in pending request.");
                return;
            }

            return new Promise((resolve, reject) => {
                setTimeout(async () => {
                    const signer = await providerInstance.getSigner();

                    await signer.signMessage(`${Enums.USER_CLAIM_NFT_MSG}`).catch((err) => {
                        setWeb3Error(err.message);
                        reject(err.message);
                    });

                    const address = await signer.getAddress();
                    resolve(address);
                }, 1000);
            });
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
            setTimeout(async () => {
                const signer = await providerInstance.getSigner();
                const signature = await signer
                    .signMessage(`${Enums.USER_SIGN_MSG}`)
                    .catch((err) => {
                        reject(err.message);
                    });

                const newUser = await axios.post(API_SIGNUP, {
                    address,
                    signature,
                    secret: process.env.NEXT_PUBLIC_API_SECRET,
                });

                // await signIn("non-admin-authenticate", {
                //     redirect: false,
                //     signature,
                //     address,
                // });
                if (newUser?.data?.isError) {
                    setWeb3Error(newUser?.data?.message);
                    resolve(newUser?.data?.message);
                } else {
                    resolve("User sign up successful");
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
                TryValidate,
                web3Error,
                setWeb3Error,
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
