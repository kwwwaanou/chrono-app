import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

let locales = ['en', 'fr'];
let defaultLocale = 'en';

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;
  
  // Détection simple basée sur le header Accept-Language
  if (acceptLanguage.includes('fr')) return 'fr';
  return 'en';
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Vérifie si le pathname contient déjà une locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirige si la locale est absente
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }
}

export const config = {
  matcher: [
    // Ignore tous les chemins internes (_next) et les fichiers statiques
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
