import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isGestaoRoute = pathname.startsWith("/gestao");

  if (!isAdminRoute && !isGestaoRoute) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const userRole = token.role as string | undefined;

  // Área exclusiva do administrador geral
  if (isAdminRoute && userRole === "ADMIN") {
    return NextResponse.next();
  }

  // Área exclusiva do administrador municipal
  if (isGestaoRoute && userRole === "ADMIN_MUN") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
  matcher: ["/admin/:path*", "/gestao/:path*"],
};