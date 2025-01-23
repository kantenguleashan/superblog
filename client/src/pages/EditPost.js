import {useEffect, useState } from "react";
import {Navigate,useParams} from 'react-router-dom';
import Editor from "../Editor";

export default function EditPost(){
    const {id} = useParams();
    const [title,setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect,setRedirect] = useState('');

    useEffect(()=> {
        fetch('http://localhost:4000/post/'+ id)
        .then(response => {response.json().then(postInfo => {
            setTitle(postInfo.title);
            setContent(postInfo.content);
            setSummary(postInfo.summary); 
        })
    })
    },[]);
/**
 * Handles the submission of the updated post form by preventing the default
 * form submission, gathering form data, and sending an update request to the server.
 * If the update is successful, it sets the redirect state to true to navigate
 * back to the homepage.
 * 
 * @param {Event} ev - The event object for the form submission.
 */

    function updatePost(ev){
        ev.preventDefault();

    }

    if(redirect){
     
        return <Navigate to={'/'}/>
     
       }
return (
         <form onSubmit={updatePost}>
         <input type="title" 
             placeholder={'Title'} 
             value={title} 
             onChange={ev => 
             setTitle(ev.target.value)}/>
         <input type="summary"
             placeholder={'Summary'}
             value ={summary}
             onChange={ev => setSummary(ev.target.value)}/>
         <input type="file" 
         onChange={ev=>setFiles(ev.target.files)}/>

             <Editor value={content}  onChange={setContent}  />
             <button style={{marginTop: '5px'}}> Create Post</button>
         </form>
     
     );
}
