import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function DeletePost() {
    const { id } = useParams(); // Get the post ID from the URL
    const navigate = useNavigate(); // For redirecting after deletion
    const [post, setPost] = useState(null); // To display the post details (optional)
    const [loading, setLoading] = useState(true); // To handle loading state

    useEffect(() => {
        // Fetch the post details to show before deletion (optional)
        fetch(`http://localhost:4000/post/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setPost(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching post details:", error);
                setLoading(false);
            });
    }, [id]);

    async function handleDelete() {
        // Confirm deletion with the user
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        // Send DELETE request to the backend
        const response = await fetch(`http://localhost:4000/post/${id}`, {
            method: "DELETE",
            credentials: "include", // Include cookies if authentication is needed
        });

        if (response.ok) {
            alert("Post deleted successfully!");
            navigate("/"); // Redirect to the homepage or another page after deletion
        } else {
            alert("Failed to delete the post. Please try again.");
        }
    }

    if (loading) {
        return <div>Loading post details...</div>;
    }

    if (!post) {
        return <div>Post not found!</div>;
    }

    return (
        <div>
            <h1>Delete Post</h1>
            <h2>{post.title}</h2>
            <p>{post.summary}</p>
            <p>{post.content}</p>
            <button onClick={handleDelete} style={{ backgroundColor: "red", color: "white" }}>
                Delete Post
            </button>
        </div>
    );
}
