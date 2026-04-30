const username = "markw56127";

const fallbackProjects = [
  {
    name: "markw56127.github.io",
    description: "Personal portfolio site for Mark Z. Wang, built for GitHub Pages.",
    html_url: "https://github.com/markw56127/markw56127.github.io",
    homepage: "https://markw56127.github.io",
    language: "HTML",
    stargazers_count: 0,
  },
];

const projectGrid = document.querySelector("#project-grid");
const profileDetail = document.querySelector("#profile-detail");
const repoCount = document.querySelector("#repo-count");
const followerCount = document.querySelector("#follower-count");
const starCount = document.querySelector("#star-count");

document.querySelector("#year").textContent = new Date().getFullYear();

function compactNumber(value) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value || 0);
}

function escapeHtml(value) {
  const element = document.createElement("span");
  element.textContent = value || "";
  return element.innerHTML;
}

function renderProjects(repos) {
  const selectedRepos = repos
    .filter((repo) => !repo.fork)
    .sort((a, b) => {
      const stars = b.stargazers_count - a.stargazers_count;
      return stars || new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
    })
    .slice(0, 6);

  const projects = selectedRepos.length ? selectedRepos : fallbackProjects;

  projectGrid.innerHTML = projects
    .map((project) => {
      const description =
        project.description || "A public GitHub project ready for a sharper description.";
      const language = project.language || "Repository";
      const name = escapeHtml(project.name);
      const safeDescription = escapeHtml(description);
      const safeLanguage = escapeHtml(language);
      const repoUrl = encodeURI(project.html_url);
      const liveUrl = project.homepage ? encodeURI(project.homepage) : "";
      const homepage = project.homepage
        ? `<a href="${liveUrl}" aria-label="Open live site for ${name}">Live</a>`
        : "";

      return `
        <article class="project-card">
          <div>
            <h3>${name}</h3>
            <p>${safeDescription}</p>
          </div>
          <div>
            <div class="project-meta">
              <span class="tag">${safeLanguage}</span>
              <span class="tag">${compactNumber(project.stargazers_count)} stars</span>
            </div>
            <div class="project-links">
              <a href="${repoUrl}" aria-label="Open GitHub repository for ${name}">
                GitHub
              </a>
              ${homepage}
            </div>
          </div>
        </article>
      `;
    })
    .join("");
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
    renderProjects(repos);
  } catch (error) {
    repoCount.textContent = "1+";
    followerCount.textContent = "--";
    starCount.textContent = "--";
    renderProjects(fallbackProjects);
  }
}

loadGitHubData();
