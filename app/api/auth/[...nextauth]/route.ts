// https://javascript.plainenglish.io/complete-authentication-guide-using-next-auth-v5-in-next-js-14-70e7630ab1c2
// Now we’ll make a folder named api/auth inside the app directory which will contain all our logic for authentication. 
// Inside this folder we create a subdirectory named [...nextauth] with a file named route.js. 
// Interestingly, this naming convention is really important because this way every API request beginning with /api/auth/* will be handled by the code written in the [...nextauth]/route.js file.

// Note: In Next-Auth v4 all the authorization logic was handled by the [...nextauth].js file, 
// but since the v5 upgrade we have moved our authorization logic to the root of our repository so that it can be easily imported everywhere.
// And now this file becomes a 1-line handler for GET and POST requests for those paths.
// https://github.com/javayhux/authjs-prisma-edge-example/commit/0de0fcd6ce5759517a3a31647e56a8260722f076
export { GET, POST } from "@/auth";

// export const runtime = 'edge';
