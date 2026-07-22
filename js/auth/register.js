import { API_AUTH } from "../api/api.js";

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(API_AUTH.register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Registration successful! Please login.");
      window.location.href = "index.html";
    } else {
      alert(data.errors[0].message);
    }
  } catch (error) {
    console.error("Register error:", error);
  }
});