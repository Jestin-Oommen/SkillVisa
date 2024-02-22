"use client"
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ImageIcon, PencilIcon, PlusCircle, VideoIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Course, MuxDate } from "@prisma/client";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";
import MuxPlayer from "@mux/mux-player-react"

interface ChapterVideoFormProps{
    initialData:Chapter & {muxDate?:MuxDate | null}
    courseId:string
    chatperId:string
} 

const formSchema=z.object({
    videoUrl:z.string().min(1)
})

const ChapterVideoForm = ({
    initialData,courseId, chatperId
}:ChapterVideoFormProps) => {
  
    const router=useRouter();
    const [isEditing,setIsEditing]=useState(false);
    
    const toggleEdit=()=>{setIsEditing((current)=>!current)}

    const form=useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema),
        defaultValues:{
            videoUrl:initialData?.videoUrl || ""
        },
    });

    const {isSubmitting,isValid}=form.formState;

    const onSubmit=async(values:z.infer<typeof formSchema>)=>{
        try{
            await axios.patch(`/api/courses/${courseId}/chapters/${chatperId}`,values);
            toast.success("Course updated");
            toggleEdit();
            router.refresh();
        }
        catch(error){
            toast.error("Something went wrong {Video Form}");
        }
    }

    return ( 
        <div className="mt-6 border bg-slate-100 rounded-sm p-4">
            <div className="flex font-medium items-center justify-between">
                Course Video
                <Button onClick={toggleEdit} variant={"ghost"}>
                    {isEditing &&(
                        <>Cancel</>
                    )}
                    {!isEditing && !initialData.videoUrl &&(
                        <>
                        <PlusCircle className="h-4 w-4 mr-2"/>
                        Add an Video
                        </>
                    )}
                    {!isEditing && initialData.videoUrl &&(
                        <>
                            <PencilIcon className="h-4 w-4 mr-2"/>
                            Edit Video                        
                        </>
                    )}
                    
                </Button>
            </div>
            {!isEditing &&(
                !initialData.videoUrl?(
                    <div className="flex justify-center items-center h-60
                    bg-slate-200 rounded-md">
                        <VideoIcon className="h-10 w-10 text-slate-500"/>

                    </div>
                
            ):(
                <div className="relative aspect-video mt-2">
                  <video src={initialData.videoUrl} controls/>
                </div>
            )
            )}
            {isEditing &&(
                <div>
                    <FileUpload
                    endpoint="chapterVideo"
                    onChange={(url)=>{
                        if(url){
                            onSubmit({
                                videoUrl:url
                            })
                        }
                    }
                  }/>

                    <div className="text-xs text-muted-foreground mt-4">
                            Upload this chapter&apos;s video
                    </div>
                </div>
            )}
            {initialData.videoUrl && !isEditing &&(
                <div className="text-xs text-muted-foreground mt-2">
                    Videos can take few minutes to process. Refresh the pages if video does not appear
                </div>
            )}
        </div>
     );
}
 
export default ChapterVideoForm;