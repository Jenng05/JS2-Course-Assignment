import { API_SOCIAL, API_KEY } from "../api/api.js";

const token = localStorage.getItem("token");
const params = new URLSearchParams(window.location.search);
const profileUser = params.get("user") || localStorage.getItem("username");
const username = localStorage.getItem("username");

if (!token) {
    window.location.href = "index.html";
}

async function getProfile() {
    try {
        const response = await fetch(`${API_SOCIAL.profiles}/${profileUser}?_posts=true&_followers=true`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": API_KEY,
            },
        });

        const data = await response.json();
        displayProfile(data.data);
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
}

function displayProfile(profile) {
    const profileInfo = document.getElementById("profileInfo");
    profileInfo.innerHTML = `
        <h1>${profile.name}</h1>
        <p>${profile.email || ""}</p>
        <p>Followers: ${profile._count?.followers || 0}</p>
        <p>Following: ${profile._count?.following || 0}</p>
        <p>Posts: ${profile._count?.posts || 0}</p>
        ${profileUser !== username ? `<button id="followBtn">Follow</button>` : ""}
    `;

    const postsContainer = document.getElementById("userPostsContainer");
    profile.posts?.forEach((post) => {
        postsContainer.innerHTML += `
            <div class="post">
                <h3><a href="post.html?id=${post.id}">${post.title}</a></h3>
                <p>${post.body || ""}</p>
            </div>
        `;
    });
}

getProfile();

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "index.html";
});

const followBtn = document.getElementById("followBtn");
if (followBtn) {
    followBtn.addEventListener("click", async () => {
        try {
            const response = await fetch(`${API_SOCIAL.profiles}/${profileUser}/follow`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Noroff-API-Key": API_KEY,
                },
            });

            if (response.ok) {
                alert(`You are now following ${profileUser}!`);
            }
        } catch (error) {
            console.error("Error following user:", error);
        }
    });
}