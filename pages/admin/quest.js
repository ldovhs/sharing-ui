import React, { useEffect, useState } from "react";
import { AdminLayout } from "/components/admin/ComponentIndex";
import { Modal, AdminLogin } from "/components/admin/ComponentIndex";
import { CurrentQuests } from "@components/admin/ComponentIndex";
import AddQuest from "@components/admin/quest/AddQuest";

const AdminQuest = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    useEffect(async () => {}, []);

    return (
        <div className="container">
            {/* <button
                type="button"
                className="btn btn-primary m-2"
                onClick={() => setModalOpen(true)}
            >
                Add New Quest
            </button> */}
            <div className="row justify-content-center">
                <div className="col-xxl-6 col-xl-6 col-lg-6">
                    <h4 className="card-title mb-3">Customize Quests</h4>
                    <CurrentQuests />
                </div>
                <div className="col-xxl-4 col-xl-4 col-lg-6">
                    <h4 className="card-title mb-3">Preview</h4>
                    <div className="card items">
                        <div className="card-body">
                            <img
                                className=""
                                src="/img/sharing-ui/invite/preview.png"
                                alt="reward-preview"
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setModalOpen(false);
                }}
                title="Test"
                render={(modal) => {
                    return (
                        <AddQuest
                            closeModal={() => {
                                setModalOpen(false);
                            }}
                        />
                    );
                }}
                isConfirm={true}
            /> */}
        </div>
    );
};

AdminQuest.Layout = AdminLayout;
AdminQuest.requireAdmin = true;
export default AdminQuest;
