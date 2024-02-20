// Import the authMiddleware function from Clerk
import { authMiddleware } from "@clerk/nextjs";

// Configure authMiddleware with appropriate options
const middleware = authMiddleware({
  // Configure your options here
  // For example:
  //apiRoutes: [],
  publicRoutes: ["/api/uploadthing","/api/webhook"],
  
  //ignoredRoutes: ["/((?!api|trpc))(_next.*|.+\.[\w]+$)","/api/uploadthing"],
});

export default middleware;

// Optionally, you can export a config object if needed
export const config = {
  // Your config options go here
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
