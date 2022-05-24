import React from "react";
import s from "/sass/claim/claim.module.css";

import Enums from "enums";

export default function BoardLargeDollarSign({ rewardAmount }) {
    return (
        <div className={s.boardLarge_dollar}>
            <div className={s.boardLarge_dollar_content}>
                {rewardAmount !== null && rewardAmount !== 0 ? (
                    <>
                        <img
                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`}
                            alt="reward icon"
                        />
                        {rewardAmount}
                    </>
                ) : (
                    <>
                        <img
                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`}
                            alt="reward icon"
                        />
                        <img
                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`}
                            alt="reward icon"
                        />
                        <img
                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`}
                            alt="reward icon"
                        />
                    </>
                )}
            </div>
        </div>
    );
}
