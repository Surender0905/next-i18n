import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { i18n } from './i18n-config';

import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log(pathname);
  const authToken = 'next-auth.session-token';
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    if (request.cookies.get(authToken)) {
      if (!pathname.startsWith('/login') && !pathname.startsWith('/signup')) {
        return NextResponse.redirect(
          new URL(`/${locale}/dashboard`, request.url)
        );
      } else {
        return NextResponse.redirect(
          new URL(`/${locale}/dashboard`, request.url)
        );
      }
    } else {
      const secureRoutes = ['/home', '/addProduct', '/dashboard'];
      const isSecureRoute = secureRoutes.some((route) =>
        pathname.startsWith(route)
      );
      if (isSecureRoute) {
        return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
      } else {
        return NextResponse.redirect(
          new URL(
            `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
            request.url
          )
        );
      }
    }

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    );
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
