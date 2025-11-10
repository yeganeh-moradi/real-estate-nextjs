import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");

  const USER = "admin"; // نام کاربری دلخواه
  const PASS = "1234s";  // رمز عبور دلخواه

  if (basicAuth !== "Basic " + btoa(`${USER}:${PASS}`)) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Protected Area"',
      },
    });
  }

  return NextResponse.next();
}

// middleware برای تمام مسیرها به جز assetها و APIها
export const config = {
  matcher: ["/((?!_next|api|favicon.ico|images|static).*)"],
};
