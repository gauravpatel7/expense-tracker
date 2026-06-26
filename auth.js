// Signup
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", e => {
    e.preventDefault();
    const user = document.getElementById("signupUser").value;
    const pass = document.getElementById("signupPass").value;

    localStorage.setItem("user", user);
    localStorage.setItem("pass", pass);

    alert("Signup successful! Please login.");
    window.location.href = "login.html";
  });
}

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const user = document.getElementById("loginUser").value;
    const pass = document.getElementById("loginPass").value;

    const storedUser = localStorage.getItem("user");
    const storedPass = localStorage.getItem("pass");

    if (user === storedUser && pass === storedPass) {
      alert("Login successful!");
      window.location.href = "index.html"; // redirect to expense tracker
    } else {
      alert("Invalid credentials!");
    }
  });
}
