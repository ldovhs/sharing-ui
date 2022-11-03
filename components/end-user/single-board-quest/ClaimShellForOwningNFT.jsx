import React, { useEffect, useState, useContext } from "react";
import { Web3Context } from "@context/Web3Context";
import s from "/sass/claim/claim.module.css";
import axios from "axios";
import { withUserQuestQuery, withUserQuestSubmit } from "shared/HOC/quest";
import Enums from "enums";
import { useRouter } from "next/router";
import { useDeviceDetect } from "lib/hooks";

const CLAIMABLE = 0;
const CLAIMED = 1;
const UNCLAIMABLE = 2;

const ClaimShellForOwningNFT = ({
    session,
    onSubmit,
    isSubmitting,
    NFT,
    isFetchingUserQuests,
    userQuests,
    chain,
    NftSymbol,
}) => {
    const [nftQuest, setNftQuest] = useState(null);
    const [error, setError] = useState(null);
    const { SignOut, TryValidate } = useContext(Web3Context);
    const [isMetamaskDisabled, setIsMetamaskDisabled] = useState(false);
    const { isMobile } = useDeviceDetect();

    const [isValidating, setIsValidating] = useState(false);
    const [currentView, setView] = useState(CLAIMABLE);
    let router = useRouter();

    useEffect(() => {
        const ethereum = window.ethereum;
        setIsMetamaskDisabled(!ethereum || !ethereum.on);
    }, []);

    useEffect(async () => {
        if (userQuests) {
            let findNftQuest = userQuests.find((q) => q.type.name === NFT);

            if (findNftQuest) {
                setNftQuest(findNftQuest);
                if (findNftQuest.isDone) {
                    setView(CLAIMED);
                }
            }
        }
    }, [userQuests]);

    const onClaim = async () => {
        setIsValidating(true);
        try {
            if (nftQuest.isDone) {
                setIsValidating(false);
                return;
            }
            let ownerAddress;
            if (!isMetamaskDisabled && !isMobile) {
                ownerAddress = await TryValidate(Enums.METAMASK);
            } else {
                ownerAddress = await TryValidate(Enums.WALLETCONNECT);
            }

            let haveNft = false;

            let allNFTsOwned = await axios.get(
                `https://deep-index.moralis.io/api/v2/${ownerAddress}/nft?chain=${chain}&format=decimal`,
                {
                    headers: {
                        "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_APIKEY,
                    },
                }
            );

            if (allNFTsOwned?.data?.result?.length > 0) {
                let nftsToProcess = allNFTsOwned?.data?.result;
                let promiseCheck = nftsToProcess.map((nft) => {
                    if (nft.symbol === NftSymbol) {
                        haveNft = true;
                    }
                });
                Promise.all(promiseCheck);
                if (!haveNft) {
                    setIsValidating(false);
                    setView(UNCLAIMABLE);
                    return;
                }
            } else {
                setIsValidating(false);
                setView(UNCLAIMABLE);
                return;
            }

            const { questId, type, quantity, rewardTypeId, extendedQuestData } = nftQuest;
            let submission = {
                questId,
                type,
                rewardTypeId,
                quantity,
                extendedQuestData,
            };
            await onSubmit(submission, userQuests);
            setView(CLAIMED);
            setIsValidating(false);
        } catch (e) {
            setIsValidating(false);

            return;
        }
    };

    const getNFT = () => {
        let pathname = router.pathname;
        const nft = pathname.split("/");
        return nft[1].toString().trim().toUpperCase();
    };

    return (
        <div className={s.board}>
            <div className={s.board_container}>
                <div className={s.board_dollar}>
                    <div className={s.board_dollar_content}>$$$</div>
                </div>
                <div className={s.board_wrapper}>
                    <div className={s.board_content}>
                        {(isSubmitting || isFetchingUserQuests || isValidating) && (
                            <div className={s.board_loading}>
                                <div className={s.board_loading_wrapper}>
                                    <img
                                        src={`${Enums.BASEPATH}/img/sharing-ui/Loading_Blob fish.gif`}
                                        alt="Loading data"
                                    />
                                    <div className={s.board_loading_wrapper_text}>
                                        Loading
                                        <span className={s.board_loading_wrapper_text_ellipsis} />
                                    </div>
                                </div>
                            </div>
                        )}
                        {nftQuest && !error && (
                            <>
                                {currentView === CLAIMABLE &&
                                    !isSubmitting &&
                                    !isFetchingUserQuests &&
                                    !isValidating && (
                                        <>
                                            <div className={s.board_title}>
                                                {/* Claim $SHELL for owning {getNFT()} */}
                                                {nftQuest.text}
                                            </div>

                                            <button
                                                className={s.board_pinkBtn}
                                                onClick={onClaim}
                                                disabled={
                                                    nftQuest?.isDone ||
                                                    isSubmitting ||
                                                    isFetchingUserQuests
                                                }
                                            >
                                                <img
                                                    src={
                                                        !nftQuest?.isDone
                                                            ? `${Enums.BASEPATH}/img/sharing-ui/invite/Button_Small.png`
                                                            : `${Enums.BASEPATH}/img/sharing-ui/invite/Button_Small 2.png`
                                                    }
                                                    alt="connectToContinue"
                                                />
                                                <div>
                                                    {/* {!nftQuest?.isDone ? "Claim" : "Claimed"} */}
                                                    <span>{nftQuest.quantity}</span>
                                                    {nftQuest.rewardType.reward.match("hell") && (
                                                        <img
                                                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`}
                                                            alt="reward icon"
                                                        />
                                                    )}

                                                    {nftQuest.rewardType.reward.match(
                                                        /bowl|Bowl/
                                                    ) && (
                                                        <img
                                                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/bowl10frames.gif`}
                                                            alt="reward icon"
                                                        />
                                                    )}
                                                </div>
                                            </button>
                                        </>
                                    )}
                                {currentView === CLAIMED && (
                                    <>
                                        <div className={s.board_title}>Claimed successfully</div>
                                        <button
                                            className={s.board_pinkBtn}
                                            onClick={() => {
                                                router.push("/");
                                            }}
                                        >
                                            <img
                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large.png`}
                                                alt="connectToContinue"
                                            />
                                            <div>
                                                <span>Back</span>
                                            </div>
                                        </button>
                                    </>
                                )}
                                {currentView === UNCLAIMABLE && (
                                    <>
                                        <div className={s.board_title}>
                                            Unclaimable. You don't own any {NftSymbol}
                                        </div>
                                        <button
                                            className={s.board_pinkBtn}
                                            onClick={() => {
                                                router.push("/");
                                            }}
                                        >
                                            <img
                                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Large.png`}
                                                alt="connectToContinue"
                                            />
                                            <div>
                                                <span>Go Back</span>
                                            </div>
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            {/*  Disconnect */}
            {!isFetchingUserQuests && (
                <button className={s.board_disconnect} onClick={() => SignOut()}>
                    <img
                        src={`${Enums.BASEPATH}/img/sharing-ui/invite/Button_Disconnect.png`}
                        alt="connectToContinue"
                    />
                    <div>
                        <span>Disconnect</span>
                    </div>
                </button>
            )}
        </div>
    );
};

const firstHOC = withUserQuestSubmit(ClaimShellForOwningNFT);
export default withUserQuestQuery(firstHOC);
