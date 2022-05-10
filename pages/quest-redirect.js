import React from "react";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { useRouter } from "next/router";

function QuestComplete() {
    let router = useRouter();

    return (
        <>
            <div className={s.app}>
                <div className={s.board}>
                    <div className={s.board_container}>
                        <div className={s.board_dollar}>
                            <div className={s.board_dollar_content}>$$$</div>
                        </div>
                        <div className={s.board_wrapper}>
                            <div className={s.board_content}>
                                <>
                                    {!router?.query?.error && (
                                        <div className={s.board_text}>
                                            Quest Completed. Please close this page!
                                        </div>
                                    )}
                                    {router?.query?.error && (
                                        <>
                                            <div className={s.board_text}>
                                                {router?.query?.error}
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
                            </div>
                        </div>
                    </div>
                </div>
                <div className={s.foreground}></div>
            </div>
        </>
    );
}

export default QuestComplete;
