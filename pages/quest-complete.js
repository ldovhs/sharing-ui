import React from "react";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";

function QuestComplete() {
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
                                    <div className={s.board_text}>
                                        Quest Completed. Please close this page!
                                    </div>
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
