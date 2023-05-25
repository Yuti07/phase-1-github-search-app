const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("results-container");

searchForm.addEventListener("submit", handleSearch);

async function handleSearch(event) {
  event.preventDefault();
  const searchTerm = searchInput.value.trim();

  if (searchTerm === "") {
    return;
  }

  try {
    const users = await searchUsers(searchTerm);
    displayUsers(users);
  } catch (error) {
    console.log("Error searching users:", error);
  }
}

async function searchUsers(username) {
  const response = await fetch(`https://api.github.com/search/users?q=${username}`);
  const data = await response.json();
  return data.items;
}

function displayUsers(users) {
  resultsContainer.innerHTML = "";

  if (users.length === 0) {
    resultsContainer.innerHTML = "<p>No users found.</p>";
    return;
  }

  for (const user of users) {
    const userCard = createUserCard(user);
    resultsContainer.appendChild(userCard);
  }
}

function createUserCard(user) {
  const userCard = document.createElement("div");
  userCard.classList.add("user-card");

  const avatar = document.createElement("img");
  avatar.src = user.avatar_url;
  avatar.alt = `${user.login} avatar`;
  userCard.appendChild(avatar);

  const username = document.createElement("h3");
  username.textContent = user.login;
  userCard.appendChild(username);

  const profileLink = document.createElement("a");
  profileLink.href = user.html_url;
  profileLink.textContent = "View Profile";
  userCard.appendChild(profileLink);

  userCard.addEventListener("click", () => {
    fetchUserRepos(user.login)
      .then((repos) => displayRepos(repos, user.login))
      .catch((error) => console.log("Error fetching user repositories:", error));
  });

  return userCard;
}

async function fetchUserRepos(username) {
  const response = await fetch(`https://api.github.com/users/${username}/repos`);
  const data = await response.json();
  return data;
}

function displayRepos(repos, username) {
  const userCard = document.querySelector(`.user-card[data-username="${username}"]`);
  const reposContainer = document.createElement("div");
  reposContainer.classList.add("repos-container");

  for (const repo of repos) {
    const repoLink = document.createElement("a");
    repoLink.href = repo.html_url;
    repoLink.textContent = repo.name;
    reposContainer.appendChild(repoLink);
  }

  userCard.appendChild(reposContainer);
}
