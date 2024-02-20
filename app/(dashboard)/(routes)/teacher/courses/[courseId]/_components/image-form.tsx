"use client"
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ImageIcon, PencilIcon, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";

interface ImageFormProps{
    initialData:Course
    courseId:string
} 

const formSchema=z.object({
    imageUrl:z.string().min(1,"Image is required")
})

const ImageForm = ({
    initialData,courseId
}:ImageFormProps) => {
  
    const router=useRouter();
    const [isEditing,setIsEditing]=useState(false);
    
    const toggleEdit=()=>{setIsEditing((current)=>!current)}

    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            imageUrl:initialData?.imageUrl || ""
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
            toast.error("Something went wrong {Image Form}");
        }
    }

    return ( 
        <div className="mt-6 border bg-slate-100 rounded-sm p-4">
            <div className="flex font-medium items-center justify-between">
                Course Image
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing &&(
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.imageUrl &&(
                        <>
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        Add an Image
                        </>
                    )}
                    {!isEditing && initialData.imageUrl &&(
                        <>
                            <PencilIcon className="h-4 w-4 mr-2"/>
                            Edit Image                        
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing &&(
                !initialData.imageUrl?(
                    <div className="flex justify-center items-center h-60
                    bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500"/>

                    </div>
                
            ):(
                <div className="relative aspect-video mt-2">
                   <Image
                   alt="Upload" fill src={initialData.imageUrl} 
                   className="object-cover rounded-md"/>
                </div>
            )
            )}
            {isEditing &&(
                <div>
                    <FileUpload
                    endpoint="courseImage"
                    onChange={(url)=>{
                        if(url){
                            onSubmit({
                                imageUrl:url
                            })
                        }
                    }
                  }/>

                    <div className="text-xs text-muted-foreground mt-4">
                            16:9 aspect ratio recommended
                    </div>
                </div>
            )}
        </div>
     );
}
 
export default ImageForm;