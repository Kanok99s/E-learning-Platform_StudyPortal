import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isStudentRoute = createRouteMatcher(["/user/(.*)"]);
const isTeacherRoute = createRouteMatcher(["/teacher/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Log the requested URL for debugging purposes
  console.log("Requested URL:", req.url);

  const { sessionClaims } = await auth();
  const userRole =
    (sessionClaims?.metadata as { userType: "student" | "teacher" })
      ?.userType || "student";

  console.log("User Role:", userRole);  // Log user role

  if (isStudentRoute(req)) {
    // If the user is a teacher but trying to access the student route
    if (userRole !== "student") {
      const url = new URL("/teacher/courses", req.url);  // Redirect teacher to the teacher courses page
      return NextResponse.redirect(url);
    }
  }

  if (isTeacherRoute(req)) {
    // If the user is a student but trying to access the teacher route
    if (userRole !== "teacher") {
      const url = new URL("/user/courses", req.url);  // Redirect student to the student courses page
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();  // Allow the request to proceed if no redirect
});

export const config = {
  matcher: "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", // Match all routes except Next.js internals and static files
};
