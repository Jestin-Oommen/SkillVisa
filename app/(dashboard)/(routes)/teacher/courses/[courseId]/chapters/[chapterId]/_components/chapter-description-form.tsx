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
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Chapter, Course } from "@prisma/client";
import { Editor } from "@/app/(dashboard)/_components/editor";
import { Preview } from "@/components/preview";
interface ChapterDescriptionFormProps{
    initialData:Chapter
    courseId:string
    chapterId:string
} 

const formSchema=z.object({
    description:z.string().min(1)
})

const ChapterDescriptionForm = ({
    initialData,courseId,chapterId
}:ChapterDescriptionFormProps) => {
  
    const router=useRouter();
    const [isEditing,setIsEditing]=useState(false);
    
    const toggleEdit=()=>{setIsEditing((current)=>!current)}

    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            description:initialData?.description || ""
        },
    });

    const {isSubmitting,isValid}=form.formState;

    const onSubmit=async(values:z.infer<typeof formSchema>)=>{
        try{
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`,values);
            toast.success("Chapter updated");
            toggleEdit();
            router.refresh();
        }
        catch(error){
            toast.error("Something went wrong {Chapter Description Form}");
        }
    }

    return ( 
        <div className="mt-6 border bg-slate-100 rounded-sm p-4">
            <div className="flex font-medium items-center justify-between">
                Chapter Description
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing &&(
                        <>Cancel</>
                    )}
                    {!isEditing &&(
                        <>
                            <PencilIcon className="h-4 w-4 mr-2"/>
                            Edit Description                        
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing &&(
                <div className={cn("text-sm mt-2", !initialData.description && "text-slate-500 italic")}>
                    {!initialData.description && "No description"}
                    {initialData.description && <Preview value={initialData.description}/>}
                </div>
            )}
            {isEditing &&(
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-43">
                       <FormField 
                       control={form.control} name="description"
                       render={({field})=>{
                        return(
                        <FormItem>
                            <FormControl>
                                <Editor {...field}/>
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
 
export default ChapterDescriptionForm;