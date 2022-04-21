import Head from "next/head";
import dynamic from "next/dynamic";
import { AdminLayout } from "/components/admin";
import React from "react";

function Admin() {
    return (
        <>
            <div>home page</div>
            {/* Css modules cant have a none pure style in 
             /  it like body so making a JSS style here 
             /  and applying it globally */}
            {/* <style>{`
                body {
                  overflow-x:hidden;
                  font-size: clamp(18px,2vw,28px);
                  font-family: Atlantis;
                  color: black;
                  line-height: 1.5;
                }
            `}</style> */}
        </>
    );
}

Admin.Layout = AdminLayout;
export default Admin;
