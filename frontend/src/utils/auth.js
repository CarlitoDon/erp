//src/utils/auth.js

export function logout(navigate) {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("isAdmin");
  if (navigate) navigate("/login");
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export function getUserInfo() {
  return {
    username: localStorage.getItem("username"),
    isAdmin: localStorage.getItem("isAdmin") === "true",
  };
}
