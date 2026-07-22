import { API_SOCIAL, API_KEY } from "../api/api.js";

const token = localStorage.getItem("token");

// Redirect to login if not logged in
if (!token) {
  window.location.href = "index.html";
}

// Fetch and display all posts
async function getPosts() {
  try {
    const response = await fetch(API_SOCIAL.posts + "?_author=true", {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
},
    });

    const data = await response.json();
    console.log(data); // la oss se hva API-et faktisk returnerer
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
      <div class="post">
        <h3><a href="post.html?id=${post.id}">${post.title}</a></h3>
        <p>${post.body || ""}</p>
        <p>By: ${post.author?.name || "Unknown"}</p>
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