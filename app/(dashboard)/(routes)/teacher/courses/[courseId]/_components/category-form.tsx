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
import { Course } from "@prisma/client";
import { Combobox } from "@/components/ui/combobox";
interface CategoryFormProps{
    initialData:Course
    courseId:string
    options:{label:string,value:string}[]
} 

const formSchema=z.object({
    categoryId:z.string().min(1)
})

const CategoryForm = ({
    initialData,courseId,options
}:CategoryFormProps) => {
  
    const router=useRouter();
    const [isEditing,setIsEditing]=useState(false);
    
    const toggleEdit=()=>{setIsEditing((current)=>!current)}

    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            categoryId:initialData?.categoryId || ""
        },
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
            toast.error("Something went wrong {Category Form}");
        }
    }

    const selectedOptions=options.find((option)=>option.value===initialData.categoryId)

    return ( 
        <div className="mt-6 border bg-slate-100 rounded-sm p-4">
            <div className="flex font-medium items-center justify-between">
                Course Category
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing &&(
                        <>Cancel</>
                    )}
                    {!isEditing &&(
                        <>
                            <PencilIcon className="h-4 w-4 mr-2"/>
                            Edit Category                        
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing &&(
                <p className={cn("text-sm mt-2", !initialData.categoryId && "text-slate-500 italic")}>
                    {selectedOptions?.label || "No category"}
                </p>
            )}
            {isEditing &&(
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-43">
                       <FormField 
                       control={form.control} name="categoryId"
                       render={({field})=>{
                        return(
                        <FormItem>
                            <FormControl>
                                <Combobox options={ ...options} {...field}/>
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
 
export default CategoryForm;