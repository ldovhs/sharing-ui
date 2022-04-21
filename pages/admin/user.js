import React, { useEffect } from "react";
import { AdminLayout, AddNewUser } from "/components/admin";

const AdminUsers = () => {
    useEffect(async () => {}, []);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-xxl-8 col-xl-8 col-lg-12">
                    <h4 className="card-title mb-3">Manual User</h4>
                    <div className="card">
                        <div className="card-body">
                            <AddNewUser />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

AdminUsers.Layout = AdminLayout;
AdminUsers.requireAdmin = true;
export default AdminUsers;
