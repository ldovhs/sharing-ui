import Enums from "enums";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import DiscordAuthQuest from "./DiscordAuthQuest";
import TwitterAuthQuest from "./TwitterAuthQuest";
import TwitterFollowQuest from "./TwitterFollowQuest";

const EditQuest = ({ quest, closeModal }) => {
    const [rewardTypes, setRewardTypes] = useState([]);
    useEffect(async () => {
        const res = await axios.get("/api/admin/rewardType");
        if (res) {
            setRewardTypes(res.data);
        }
    }, []);

    const SaveQuest = (fields) => {
        alert("SUCCESS!! :-)\n\n" + JSON.stringify(fields, null, 4));
        //closeModal();
    };

    return (
        <div className="row d-flex ">
            <div className="col-xxl-12">
                <div className="card">
                    <div className="card-body">
                        {quest.type === Enums.DISCORD_AUTH && rewardTypes && (
                            <DiscordAuthQuest
                                quest={quest}
                                rewardTypes={rewardTypes}
                                SaveQuest={SaveQuest}
                                closeModal={closeModal}
                            />
                        )}

                        {quest.type === Enums.TWITTER_AUTH && rewardTypes && (
                            <TwitterAuthQuest
                                quest={quest}
                                rewardTypes={rewardTypes}
                                SaveQuest={SaveQuest}
                                closeModal={closeModal}
                            />
                        )}

                        {quest.type === Enums.FOLLOW_TWITTER && rewardTypes && (
                            <TwitterFollowQuest
                                quest={quest}
                                rewardTypes={rewardTypes}
                                SaveQuest={SaveQuest}
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
