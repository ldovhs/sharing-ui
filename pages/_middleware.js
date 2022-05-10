import { NextResponse, NextRequest } from "next/server";
export async function middleware(req, ev) {
    // const url = req.nextUrl.clone();

    // const { pathname } = req.nextUrl;
    // console.log(pathname);
    // if (pathname.startsWith("/api/auth/callback")) {
    //     url.pathname = `/challenger${pathname}`;

    //     return NextResponse.rewrite(url);
    // }

    return NextResponse.next();
}
