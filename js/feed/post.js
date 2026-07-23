import { API_SOCIAL, API_KEY } from "../api/api.js";

const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

if (!token) {
    window.location.href = "index.html";
}

// Get post ID from URL
const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

async function getPost() {
    try {
        const response = await fetch(`${API_SOCIAL.posts}/${postId}?_author=true`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": API_KEY,
            },
        });

        const data = await response.json();
        displayPost(data.data);
    } catch (error) {
        console.error("Error fetching post:", error);
    }
}

function displayPost(post) {
    const container = document.getElementById("postContainer");
    container.innerHTML = `
        <h1>${post.title}</h1>
        <p>${post.body || ""}</p>
        <p>By: ${post.author?.name || "Unknown"}</p>
    `;

    // Show edit/delete buttons if user owns the post
    if (post.author?.name === username) {
        document.getElementById("editPostSection").style.display = "block";
        document.getElementById("editTitle").value = post.title;
        document.getElementById("editBody").value = post.body || "";
    }
}

getPost();

// Edit post
const editForm = document.getElementById("editPostForm");
editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("editTitle").value;
    const body = document.getElementById("editBody").value;

    try {
        const response = await fetch(`${API_SOCIAL.posts}/${postId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": API_KEY,
            },
            body: JSON.stringify({ title, body }),
        });

        if (response.ok) {
            alert("Post updated!");
            getPost();
        }
    } catch (error) {
        console.error("Error updating post:", error);
    }
});

// Delete post
const deleteBtn = document.getElementById("deletePostBtn");
deleteBtn.addEventListener("click", async () => {
    if (confirm("Are you sure you want to delete this post?")) {
        try {
            const response = await fetch(`${API_SOCIAL.posts}/${postId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Noroff-API-Key": API_KEY,
                },
            });

            if (response.ok) {
                window.location.href = "feed.html";
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    }
});