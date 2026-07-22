import { API_SOCIAL } from "../api/api.js";

const token = localStorage.getItem("token");

// Redirect to login if not logged in
if (!token) {
  window.location.href = "index.html";
}

// Fetch and display all posts
async function getPosts() {
  try {
    const response = await fetch(API_SOCIAL.posts, {
      headers: {
        Authorization: `Bearer ${token}`,
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
      <div class="post">
        <h3><a href="post.html?id=${post.id}">${post.title}</a></h3>
        <p>${post.body || ""}</p>
        <p>By: ${post.author?.name || "Unknown"}</p>
      </div>
    `;
  });
}

getPosts();