import React from "react";
import Enums from "enums";
import { withRewardTypeQuery } from "shared/HOC/reward";
import {
    DiscordAuthQuest,
    TwitterAuthQuest,
    TwitterFollowQuest,
    AnomuraSeeFoodQuest,
} from "./index";

const EditQuest = ({ quest, closeModal, rewardTypes }) => {
    return (
        <div className="row d-flex ">
            <div className="col-xxl-12">
                <div className="card">
                    <div className="card-body">
                        {quest.type === Enums.DISCORD_AUTH && rewardTypes && (
                            <DiscordAuthQuest
                                quest={quest}
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                            />
                        )}

                        {quest.type === Enums.TWITTER_AUTH && rewardTypes && (
                            <TwitterAuthQuest
                                quest={quest}
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                            />
                        )}

                        {quest.type === Enums.FOLLOW_TWITTER && rewardTypes && (
                            <TwitterFollowQuest
                                quest={quest}
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                            />
                        )}

                        {quest.type === Enums.ANOMURA_SUBMISSION_QUEST && (
                            <AnomuraSeeFoodQuest
                                quest={quest}
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRewardTypeQuery(EditQuest);
