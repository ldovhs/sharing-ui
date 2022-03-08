import React from "react";
import AdminNavbar from "./Navbar";

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-green-200">
            <AdminNavbar />
            <main className="mt-5">{children}</main>
        </div>
    );
}
