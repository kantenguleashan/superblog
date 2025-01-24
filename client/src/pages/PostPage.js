import { formatISO9075 } from 'date-fns';
import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserContext } from "../UserContext";

export default function PostPage() {
    const [postInfo, setPostInfo] = useState(null);
    const { userInfo } = useContext(UserContext);
    const { id } = useParams();

    useEffect(() => {
        // Fetch the post information based on the post ID
        fetch(`http://localhost:4000/post/${id}`)
            .then((response) => {
                response.json().then((postInfo) => {
                    setPostInfo(postInfo);
                });
            })
            .catch((err) => console.error('Error fetching post:', err));
    }, [id]);

    // If postInfo is not loaded, show loading message
    if (!postInfo) {
        return <div>Loading post details...</div>;
    }

    // Function to handle post deletion
    async function deletePost() {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (!confirmDelete) return;

        const response = await fetch(`http://localhost:4000/post/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (response.ok) {
            alert("Post deleted successfully.");
            // Redirect to home page or another relevant page after deletion
            window.location.href = "/";
        } else {
            alert("Failed to delete post. Please try again.");
        }
    }

    return (
        <div className="post-page">
            <h1>{postInfo.title}</h1>
            <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
            <div className="author">by @{postInfo.author?.username}</div>

            {/* Edit and Delete options visible only to the post author */}
            {userInfo?.id === postInfo.author?._id && (
                <div className="edit-row">
                    {/* Edit Button */}
                    <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                            />
                        </svg>
                        Edit Post
                    </Link>

                    {/* Delete Button */}
                    <button className="delete-btn" onClick={deletePost}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        Delete Post
                    </button>
                </div>
            )}

            {/* Post Image */}
            <div className="image">
                <img src={`http://localhost:4000/${postInfo.cover}`} alt="Post Cover" />
            </div>

            {/* Post Content */}
            <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />
        </div>
    );
}
