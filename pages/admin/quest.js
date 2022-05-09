import React, { useEffect, useState } from "react";
import { AdminLayout } from "/components/admin";
import { CurrentQuests } from "@components/admin";
import Enums from enums;

const AdminQuest = () => {
    useEffect(async () => {}, []);

    return (
        <div className="container">
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
                                src={`${Enums.BASEPATH}/img/sharing-ui/invite/preview.png`}
                                alt="reward-preview"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

AdminQuest.Layout = AdminLayout;
AdminQuest.requireAdmin = true;
export default AdminQuest;
