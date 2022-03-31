import React, { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import Enums from "enums";
import { Modal, AdminLogin } from "/components/admin/ComponentIndex";
import { useRouter } from "next/router";
import Link from "next/link";
import { route } from "next/dist/server/router";
import { EditQuest, AddQuest } from "../ComponentIndex";
import { withQuestQuery } from "shared/HOC/quest";

const CurrentQuests = ({ quests, isLoading, error }) => {
    let router = useRouter();

    const [isModalOpen, setModalOpen] = useState(false);
    console.log(quests);
    return (
        <>
            <div className="card">
                {quests && quests.length > 0 && (
                    <div className="card-body">
                        {quests.map((item, index, row) => {
                            console.log(item);
                            return (
                                <React.Fragment key={index}>
                                    <div className="verify-content">
                                        <div className="d-flex align-items-center">
                                            <span className="me-3 icon-circle bg-primary text-white">
                                                <i className="ri-bank-line"></i>
                                            </span>
                                            <div className="primary-number">
                                                <h5 className="mb-0">
                                                    {item.type}{" "}
                                                    {item.type === Enums.FOLLOW_TWITTER &&
                                                        `@${item.followAccount}`}
                                                </h5>
                                                <small>{item.description}</small>
                                                <br />
                                                <span className="text-success">
                                                    {item.isRequired ? "Required" : "Optional"}
                                                </span>
                                            </div>
                                        </div>
                                        <button className=" btn btn-outline-primary">
                                            <Link href={`${router.pathname}/?id=${item.id}`}>
                                                Manage
                                            </Link>
                                        </button>
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
                //isOpen={router.query?.typeId !== null ? router.query.typeId : isModalOpen}
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

export default withQuestQuery(CurrentQuests);
