import { API_SOCIAL, API_KEY } from "../api/api.js";

const token = localStorage.getItem("token");

// Redirect to login if not logged in
if (!token) {
  window.location.href = "index.html";
}

// Fetch and display all posts
/**
 * Fetches all posts from the API and displays them
 * @returns {Promise<void>}
 */
async function getPosts() {
  try {
    const response = await fetch(API_SOCIAL.posts + "?_author=true", {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
},
    });

    const data = await response.json();
    displayPosts(data.data);
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

// Display posts in the DOM
function displayPosts(posts) {
  const container = document.getElementById("postsContainer");
  container.innerHTML = "";

  posts.forEach((post) => {
    container.innerHTML += `
      <div class="bg-white p-6 rounded-lg shadow mb-4 break-words">
        <h3 class="text-xl font-bold mb-2"><a href="post.html?id=${post.id}" class="hover:underline">${post.title}</a></h3>
        <p class="text-gray-700 mb-2">${post.body || ""}</p>
        <p class="text-sm text-gray-500">By: <a href="profile.html?user=${post.author?.name}" class="text-blue-500 hover:underline">${post.author?.name || "Unknown"}</a></p>
      </div>
    `;
  });
}

getPosts();

const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "index.html";
});

const createPostForm = document.getElementById("createPostForm");
createPostForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("postTitle").value;
    const body = document.getElementById("postBody").value;

    try {
        const response = await fetch(API_SOCIAL.posts, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": API_KEY,
            },
            body: JSON.stringify({ title, body }),
        });

        if (response.ok) {
            getPosts();
            createPostForm.reset();
        }
    } catch (error) {
        console.error("Error creating post:", error);
    }
});

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", async (event) => {
    const query = event.target.value;
    
    if (query.length > 2) {
        const response = await fetch(`${API_SOCIAL.posts}/search?q=${query}&_author=true`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": API_KEY,
            },
        });
        const data = await response.json();
        displayPosts(data.data);
    } else if (query.length === 0) {
        getPosts();
    }
});