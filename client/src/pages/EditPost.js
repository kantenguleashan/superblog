import React, { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Editor from "../Editor";

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      const response = await fetch(`http://localhost:4000/post/${id}`);
      const data = await response.json();
      setTitle(data.title);
      setSummary(data.summary);
      setContent(data.content);
    }

    fetchPost();
  }, [id]);

  async function updatePost(ev) {
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    if (files) data.set('file', files[0]);
    ev.preventDefault();

    const response = await fetch(`http://localhost:4000/post/${id}`, {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });

    if (response.ok) {
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={`/post/${id}`} />;
  }

  return (
    <form onSubmit={updatePost}>
      <input
        type="text"
        placeholder={'Title'}
        value={title}
        onChange={ev => setTitle(ev.target.value)}
      />
      <input
        type="text"
        placeholder={'Summary'}
        value={summary}
        onChange={ev => setSummary(ev.target.value)}
      />
      <input
        type="file"
        onChange={ev => setFiles(ev.target.files)}
      />
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: '5px' }}>Update Post</button>
    </form>
  );
}
