import s from "/sass/admin/admin.module.css";
import Link from "next/link";
import dynamic from "next/dynamic";
import React, { useState } from "react";

const ThemeSwitch = dynamic(() => import("./elements/ThemeSwitch.js"), {
    ssr: false,
});
/**
 * The main navbar for the website.
 * @returns
 */
export default function AdminNavbar() {
    const [isToggled, setToggled] = useState(false);
    const toggleTrueFalse = () => setToggled(!isToggled);
    return (
        <div className="header landing">
            <div className="container">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="navigation">
                            <nav className="navbar navbar-expand-lg navbar-light">
                                <div className="brand-logo">
                                    <Link href="/">
                                        <a>
                                            <img
                                                src="/images/logo.png"
                                                alt=""
                                                className="logo-primary"
                                            />
                                            <img
                                                src="/images/logow.png"
                                                alt=""
                                                className="logo-white"
                                            />
                                        </a>
                                    </Link>
                                </div>
                                <button
                                    className="navbar-toggler"
                                    type="button"
                                    onClick={() => toggleTrueFalse()}
                                >
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div
                                    className={
                                        isToggled
                                            ? "collapse navbar-collapse show"
                                            : "collapse navbar-collapse"
                                    }
                                >
                                    <ul className="navbar-nav me-auto">
                                        <li className="nav-item dropdown">
                                            <Link href="/admin">
                                                <a className="nav-link">Home</a>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link href="/admin/reward">
                                                <a className="nav-link">Rewards</a>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link href="/admin/search">
                                                <a className="nav-link">Search</a>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                <div className="signin-btn d-flex align-items-center">
                                    <ThemeSwitch />
                                    <Link href="/connect">
                                        <a className="btn btn-primary">Connect</a>
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
