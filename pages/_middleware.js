import { NextResponse, NextRequest } from "next/server";
export async function middleware(req, ev) {
    const { pathname } = req.nextUrl;
    // if (pathname == "/" || pathname == "/challenger") {
    //     return NextResponse.redirect(
    //         `${process.env.NEXT_PUBLIC_WEBSITE_HOST}/challenger/user/quest`
    //     );
    // }
    return NextResponse.next();
}
