import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    DiscordAuthQuest,
    TwitterAuthQuest,
    TwitterFollowQuest,
    AnomuraSeeFoodQuest,
} from "./index";
import Enums from "enums";

const EditQuest = ({ quest, closeModal }) => {
    const [rewardTypes, setRewardTypes] = useState([]);
    useEffect(async () => {
        const res = await axios.get("/api/admin/rewardType");
        if (res) {
            setRewardTypes(res.data);
        }
    }, []);

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

export default EditQuest;
