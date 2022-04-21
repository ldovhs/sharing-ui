import React, { useEffect, useState } from "react";
import { AdminLayout, SearchForm, SearchResult } from "/components/admin";

const AdminSearch = () => {
    const [formData, setFormData] = useState({});

    const [isFetch, setIsFetch] = useState(false);
    useEffect(() => {}, []);

    const onFormSubmit = (data) => {
        setFormData(data);
        setIsFetch(true);
    };

    return (
        <>
            <div className="col-xxl-12">
                <div className="page-title-content mb-4">
                    <h3>Search</h3>
                    <p className="mb-2">Lookup wallets and users</p>
                </div>
                <h4 className="card-title mb-3">New Search</h4>
                <div className="card">
                    <div className="card-body">
                        <SearchForm onFormSubmit={onFormSubmit} />
                    </div>
                </div>
                {isFetch && <SearchResult formData={formData} />}
            </div>
        </>
    );
};

AdminSearch.Layout = AdminLayout;
AdminSearch.requireAdmin = true;
export default AdminSearch;
