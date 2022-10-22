

import { AdminLayout } from "/components/admin";
import React, { useEffect } from "react";


function Admin() {
  useEffect(() => { }, []);

  return (
    <>
      <div>this is admin home</div>
    </>
  );
}

Admin.requireAdmin = true;
Admin.Layout = AdminLayout;

export default Admin;