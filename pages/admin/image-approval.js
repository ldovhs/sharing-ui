import React, { useEffect } from "react";
import { AdminLayout, ImageUploadApproval } from "/components/admin";

const AdminImageApproval = () => {
    useEffect(async () => {}, []);

    return (
        <div className="row justify-content-center">
            <ImageUploadApproval />
        </div>
    );
};

AdminImageApproval.Layout = AdminLayout;
AdminImageApproval.requireAdmin = true;
export default AdminImageApproval;
