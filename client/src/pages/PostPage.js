import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {response} from "express";

export default function PostPage(){
    const [postInfo,setPostInfo] = useState(null);
    const {id} = useParams();
    useEffect(()=>{ 
   
   console.log(id); 
    fetch('http:localhost:4000/post/${id}').then(response =>{
        response.json(postInfo =>{
            setPostInfo(postInfo);
            
        });
    });

}, []);
return (
<div >post page here</div>
);
}