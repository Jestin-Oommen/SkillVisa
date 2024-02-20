"use client"
import qs from "query-string"
import { Search } from "lucide-react"
import { Input } from "./ui/input"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export const SearchInput = () => {
    const [value,setValue]=useState("")
    const debouncedValue=useDebounce(value,500);

    const searchparams=useSearchParams();
    const router=useRouter();
    const pathname=usePathname();

    const currentCategoryId=searchparams.get("categoryId");

    useEffect(()=>{
        const url=qs.stringifyUrl({
            url:pathname,
            query:{
                categoryId:currentCategoryId,
                title:debouncedValue
            }
         },{
            skipEmptyString:true,skipNull:true
         });
         router.push(url)
    },[debouncedValue,currentCategoryId,pathname,router])

    return(
        <div className="relative">
            <Search 
            className="h-4 w-4 absolute top-3 left-3 text-slate-400"/>
            <Input onChange={(e)=>{setValue(e.target.value)}}
              className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100" placeholder="Search for a course"/>
        
        </div>
    )


}