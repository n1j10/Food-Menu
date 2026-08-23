import { clerkMiddleware, createRouteMatcher} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';


const isPublicRoute = createRouteMatcher(['/','/about','/products(.*)','/sign-in(.*)','/sign-up(.*)',
  '/checkout(.*)',
  '/payment-result(.*)',
  // ZainCash calls these server-to-server; their JWT is verified in the route handlers.
  '/api/payment/callback(.*)',
  '/api/payment/webhook(.*)',
]);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);



export default clerkMiddleware(async(auth, req) => {
  const { userId } = await auth();
  const isAdmin = userId === process.env.ADMIN_USER_ID;

  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  if (isAdminRoute(req) && !isAdmin) {
    return NextResponse.redirect(new URL('/', req.url));
  }
});

  

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for Clerk's auto-proxy path
    '/__clerk/:path*',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};









// const isPublicRoute = createRouteMatcher([ '/','/about','/products','/sign-in(.*)','/sign-up(.*)']);  
// const isAdminRoute = createRouteMatcher(['/admin(.*)']);



// export default clerkMiddleware(async(auth, req) => {
//   const isAdmin = (await auth()).userId === process.env.ADMIN_USER_ID;

//   if (!isPublicRoute(req)) {
//     await auth.protect()
//   }
// if (isAdminRoute(req) && !isAdmin ) {
//    return NextResponse.redirect(new URL("/", req.url))
//   }

// });
