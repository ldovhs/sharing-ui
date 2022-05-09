import { NextResponse, NextRequest } from "next/server";
export async function middleware(req, ev) {
    // const url = req.nextUrl.clone();
    // const { pathname } = req.nextUrl;
    // if (pathname.startsWith("/api/auth")) {
    //     url.pathname = `/challenger${pathname}`;
    //     console.log(url);
    //     return NextResponse.rewrite(url);
    // }

    return NextResponse.next();
}
