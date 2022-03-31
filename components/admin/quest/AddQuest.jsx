import Enums from "enums";
import React, { useEffect, useState, useContext } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { object, array, string, number } from "yup";
import axios from "axios";
import DiscordAuthQuest from "./DiscordAuthQuest";
import TwitterAuthQuest from "./TwitterAuthQuest";
import TwitterFollowQuest from "./TwitterFollowQuest";

const AddQuest = ({ closeModal }) => {
    const [questTypes, setQuestTypes] = useState([
        {
            id: 1,
            type: Enums.DISCORD_AUTH,
        },
        {
            id: 2,
            type: Enums.TWITTER_AUTH,
        },
        {
            id: 3,
            type: Enums.FOLLOW_TWITTER,
        },
    ]);

    const [typeOfQuest, setTypeOfQuest] = useState();

    const [rewardTypes, setRewardTypes] = useState([]);
    useEffect(async () => {
        const res = await axios.get("/api/admin/rewardType");
        if (res) {
            setRewardTypes(res.data);
        }
    }, []);

    const handleOnSelectChange = (e) => {
        setTypeOfQuest(e.target.value);
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
                                {questTypes.map((item) => (
                                    <option key={item.id} value={item.type}>
                                        {item.type}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {typeOfQuest === Enums.DISCORD_AUTH && (
                            <DiscordAuthQuest
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}

                        {typeOfQuest === Enums.TWITTER_AUTH && (
                            <TwitterAuthQuest
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                                isCreate={true}
                            />
                        )}

                        {typeOfQuest === Enums.FOLLOW_TWITTER && (
                            <TwitterFollowQuest
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

export default AddQuest;
