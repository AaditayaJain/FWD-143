// Hostel Service Hub: simple front-end login and complaint form

const USERS_KEY = "hsh_users";
const CURRENT_USER_KEY = "hsh_current_user";
const COMPLAINTS_KEY = "hsh_complaints";

const authSection = document.getElementById("authSection");
const complaintSection = document.getElementById("complaintSection");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const complaintForm = document.getElementById("complaintForm");

const showLoginButton = document.getElementById("showLoginButton");
const showRegisterButton = document.getElementById("showRegisterButton");
const authHeading = document.getElementById("authHeading");

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

function showComplaintForm(user) {
  authSection.classList.add("hidden");
  complaintSection.classList.remove("hidden");
  document.getElementById("welcomeMessage").textContent =
    "Signed in as " + user.name + " (" + user.email + ").";
}

function showLoginScreen() {
  complaintSection.classList.add("hidden");
  authSection.classList.remove("hidden");
}

function showLoginTab() {
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
  showLoginButton.classList.add("active");
  showRegisterButton.classList.remove("active");
  authHeading.textContent = "Login to continue";
}

function showRegisterTab() {
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  showRegisterButton.classList.add("active");
  showLoginButton.classList.remove("active");
  authHeading.textContent = "Create your account";
}

showLoginButton.addEventListener("click", showLoginTab);
showRegisterButton.addEventListener("click", showRegisterTab);

// Login is checked only on this complaint page. Other pages remain public.
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  const users = getUsers();

  const matchingUser = users.find(function (user) {
    return user.email === email && user.password === password;
  });

  const message = document.getElementById("loginMessage");

  if (matchingUser) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(matchingUser));
    message.textContent = "";
    showComplaintForm(matchingUser);
  } else {
    message.textContent = "Incorrect email or password. Please try again or create an account.";
    message.className = "form-message error-message";
  }
});

// A visitor can create an account when the complaint page asks them to log in.
registerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim().toLowerCase();
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const message = document.getElementById("registerMessage");

  if (password !== confirmPassword) {
    message.textContent = "The passwords do not match.";
    message.className = "form-message error-message";
    return;
  }

  const users = getUsers();
  const emailAlreadyExists = users.some(function (user) {
    return user.email === email;
  });

  if (emailAlreadyExists) {
    message.textContent = "An account with this email already exists. Please log in.";
    message.className = "form-message error-message";
    return;
  }

  const newUser = { name: name, email: email, password: password };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

  message.textContent = "";
  showComplaintForm(newUser);
});

// Store a submitted complaint in this browser for this front-end demonstration.
complaintForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const user = getCurrentUser();

  if (!user) {
    showLoginScreen();
    return;
  }

  const complaints = JSON.parse(localStorage.getItem(COMPLAINTS_KEY)) || [];

  const newComplaint = {
    complaintId: "HSH-" + Date.now(),
    userName: user.name,
    userEmail: user.email,
    category: document.getElementById("complaintCategory").value,
    roomNumber: document.getElementById("roomNumber").value.trim(),
    description: document.getElementById("complaintDescription").value.trim(),
    submittedAt: new Date().toLocaleString()
  };

  complaints.push(newComplaint);
  localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(complaints));

  const message = document.getElementById("complaintMessage");
  message.textContent = "Your complaint has been registered. Reference ID: " + newComplaint.complaintId;
  message.className = "form-message success-message";

  complaintForm.reset();
});

// Logging out removes the current login session, but does not delete the account.
document.getElementById("logoutButton").addEventListener("click", function () {
  localStorage.removeItem(CURRENT_USER_KEY);
  complaintForm.reset();
  document.getElementById("complaintMessage").textContent = "";
  showLoginScreen();
  showLoginTab();
});

// If the user has already signed in on this browser, show the form directly.
const savedUser = getCurrentUser();

if (savedUser) {
  showComplaintForm(savedUser);
} else {
  showLoginScreen();
  showLoginTab();
}
