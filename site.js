import { recentRoles } from "./site-data.js";

function createElement(tagName, options = {}) {
  const element = document.createElement(tagName);

  if (options.className) {
    element.className = options.className;
  }

  if (options.text) {
    element.textContent = options.text;
  }

  return element;
}

function renderExperience(container, roles) {
  if (!container) {
    return;
  }

  const fragment = document.createDocumentFragment();

  roles.forEach((role) => {
    const article = createElement("article", { className: "card card-pad" });
    const roleTop = createElement("div", { className: "role-top" });
    const titleGroup = document.createElement("div");
    const roleMeta = createElement("div", { className: "role-meta" });
    const achievementList = document.createElement("ul");

    titleGroup.append(
      createElement("h3", { className: "card-title", text: role.company }),
      createElement("p", { className: "role-title", text: role.title })
    );

    roleMeta.append(
      createElement("span", { text: role.location }),
      createElement("span", { text: role.period })
    );

    roleTop.append(titleGroup, roleMeta);
    article.append(roleTop);

    if (role.subtitle) {
      article.append(createElement("p", { className: "role-subtitle", text: role.subtitle }));
    }

    role.achievements.forEach((achievement) => {
      achievementList.append(createElement("li", { text: achievement }));
    });

    article.append(achievementList);
    fragment.append(article);
  });

  container.replaceChildren(fragment);
  container.setAttribute("aria-busy", "false");
}

function setupSectionNav() {
  const navLinks = Array.from(document.querySelectorAll('.side-nav nav a[href^="#"]'));

  if (!navLinks.length) {
    return;
  }

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setActiveLink = (sectionId) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;

      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if (window.location.hash) {
    setActiveLink(window.location.hash.slice(1));
  } else if (sections[0]) {
    setActiveLink(sections[0].id);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

      if (visibleEntry?.target.id) {
        setActiveLink(visibleEntry.target.id);
      }
    },
    {
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0.15, 0.35, 0.6]
    }
  );

  sections.forEach((section) => observer.observe(section));
}

renderExperience(document.getElementById("experience-list"), recentRoles);
setupSectionNav();
