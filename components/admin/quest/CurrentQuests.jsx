import React, { useEffect, useState } from "react";
import Enums from "enums";
import { Modal } from "/components/admin";
import { useRouter } from "next/router";
import Link from "next/link";
import { EditQuest, AddQuest } from "..";
import { withAdminQuestQuery } from "shared/HOC/quest";

const CurrentQuests = ({ quests, isLoading, error }) => {
    let router = useRouter();
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentQuests, setCurrentQuests] = useState(null);

    useEffect(() => {
        if (quests) {
            setCurrentQuests(quests.sort(shortByText));
        }
    }, [quests]);

    return (
        <>
            <div className="card">
                {currentQuests && currentQuests.length > 0 && (
                    <div className="card-body">
                        {isLoading && <div> Get quests info...</div>}
                        {currentQuests.map((quest, index, row) => {
                            return (
                                <React.Fragment key={index}>
                                    <div className="verify-content">
                                        <div className="d-flex align-items-center">
                                            <span className="me-3 icon-circle bg-primary text-white">
                                                <i className="ri-bank-line"></i>
                                            </span>
                                            <div className="primary-number">
                                                <h5 className="mb-0">
                                                    {quest.text}
                                                    {quest.type.name === Enums.FOLLOW_TWITTER && (
                                                        <span className="text-teal-500 ml-1">
                                                            {quest.extendedQuestData.followAccount}
                                                        </span>
                                                    )}

                                                    {quest.type.name === Enums.FOLLOW_INSTAGRAM && (
                                                        <span className="text-red-500 ml-1">
                                                            {quest.extendedQuestData.followAccount}
                                                        </span>
                                                    )}

                                                    {quest.type.name === Enums.TWITTER_RETWEET && (
                                                        <span className="text-teal-500 ml-1">
                                                            {quest.extendedQuestData.tweetId}
                                                        </span>
                                                    )}
                                                </h5>

                                                <small>{quest.description}</small>
                                                <br />
                                                <span className="text-success">
                                                    {quest.isRequired ? "Required" : "Optional"}
                                                </span>
                                            </div>
                                        </div>

                                        <Link href={`${router.pathname}/?id=${quest.id}`}>
                                            <button className=" btn btn-dark">Manage </button>
                                        </Link>
                                    </div>
                                    {/* last row */}
                                    {index + 1 !== row.length && (
                                        <hr className="dropdown-divider my-4" />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}
            </div>
            <button
                type="button"
                className="btn btn-primary m-2"
                onClick={() => setModalOpen(true)}
            >
                Add New Quest
            </button>

            {/* {router.query.typeId && ( */}
            <Modal
                isOpen={router.query?.id ? true : isModalOpen}
                onClose={() => {
                    router.push(`${router.pathname}`);
                    setModalOpen(false);
                }}
                render={(modal) => {
                    if (router.query?.id && quests) {
                        let quest = quests.filter((q) => q.id === parseInt(router.query.id))[0];

                        return (
                            <EditQuest
                                closeModal={() => {
                                    router.push(`${router.pathname}`);
                                    setModalOpen(false);
                                }}
                                quest={quest}
                            />
                        );
                    } else {
                        return (
                            <AddQuest
                                closeModal={() => {
                                    router.push(`${router.pathname}`);
                                    setModalOpen(false);
                                }}
                            />
                        );
                    }
                }}
                isConfirm={true}
            />
            {/* )} */}
        </>
    );
};

function shortByText(a, b) {
    if (a.text?.toLowerCase() < b.text?.toLowerCase()) {
        return -1;
    }
    if (a.text?.toLowerCase() > b.text?.toLowerCase()) {
        return 1;
    }
    return 0;
}

export default withAdminQuestQuery(CurrentQuests);
