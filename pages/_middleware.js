import { NextResponse, NextRequest } from "next/server";
export async function middleware(req, ev) {
    const { pathname } = req.nextUrl;
    if (pathname == "/") {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_WEBSITE_HOST}/user/quest`);
    }
    return NextResponse.next();
}
