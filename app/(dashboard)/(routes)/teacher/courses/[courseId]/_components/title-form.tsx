"use client"
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {Form,FormControl,FormField, FormItem, FormMessage} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PencilIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
interface TitleFormProps{
    initialData:{
        title:string
    }
    courseId:string
} 

const formSchema=z.object({
    title:z.string().min(1,"Title is required")
})

const TitleForm = ({
    initialData,courseId
}:TitleFormProps) => {
  
    const router=useRouter();
    const [isEditing,setIsEditing]=useState(false);
    
    const toggleEdit=()=>{setIsEditing((current)=>!current)}

    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData,
    });

    const {isSubmitting,isValid}=form.formState;

    const onSubmit=async(values:z.infer<typeof formSchema>)=>{
        try{
            await axios.patch(`/api/courses/${courseId}`,values);
            toast.success("Course updated");
            toggleEdit();
            router.refresh();
        }
        catch(error){
            toast.error("Something went wrong {Title Form}");
        }
    }

    return ( 
        <div className="mt-6 border bg-slate-100 rounded-sm p-4">
            <div className="flex font-medium items-center justify-between">
                Course Title
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing &&(
                        <>Cancel</>
                    )}
                    {!isEditing &&(
                        <>
                            <PencilIcon className="h-4 w-4 mr-2"/>
                            Edit Title                        
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing &&(
                <p className="text-sm mt-2">
                    {initialData.title}
                </p>
            )}
            {isEditing &&(
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-43">
                       <FormField 
                       control={form.control} name="title"
                       render={({field})=>{
                        return(
                        <FormItem>
                            <FormControl>
                                <Input disabled={isSubmitting}
                                placeholder="e.g Web Development" {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                     )}}
                       /> 
                       <div className="flex items-center gap-x-2 mt-2">
                          <Button disabled={isSubmitting || !isValid}
                          type="submit">
                            Save
                          </Button>
                       </div>
                    </form>
                </Form>
            )}
        </div>
     );
}
 
export default TitleForm;