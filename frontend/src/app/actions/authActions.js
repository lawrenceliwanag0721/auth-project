const API_URL = "http://localhost:5000/api/user";

async function authRequest(endpoint, data, failureMessage) {
  const response = await fetch(`${API_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    const errors = Array.isArray(result.errors) ? result.errors.join(' ') : '';
    throw new Error(result.message || errors || failureMessage);
  }

  return result;
}

export function signIn(data) {
  return authRequest("signin", data, "Login failed");
}

export function register(data) {
  return authRequest("signup", data, "Registration failed");
}
