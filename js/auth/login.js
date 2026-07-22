import { API_AUTH } from "../api/api.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(API_AUTH.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem("username", data.data.name);
      window.location.href = "feed.html";
    } else {
      alert(data.errors[0].message);
    }
  } catch (error) {
    console.error("Login error:", error);
  }
});