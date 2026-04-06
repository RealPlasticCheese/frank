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
      const item = document.createElement("li");
      item.innerHTML = achievement;
      achievementList.append(item);
    });

    article.append(achievementList);
    fragment.append(article);
  });

  container.replaceChildren(fragment);
  container.setAttribute("aria-busy", "false");
}

function setupMobileMenu(sideNav, navLinks) {
  const menuToggle = sideNav?.querySelector(".menu-toggle");
  const mobileQuery = window.matchMedia("(max-width: 980px)");

  if (!sideNav || !menuToggle) {
    return;
  }

  const setMenuOpen = (open) => {
    sideNav.dataset.menuOpen = open ? "true" : "false";
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  const closeMenu = () => setMenuOpen(false);

  setMenuOpen(false);

  menuToggle.addEventListener("click", () => {
    if (!mobileQuery.matches) {
      return;
    }

    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileQuery.matches) {
        closeMenu();
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (
      mobileQuery.matches &&
      sideNav.dataset.menuOpen === "true" &&
      event.target instanceof Node &&
      !sideNav.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sideNav.dataset.menuOpen === "true") {
      closeMenu();
      menuToggle.focus();
    }
  });

  const syncMenuState = () => {
    if (!mobileQuery.matches) {
      closeMenu();
    }
  };

  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", syncMenuState);
  } else {
    mobileQuery.addListener(syncMenuState);
  }
}

function setupSectionNav(navLinks) {
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

  const getActiveSectionId = () => {
    const lastSection = sections[sections.length - 1];
    const scrollTop = window.scrollY;
    const scrollBottom = window.scrollY + window.innerHeight;
    const pageBottom = document.documentElement.scrollHeight;

    if (lastSection && scrollBottom >= pageBottom - 2) {
      return lastSection.id;
    }

    let activeSection = sections[0];

    for (let index = 0; index < sections.length - 1; index += 1) {
      const currentSection = sections[index];
      const nextSection = sections[index + 1];
      const handoffPoint = currentSection.offsetTop + (nextSection.offsetTop - currentSection.offsetTop) / 2;

      if (scrollTop >= handoffPoint) {
        activeSection = nextSection;
      } else {
        break;
      }
    }

    return activeSection?.id;
  };

  const syncActiveSection = () => {
    const activeSectionId = getActiveSectionId();

    if (activeSectionId) {
      setActiveLink(activeSectionId);
    }
  };

  syncActiveSection();
  window.addEventListener("scroll", syncActiveSection, { passive: true });
  window.addEventListener("resize", syncActiveSection);
  window.addEventListener("hashchange", syncActiveSection);
}

const sideNav = document.querySelector(".side-nav");
const sectionNavLinks = Array.from(document.querySelectorAll('.side-nav nav a[href^="#"]'));

renderExperience(document.getElementById("experience-list"), window.siteData?.recentRoles ?? []);
setupMobileMenu(sideNav, sectionNavLinks);
setupSectionNav(sectionNavLinks);
