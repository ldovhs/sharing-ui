import React from "react";
import Enums from "enums";
import { withRewardTypeQuery } from "shared/HOC/reward";
import {
    DiscordAuthQuest,
    TwitterAuthQuest,
    TwitterFollowQuest,
    TwitterRetweetQuest,
    InstagramFollowQuest,
    ZedOwnQuest,
    NoodsOwnQuest,
    FreeLimitedShell,
    CollaborationFreeShell,
    DailyShellQuestForm,
    ImageUploadQuest,
    CodeQuestForm,
    WalletAuthQuestForm,
} from "./index";
import JoinDiscordQuest from "./Forms/JoinDiscordQuest";

const EditQuest = ({ quest, closeModal, rewardTypes }) => {
    return (
        <div className="row d-flex ">
            <div className="col-xxl-12">
                <div className="card">
                    <div className="card-body">
                        {quest.type.name === Enums.WALLET_AUTH && rewardTypes && (
                            <WalletAuthQuestForm
                                quest={quest}
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                            />
                        )}
                        {quest.type.name === Enums.DISCORD_AUTH && rewardTypes && (
                            <DiscordAuthQuest
                                quest={quest}
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                            />
                        )}

                        {quest.type.name === Enums.TWITTER_AUTH && rewardTypes && (
                            <TwitterAuthQuest
                                quest={quest}
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                            />
                        )}

                        {quest.type.name === Enums.TWITTER_RETWEET && rewardTypes && (
                            <TwitterRetweetQuest
                                quest={quest}
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                            />
                        )}

                        {quest.type.name === Enums.FOLLOW_TWITTER && rewardTypes && (
                            <TwitterFollowQuest
                                quest={quest}
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                            />
                        )}

                        {quest.type.name === Enums.FOLLOW_INSTAGRAM && rewardTypes && (
                            <InstagramFollowQuest
                                quest={quest}
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                            />
                        )}

                        {quest.type.name === Enums.ZED_CLAIM && rewardTypes && (
                            <ZedOwnQuest
                                quest={quest}
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                            />
                        )}

                        {quest.type.name === Enums.NOODS_CLAIM && rewardTypes && (
                            <NoodsOwnQuest
                                quest={quest}
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                            />
                        )}

                        {quest.type.name === Enums.IMAGE_UPLOAD_QUEST && (
                            <ImageUploadQuest
                                quest={quest}
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                            />
                        )}

                        {quest.type.name === Enums.LIMITED_FREE_SHELL && (
                            <FreeLimitedShell
                                quest={quest}
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                            />
                        )}

                        {quest.type.name === Enums.JOIN_DISCORD && (
                            <JoinDiscordQuest
                                quest={quest}
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                            />
                        )}

                        {quest.type.name === Enums.COLLABORATION_FREE_SHELL && (
                            <CollaborationFreeShell
                                quest={quest}
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                            />
                        )}

                        {quest.type.name === Enums.DAILY_SHELL && (
                            <DailyShellQuestForm
                                quest={quest}
                                rewardTypes={rewardTypes}
                                closeModal={closeModal}
                            />
                        )}

                        {quest.type.name === Enums.CODE_QUEST && (
                            <CodeQuestForm
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
