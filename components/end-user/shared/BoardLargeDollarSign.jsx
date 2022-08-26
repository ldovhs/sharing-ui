import React, { useEffect, useState } from "react";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { useUserRewardQuery } from "@shared/HOC";

export default function BoardLargeDollarSign() {
    const [userRewards, userRewardLoading] = useUserRewardQuery();
    const [rewardAmount, setRewardAmount] = useState(null);
    useEffect(async () => {
        if (userRewards && userRewards.length > 0) {
            let shellReward = userRewards.find(
                (r) =>
                    r.rewardType.reward.match("hell") ||
                    r.rewardType.reward.match("$Shell") ||
                    r.rewardType.reward.match("$SHELL")
            );

            setRewardAmount(shellReward.quantity);
        }
    }, [userRewards]);

    return (
        <div className={s.boardLarge_dollar}>
            <div className={s.boardLarge_dollar_content}>
                {rewardAmount !== null && process.env.NEXT_PUBLIC_CAN_SEE_SHELL == "true" && (
                    <>
                        <img
                            src={`${Enums.BASEPATH}/img/sharing-ui/invite/shell.png`}
                            alt="reward icon"
                        />
                        {rewardAmount}
                    </>
                )}
                {(rewardAmount === null || process.env.NEXT_PUBLIC_CAN_SEE_SHELL == "false") && (
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
