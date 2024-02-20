"use client"

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { isTeacher } from "@/lib/teacher";

const NavbarRoutes = () => {

    const pathname=usePathname();
    const {userId}=useAuth();    

    const isTeacherPage=pathname?.startsWith("/teacher");
    const isCoursePage=pathname?.startsWith("/courses");
    const isSearchPage=pathname?.startsWith("/search");

    return ( 
        <>
        {isSearchPage &&(
            <div className="hidden md:block">
                <SearchInput/>
            </div>
        )}
        <div className="flex gap-x-2 ml-auto">
            {isTeacherPage || isCoursePage?(
                <Link href={"/"}>
                 <Button>
                    <LogOut className="h-4 w-4 mr-2"/>Exit
                 </Button>
                </Link>
                
            ): isTeacher(userId) && (
                <Link href={"/teacher/courses"}>
                <Button>Teacher mode</Button>
                </Link>
            )
           
            }
            <UserButton afterSignOutUrl="/"/>
            
        </div>
        </>
     );
}
 
export default NavbarRoutes;