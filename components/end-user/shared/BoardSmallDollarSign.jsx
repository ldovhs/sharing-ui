import React, { useEffect, useState } from "react";
import s from "/sass/claim/claim.module.css";
import Enums from "enums";
import { useUserRewardQuery } from "@shared/HOC";

export default function BoardSmallDollarSign() {
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
            if (shellReward?.quantity && shellReward.quantity > 0)
                setRewardAmount(shellReward.quantity);
        }
    }, [userRewards]);
    return (
        <div className={s.board_dollar}>
            <div className={s.board_dollar_content}>
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
