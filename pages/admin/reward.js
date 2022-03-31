import React, { useEffect, useState, useContext } from "react";
import { AdminLayout } from "/components/admin/ComponentIndex";

import AddNewReward from "@components/admin/reward/AddNewReward";

const AdminRewards = () => {
    useEffect(async () => {}, []);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-xxl-6 col-xl-6 col-lg-6">
                    <h4 className="card-title mb-3">Reward</h4>
                    <div className="card">
                        <div className="card-body">
                            <AddNewReward />
                        </div>
                    </div>
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
        </div>
    );
};

AdminRewards.Layout = AdminLayout;
AdminRewards.requireAdmin = true;
export default AdminRewards;
