import Enums from "enums";
import React, { useEffect, useState, useContext } from "react";
import {
    DiscordAuthQuest,
    TwitterAuthQuest,
    TwitterFollowQuest,
    AnomuraSeeFoodQuest,
    InstagramFollowQuest,
    TwitterRetweetQuest,
    ZedOwnQuest,
    NoodsOwnQuest,
    FreeLimitedShell,
} from "./index";

import { withRewardTypeQuery } from "shared/HOC/reward";
import { withQuestTypeQuery } from "@shared/HOC/quest";

const AddQuest = ({ closeModal, rewardTypes, questTypes }) => {
    const [selectedType, setSelectedType] = useState();

    useEffect(async () => {}, []);

    const handleOnSelectChange = (e) => {
        setSelectedType(e.target.value);
    };

    return (
        <div className="row d-flex ">
            <div className="col-xxl-12">
                <div className="card">
                    <div className="card-body">
                        <div className="col-6 mb-3">
                            <label className="form-label">Quest Type</label>
                            <select onChange={handleOnSelectChange}>
                                <option value="Select">Select Type Of Quest</option>
                                {questTypes &&
                                    questTypes.map((item) => (
                                        <option key={item.id} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {selectedType === Enums.DISCORD_AUTH && (
                            <DiscordAuthQuest
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}

                        {selectedType === Enums.TWITTER_AUTH && (
                            <TwitterAuthQuest
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}
                        {selectedType === Enums.TWITTER_RETWEET && (
                            <TwitterRetweetQuest
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}

                        {selectedType === Enums.FOLLOW_TWITTER && (
                            <TwitterFollowQuest
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}

                        {selectedType === Enums.FOLLOW_INSTAGRAM && (
                            <InstagramFollowQuest
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}

                        {selectedType === Enums.ZED_CLAIM && (
                            <ZedOwnQuest
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}

                        {selectedType === Enums.NOODS_CLAIM && (
                            <NoodsOwnQuest
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}

                        {selectedType === Enums.ANOMURA_SUBMISSION_QUEST && (
                            <AnomuraSeeFoodQuest
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}

                        {selectedType === Enums.LIMITED_FREE_SHELL && (
                            <FreeLimitedShell
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
const firstHOC = withQuestTypeQuery(AddQuest);
export default withRewardTypeQuery(firstHOC);
