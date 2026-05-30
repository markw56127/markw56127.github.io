const username = "markw56127";

const profileDetail = document.querySelector("#profile-detail");
const repoCount = document.querySelector("#repo-count");
const followerCount = document.querySelector("#follower-count");
const starCount = document.querySelector("#star-count");

document.querySelector("#year").textContent = new Date().getFullYear();

function compactNumber(value) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value || 0);
}

async function loadGitHubData() {
  try {
    const [profileResponse, repoResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`),
    ]);

    if (!profileResponse.ok || !repoResponse.ok) {
      throw new Error("GitHub API request failed");
    }

    const [profile, repos] = await Promise.all([
      profileResponse.json(),
      repoResponse.json(),
    ]);

    profileDetail.textContent =
      profile.bio || `${profile.public_repos} public repositories on GitHub`;
    repoCount.textContent = compactNumber(profile.public_repos);
    followerCount.textContent = compactNumber(profile.followers);
    starCount.textContent = compactNumber(
      repos.reduce((total, repo) => total + repo.stargazers_count, 0),
    );
  } catch (error) {
    repoCount.textContent = "1+";
    followerCount.textContent = "--";
    starCount.textContent = "--";
  }
}

loadGitHubData();
