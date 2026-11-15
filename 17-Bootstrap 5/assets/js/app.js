(() => {
  "use strict";

  const seedUsers = [
    {
      id: 1,
      name: "Olivia Rhye",
      email: "olivia.rhye@example.com",
      role: "Administrator",
      date: "2026-10-12",
      status: "Active",
      avatar: "https://i.pravatar.cc/80?img=47",
    },
    {
      id: 2,
      name: "Phoenix Baker",
      email: "phoenix.baker@example.com",
      role: "Manager",
      date: "2026-10-18",
      status: "Active",
      avatar: "https://i.pravatar.cc/80?img=12",
    },
    {
      id: 3,
      name: "Lana Steiner",
      email: "lana.steiner@example.com",
      role: "Editor",
      date: "2026-10-21",
      status: "Pending",
      avatar: "https://i.pravatar.cc/80?img=44",
    },
    {
      id: 4,
      name: "Demi Wilkinson",
      email: "demi.wilkinson@example.com",
      role: "Member",
      date: "2026-10-24",
      status: "Active",
      avatar: "https://i.pravatar.cc/80?img=49",
    },
    {
      id: 5,
      name: "Candice Wu",
      email: "candice.wu@example.com",
      role: "Manager",
      date: "2026-10-28",
      status: "Inactive",
      avatar: "https://i.pravatar.cc/80?img=45",
    },
    {
      id: 6,
      name: "Natali Craig",
      email: "natali.craig@example.com",
      role: "Editor",
      date: "2026-11-01",
      status: "Active",
      avatar: "https://i.pravatar.cc/80?img=48",
    },
    {
      id: 7,
      name: "Drew Cano",
      email: "drew.cano@example.com",
      role: "Member",
      date: "2026-11-02",
      status: "Pending",
      avatar: "https://i.pravatar.cc/80?img=13",
    },
    {
      id: 8,
      name: "Orlando Diggs",
      email: "orlando.diggs@example.com",
      role: "Member",
      date: "2026-11-04",
      status: "Active",
      avatar: "https://i.pravatar.cc/80?img=14",
    },
    {
      id: 9,
      name: "Andi Lane",
      email: "andi.lane@example.com",
      role: "Manager",
      date: "2026-11-05",
      status: "Active",
      avatar: "https://i.pravatar.cc/80?img=43",
    },
    {
      id: 10,
      name: "Kate Morrison",
      email: "kate.morrison@example.com",
      role: "Member",
      date: "2026-11-06",
      status: "Pending",
      avatar: "https://i.pravatar.cc/80?img=41",
    },
    {
      id: 11,
      name: "Koray Okumus",
      email: "koray.okumus@example.com",
      role: "Administrator",
      date: "2026-11-07",
      status: "Active",
      avatar: "https://i.pravatar.cc/80?img=11",
    },
    {
      id: 12,
      name: "John Smith",
      email: "john.smith@example.com",
      role: "Member",
      date: "2026-11-08",
      status: "Inactive",
      avatar: "https://i.pravatar.cc/80?img=15",
    },
  ];
  const storageKey = "admin-portal-users-v1";
  let users = loadUsers();
  let currentPage = 1;
  const pageSize = 6;
  let deleteTargetId = null;

  function loadUsers() {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : seedUsers;
    } catch {
      return seedUsers;
    }
  }
  function saveUsers() {
    localStorage.setItem(storageKey, JSON.stringify(users));
  }
  function escapeHTML(value) {
    return String(value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  }
  function initials(name) {
    return name
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  function avatarFor(user) {
    return (
      user.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=efedff&color=6558d3`
    );
  }
  function statusClass(status) {
    return status.toLowerCase();
  }
  function showToast(message, title = "Success") {
    const toastEl = document.getElementById("appToast");
    if (!toastEl) return;
    document.getElementById("toastTitle").textContent = title;
    document.getElementById("toastMessage").textContent = message;
    bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3200 }).show();
  }
  function formatDate(date) {
    return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  function updateDashboard() {
    const counts = { Active: 0, Pending: 0, Inactive: 0 };
    users.forEach((user) => {
      if (counts[user.status] !== undefined) counts[user.status]++;
    });
    const total = users.length || 0;
    const set = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    set("totalUsers", total);
    set("activeUsers", counts.Active);
    set("pendingUsers", counts.Pending);
    set("inactiveUsers", counts.Inactive);
    set("overviewTotal", total);
    set("activeLegend", counts.Active);
    set("pendingLegend", counts.Pending);
    set("inactiveLegend", counts.Inactive);
    ["active", "pending", "inactive"].forEach((key) => {
      const el = document.getElementById(`${key}Progress`);
      if (el)
        el.style.width = `${total ? (counts[key[0].toUpperCase() + key.slice(1)] / total) * 100 : 0}%`;
    });
  }
  function renderActivities() {
    const container = document.getElementById("activityList");
    if (!container) return;
    const activityUsers = [...users].slice(-5).reverse();
    container.innerHTML = activityUsers
      .map(
        (user, index) => `
      <div class="activity-item">
        <img class="activity-avatar" src="${escapeHTML(avatarFor(user))}" alt="">
        <div class="activity-copy"><div><strong>${escapeHTML(user.name)}</strong> ${index === 0 ? "was added to the workspace" : "account details were updated"}</div>
          <p>${escapeHTML(user.email)} · <span class="badge text-bg-${user.status === "Active" ? "success" : user.status === "Pending" ? "warning" : "danger"}">${escapeHTML(user.status)}</span></p></div>
        <span class="activity-time">${index === 0 ? "Just now" : `${index * 2 + 1}h ago`}</span>
      </div>`,
      )
      .join("");
  }
  function filteredUsers() {
    const query = (document.getElementById("userSearch")?.value || "")
      .trim()
      .toLowerCase();
    const status = document.getElementById("statusFilter")?.value || "all";
    const role = document.getElementById("roleFilter")?.value || "all";
    return users.filter((user) => {
      const matchesQuery = [user.name, user.email, user.role].some((value) =>
        value.toLowerCase().includes(query),
      );
      return (
        matchesQuery &&
        (status === "all" || user.status === status) &&
        (role === "all" || user.role === role)
      );
    });
  }
  function renderUsers() {
    const body = document.getElementById("userTableBody");
    if (!body) return;
    const filtered = filteredUsers();
    const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    currentPage = Math.min(currentPage, pages);
    const start = (currentPage - 1) * pageSize;
    const shown = filtered.slice(start, start + pageSize);
    body.innerHTML = shown
      .map(
        (user) => `
      <tr>
        <td><div class="user-cell"><img src="${escapeHTML(avatarFor(user))}" alt=""><div><strong>${escapeHTML(user.name)}</strong><small>${escapeHTML(user.email)}</small></div></div></td>
        <td><span class="role-text">${escapeHTML(user.role)}</span></td><td>${formatDate(user.date)}</td>
        <td><span class="status-badge status-${statusClass(user.status)}">${escapeHTML(user.status)}</span></td>
        <td class="text-end"><button class="action-btn" data-action="edit" data-id="${user.id}" aria-label="Edit ${escapeHTML(user.name)}" title="Edit">✎</button><button class="action-btn" data-action="delete" data-id="${user.id}" aria-label="Delete ${escapeHTML(user.name)}" title="Delete">⌫</button></td>
      </tr>`,
      )
      .join("");
    document
      .getElementById("emptyState")
      ?.classList.toggle("d-none", filtered.length !== 0);
    document
      .querySelector(".table-responsive")
      ?.classList.toggle("d-none", filtered.length === 0);
    const count = document.getElementById("tableCount");
    if (count)
      count.textContent = filtered.length
        ? `Showing ${start + 1}–${Math.min(start + pageSize, filtered.length)} of ${filtered.length} users`
        : "No matching users";
    const pagination = document.getElementById("pagination");
    if (pagination) {
      pagination.innerHTML =
        `<li class="page-item ${currentPage === 1 ? "disabled" : ""}"><button class="page-link" data-page="${currentPage - 1}" aria-label="Previous page">‹</button></li>` +
        Array.from(
          { length: pages },
          (_, i) =>
            `<li class="page-item ${currentPage === i + 1 ? "active" : ""}"><button class="page-link" data-page="${i + 1}" aria-label="Page ${i + 1}" ${currentPage === i + 1 ? 'aria-current="page"' : ""}>${i + 1}</button></li>`,
        ).join("") +
        `<li class="page-item ${currentPage === pages ? "disabled" : ""}"><button class="page-link" data-page="${currentPage + 1}" aria-label="Next page">›</button></li>`;
    }
  }
  function refresh() {
    saveUsers();
    updateDashboard();
    renderUsers();
    renderActivities();
  }
  function openEditModal(user) {
    document.getElementById("userModalTitle").textContent = "Edit user";
    document.getElementById("editUserId").value = user.id;
    document.getElementById("modalName").value = user.name;
    document.getElementById("modalEmail").value = user.email;
    document.getElementById("modalRole").value = user.role;
    document.getElementById("modalStatus").value = user.status;
    bootstrap.Modal.getOrCreateInstance(
      document.getElementById("userModal"),
    ).show();
  }
  function resetUserModal() {
    document.getElementById("userForm")?.reset();
    document.getElementById("userForm")?.classList.remove("was-validated");
    document.getElementById("editUserId").value = "";
    document.getElementById("userModalTitle").textContent = "Add user";
  }

  // Navigation: hash-based views keep the portal usable as a small multi-view app.
  function navigate(view) {
    const valid = [
      "dashboard",
      "users",
      "registration",
      "settings",
      "components",
    ].includes(view)
      ? view
      : "dashboard";
    document
      .querySelectorAll(".view-section")
      .forEach((section) =>
        section.classList.toggle("d-none", section.id !== `view-${valid}`),
      );
    document
      .querySelectorAll(".sidebar-nav .nav-link")
      .forEach((link) =>
        link.classList.toggle("active", link.dataset.view === valid),
      );
    const title =
      valid === "users"
        ? "User management"
        : valid.charAt(0).toUpperCase() + valid.slice(1);
    document.getElementById("breadcrumbCurrent").textContent = title;
    document.title = `Admin Portal | ${title}`;
    if (valid === "users") renderUsers();
    const sidebar = document.getElementById("appSidebar");
    if (window.innerWidth < 992 && sidebar.classList.contains("show"))
      bootstrap.Offcanvas.getOrCreateInstance(sidebar).hide();
  }
  document.addEventListener("click", (event) => {
    const nav = event.target.closest("[data-view]");
    if (nav) {
      event.preventDefault();
      const view = nav.dataset.view;
      history.replaceState(null, "", `#${view}`);
      navigate(view);
    }
  });
  window.addEventListener("hashchange", () => navigate(location.hash.slice(1)));
  navigate(location.hash.slice(1));

  document
    .getElementById("desktopSidebarToggle")
    ?.addEventListener("click", () => {
      document.body.classList.toggle("sidebar-collapsed");
      const collapsed = document.body.classList.contains("sidebar-collapsed");
      document
        .getElementById("desktopSidebarToggle")
        .setAttribute("aria-expanded", String(!collapsed));
    });
  document.getElementById("userSearch")?.addEventListener("input", () => {
    currentPage = 1;
    renderUsers();
  });
  document.getElementById("statusFilter")?.addEventListener("change", () => {
    currentPage = 1;
    renderUsers();
  });
  document.getElementById("roleFilter")?.addEventListener("change", () => {
    currentPage = 1;
    renderUsers();
  });
  document.getElementById("pagination")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page]");
    if (!button || button.closest(".disabled")) return;
    currentPage = Number(button.dataset.page);
    renderUsers();
  });
  document
    .getElementById("clearFiltersButton")
    ?.addEventListener("click", () => {
      document.getElementById("userSearch").value = "";
      document.getElementById("statusFilter").value = "all";
      document.getElementById("roleFilter").value = "all";
      currentPage = 1;
      renderUsers();
    });
  document
    .getElementById("userTableBody")
    ?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");
      if (!button) return;
      const user = users.find((item) => item.id === Number(button.dataset.id));
      if (!user) return;
      if (button.dataset.action === "edit") openEditModal(user);
      if (button.dataset.action === "delete") {
        deleteTargetId = user.id;
        document.getElementById("deleteUserName").textContent = user.name;
        bootstrap.Modal.getOrCreateInstance(
          document.getElementById("deleteModal"),
        ).show();
      }
    });
  document
    .getElementById("userModal")
    ?.addEventListener("hidden.bs.modal", resetUserModal);
  document.getElementById("userForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    form.classList.add("was-validated");
    if (!form.checkValidity()) return;
    const id = Number(document.getElementById("editUserId").value);
    const name = document.getElementById("modalName").value.trim(),
      email = document.getElementById("modalEmail").value.trim();
    if (
      users.some(
        (user) =>
          user.email.toLowerCase() === email.toLowerCase() && user.id !== id,
      )
    ) {
      document
        .getElementById("modalEmail")
        .setCustomValidity("This email is already registered.");
      form.classList.add("was-validated");
      showToast(
        "That email address is already in use.",
        "Email already exists",
      );
      return;
    }
    document.getElementById("modalEmail").setCustomValidity("");
    const record = {
      id: id || Date.now(),
      name,
      email,
      role: document.getElementById("modalRole").value,
      status: document.getElementById("modalStatus").value,
      date: id
        ? users.find((user) => user.id === id)?.date ||
          new Date().toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=efedff&color=6558d3`,
    };
    if (id) {
      users = users.map((user) => (user.id === id ? record : user));
      showToast("User details updated.");
    } else {
      users.unshift(record);
      showToast("New user added.");
    }
    refresh();
    bootstrap.Modal.getOrCreateInstance(
      document.getElementById("userModal"),
    ).hide();
  });
  document
    .getElementById("confirmDeleteButton")
    ?.addEventListener("click", () => {
      users = users.filter((user) => user.id !== deleteTargetId);
      deleteTargetId = null;
      refresh();
      bootstrap.Modal.getOrCreateInstance(
        document.getElementById("deleteModal"),
      ).hide();
      showToast("User deleted.");
    });
  document
    .getElementById("addUserButton")
    ?.addEventListener("click", resetUserModal);
  document
    .getElementById("dashboardAddButton")
    ?.addEventListener("click", resetUserModal);

  // Global search opens the directory and transfers the search term.
  document
    .getElementById("globalSearch")
    ?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        history.replaceState(null, "", "#users");
        navigate("users");
        const search = document.getElementById("userSearch");
        search.value = event.currentTarget.value;
        currentPage = 1;
        renderUsers();
      }
    });
  document
    .getElementById("exportUsersButton")
    ?.addEventListener("click", () => {
      const headers = ["Name", "Email", "Role", "Registration date", "Status"];
      const rows = users.map((user) => [
        user.name,
        user.email,
        user.role,
        user.date,
        user.status,
      ]);
      const csv = [headers, ...rows]
        .map((row) =>
          row
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(","),
        )
        .join("\n");
      const url = URL.createObjectURL(
        new Blob([csv], { type: "text/csv;charset=utf-8" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "admin-portal-users.csv";
      link.click();
      URL.revokeObjectURL(url);
    });

  // Registration form: Bootstrap validation plus custom password matching.
  const registrationForm = document.getElementById("registrationForm");
  registrationForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const password = document.getElementById("regPassword"),
      confirm = document.getElementById("regConfirmPassword");
    confirm.setCustomValidity(
      confirm.value === password.value ? "" : "Passwords do not match.",
    );
    registrationForm.classList.add("was-validated");
    if (!registrationForm.checkValidity()) return;
    const name = document.getElementById("regName").value.trim(),
      email = document.getElementById("regEmail").value.trim();
    if (
      users.some((user) => user.email.toLowerCase() === email.toLowerCase())
    ) {
      document
        .getElementById("regEmail")
        .setCustomValidity("Email already exists.");
      registrationForm.classList.add("was-validated");
      showToast("This email is already registered.", "Registration failed");
      return;
    }
    users.unshift({
      id: Date.now(),
      name,
      email,
      role: "Member",
      date: new Date().toISOString().slice(0, 10),
      status: "Pending",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=efedff&color=6558d3`,
    });
    refresh();
    registrationForm.reset();
    registrationForm.classList.remove("was-validated");
    document.getElementById("registrationPreview").classList.add("d-none");
    showToast("Registration completed. Account is pending approval.");
  });
  document
    .getElementById("regEmail")
    ?.addEventListener("input", (event) =>
      event.currentTarget.setCustomValidity(""),
    );
  document
    .getElementById("regConfirmPassword")
    ?.addEventListener("input", (event) =>
      event.currentTarget.setCustomValidity(""),
    );
  document.getElementById("regImage")?.addEventListener("change", (event) => {
    const file = event.target.files[0],
      preview = document.getElementById("registrationPreview");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      event.target.setCustomValidity("Select an image file.");
      event.target.reportValidity();
      return;
    }
    event.target.setCustomValidity("");
    preview.src = URL.createObjectURL(file);
    preview.classList.remove("d-none");
  });

  // Settings forms are front-end demonstrations; no remote account is changed.
  [
    "profileSettingsForm",
    "accountSettingsForm",
    "notificationSettingsForm",
  ].forEach((id) => {
    document.getElementById(id)?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (event.currentTarget.reportValidity())
        showToast("Your preferences were saved in this demo session.");
    });
  });
  document
    .getElementById("passwordSettingsForm")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = event.currentTarget,
        newPassword = document.getElementById("newPassword"),
        confirm = document.getElementById("confirmNewPassword");
      confirm.setCustomValidity(
        confirm.value === newPassword.value ? "" : "Passwords do not match.",
      );
      if (!form.reportValidity()) return;
      showToast("Password validation passed. No server password was changed.");
    });
  document
    .getElementById("confirmNewPassword")
    ?.addEventListener("input", (event) =>
      event.currentTarget.setCustomValidity(""),
    );
  document
    .getElementById("showDemoToast")
    ?.addEventListener("click", () =>
      showToast("This is a Bootstrap toast notification.", "Demo notification"),
    );
  document
    .getElementById("notificationButton")
    ?.addEventListener("click", () =>
      showToast("You are all caught up.", "Notifications"),
    );
  document
    .getElementById("signOutButton")
    ?.addEventListener("click", () =>
      showToast(
        "This demonstration does not include authentication.",
        "Demo only",
      ),
    );

  document
    .querySelectorAll('[data-bs-toggle="tooltip"]')
    .forEach((el) => new bootstrap.Tooltip(el));
  document
    .querySelectorAll('[data-bs-toggle="popover"]')
    .forEach((el) => new bootstrap.Popover(el));
  updateDashboard();
  renderActivities();
  renderUsers();
})();
