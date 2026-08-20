/* THIS FILE WAS GENERATED FROM PAYLOAD'S INTEGRATION CONTRACT.
 *
 * It is the admin panel's own root layout, and it is the reason every existing
 * route moved into `(frontend)`. Two sibling route groups mean two root layouts:
 * the site keeps its fonts, atmosphere layers, header and footer, and the admin
 * panel gets none of them — which it must not, since Payload ships its own
 * complete document shell and would fight anything wrapped around it.
 *
 * Route groups do not appear in URLs, so nothing the public sees changed.
 */
import type { ServerFunctionClient } from "payload";

import config from "@payload-config";
import { RootLayout, handleServerFunctions } from "@payloadcms/next/layouts";
import React from "react";
import { importMap } from "./admin/importMap";
import "@payloadcms/next/css";
import "./custom.scss";

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
);

export default Layout;
