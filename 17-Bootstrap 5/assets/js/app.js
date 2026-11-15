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

  // Load users safely from localStorage.
  function loadUsers() {
    try {
      const saved = localStorage.getItem(storageKey);

      if (!saved) return [...seedUsers];

      const parsed = JSON.parse(saved);

      return Array.isArray(parsed) ? parsed : [...seedUsers];
    } catch {
      return [...seedUsers];
    }
  }

  // Save the current user records.
  function saveUsers() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(users));
    } catch {
      showToast(
        "Your changes could not be saved in browser storage.",
        "Storage warning",
      );
    }
  }

  // Return the current local date without a UTC date shift.
  function getLocalDateISO() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // Escape user-provided content before inserting it into HTML.
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
    return String(name)
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
    return String(status).toLowerCase();
  }

  // Display Bootstrap toast notifications.
  function showToast(message, title = "Success") {
    const toastEl = document.getElementById("appToast");

    if (!toastEl) return;

    document.getElementById("toastTitle").textContent = title;
    document.getElementById("toastMessage").textContent = message;

    bootstrap.Toast.getOrCreateInstance(toastEl, {
      delay: 3200,
    }).show();
  }

  // Format stored registration dates for display.
  function formatDate(date) {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // Update dashboard summary cards and account distribution.
  function updateDashboard() {
    const counts = {
      Active: 0,
      Pending: 0,
      Inactive: 0,
    };

    users.forEach((user) => {
      if (counts[user.status] !== undefined) {
        counts[user.status]++;
      }
    });

    const total = users.length;

    const set = (id, value) => {
      const element = document.getElementById(id);

      if (element) {
        element.textContent = value;
      }
    };

    set("totalUsers", total);
    set("activeUsers", counts.Active);
    set("pendingUsers", counts.Pending);
    set("inactiveUsers", counts.Inactive);
    set("overviewTotal", total);
    set("activeLegend", counts.Active);
    set("pendingLegend", counts.Pending);
    set("inactiveLegend", counts.Inactive);

    // Keep the stacked distribution progress bar accessible.
    const distributionProgress = document.getElementById(
      "userStatusDistribution",
    );

    if (distributionProgress) {
      distributionProgress.setAttribute(
        "aria-valuenow",
        total > 0 ? "100" : "0",
      );

      distributionProgress.setAttribute(
        "aria-valuetext",
        `Active: ${counts.Active}, Pending: ${counts.Pending}, Inactive: ${counts.Inactive}`,
      );
    }

    ["Active", "Pending", "Inactive"].forEach((status) => {
      const element = document.getElementById(
        `${status.toLowerCase()}Progress`,
      );

      if (element) {
        const percentage = total ? (counts[status] / total) * 100 : 0;

        element.style.width = `${percentage}%`;
      }
    });
  }

  // Render the five most recently registered users.
  function renderActivities() {
    const container = document.getElementById("activityList");

    if (!container) return;

    // Illustrative indicators based on account status.
    // These are not measured onboarding completion percentages.
    const progressByStatus = {
      Active: 100,
      Pending: 60,
      Inactive: 0,
    };

    const badgeClasses = {
      Active: "success",
      Pending: "warning",
      Inactive: "danger",
    };

    const activityUsers = [...users]
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")))
      .slice(0, 5);

    container.innerHTML = activityUsers
      .map((user) => {
        const progress = progressByStatus[user.status] ?? 0;
        const badgeClass = badgeClasses[user.status] ?? "secondary";

        const progressColor =
          user.status === "Active"
            ? "bg-success"
            : user.status === "Pending"
              ? "bg-warning"
              : "bg-secondary";

        return `
          <article class="activity-item">
            <img
              class="activity-avatar"
              src="${escapeHTML(avatarFor(user))}"
              alt=""
            >

            <div class="activity-copy">
              <div>
                <strong>${escapeHTML(user.name)}</strong>
                joined the workspace
              </div>

              <p>
                ${escapeHTML(user.email)}
                ·
                <span class="badge text-bg-${badgeClass}">
                  ${escapeHTML(user.status)}
                </span>
              </p>

              <div class="activity-progress">
                <div class="activity-progress-meta">
                  <span>Account status indicator</span>
                  <strong>${progress}%</strong>
                </div>

                <div
                  class="progress activity-progress-track"
                  role="progressbar"
                  aria-label="Account status indicator for ${escapeHTML(user.name)}"
                  aria-valuenow="${progress}"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    class="progress-bar ${progressColor}"
                    style="width: ${progress}%"
                  ></div>
                </div>
              </div>
            </div>

            <time
              class="activity-time"
              datetime="${escapeHTML(user.date || "")}"
            >
              Registered ${escapeHTML(formatDate(user.date))}
            </time>
          </article>
        `;
      })
      .join("");
  }

  // Apply search, account-status and role filters.
  function filteredUsers() {
    const query = (document.getElementById("userSearch")?.value || "")
      .trim()
      .toLowerCase();

    const status = document.getElementById("statusFilter")?.value || "all";

    const role = document.getElementById("roleFilter")?.value || "all";

    return users.filter((user) => {
      const matchesQuery = [user.name, user.email, user.role].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      );

      return (
        matchesQuery &&
        (status === "all" || user.status === status) &&
        (role === "all" || user.role === role)
      );
    });
  }

  // Render the user directory and its pagination.
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
            <td>
              <div class="user-cell">
                <img
                  src="${escapeHTML(avatarFor(user))}"
                  alt=""
                >

                <div>
                  <strong>${escapeHTML(user.name)}</strong>
                  <small>${escapeHTML(user.email)}</small>
                </div>
              </div>
            </td>

            <td>
              <span class="role-text">
                ${escapeHTML(user.role)}
              </span>
            </td>

            <td>${escapeHTML(formatDate(user.date))}</td>

            <td>
              <span class="status-badge status-${statusClass(user.status)}">
                ${escapeHTML(user.status)}
              </span>
            </td>

            <td class="text-end">
              <button
                class="action-btn"
                type="button"
                data-action="edit"
                data-id="${escapeHTML(user.id)}"
                aria-label="Edit ${escapeHTML(user.name)}"
                title="Edit user"
              >
                <span aria-hidden="true">✎</span>
              </button>

              <button
                class="action-btn"
                type="button"
                data-action="delete"
                data-id="${escapeHTML(user.id)}"
                aria-label="Delete ${escapeHTML(user.name)}"
                title="Delete user"
              >
                <span aria-hidden="true">⌫</span>
              </button>
            </td>
          </tr>
        `,
      )
      .join("");

    document
      .getElementById("emptyState")
      ?.classList.toggle("d-none", filtered.length !== 0);

    document
      .querySelector(".table-responsive")
      ?.classList.toggle("d-none", filtered.length === 0);

    const count = document.getElementById("tableCount");

    if (count) {
      count.textContent = filtered.length
        ? `Showing ${start + 1}–${Math.min(start + pageSize, filtered.length)} of ${filtered.length} users`
        : "No matching users";
    }

    const pagination = document.getElementById("pagination");

    if (pagination) {
      pagination.innerHTML =
        `
          <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <button
              class="page-link"
              type="button"
              data-page="${currentPage - 1}"
              aria-label="Previous page"
              ${currentPage === 1 ? "disabled" : ""}
            >
              ‹
            </button>
          </li>
        ` +
        Array.from({ length: pages }, (_, index) => {
          const page = index + 1;
          const active = currentPage === page;

          return `
              <li class="page-item ${active ? "active" : ""}">
                <button
                  class="page-link"
                  type="button"
                  data-page="${page}"
                  aria-label="Page ${page}"
                  ${active ? 'aria-current="page"' : ""}
                >
                  ${page}
                </button>
              </li>
            `;
        }).join("") +
        `
          <li class="page-item ${currentPage === pages ? "disabled" : ""}">
            <button
              class="page-link"
              type="button"
              data-page="${currentPage + 1}"
              aria-label="Next page"
              ${currentPage === pages ? "disabled" : ""}
            >
              ›
            </button>
          </li>
        `;
    }
  }

  // Update storage and refresh all user-related sections.
  function refresh() {
    saveUsers();
    updateDashboard();
    renderUsers();
    renderActivities();
  }

  // Open the user modal with existing user information.
  function openEditModal(user) {
    resetUserModal();

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

  // Reset the Add/Edit user modal and its validation state.
  function resetUserModal() {
    const form = document.getElementById("userForm");
    const email = document.getElementById("modalEmail");

    form?.reset();
    form?.classList.remove("was-validated");

    document.getElementById("editUserId").value = "";

    email?.setCustomValidity("");
    email?.classList.remove("is-invalid");

    document.getElementById("userModalTitle").textContent = "Add user";
  }

  // Hash-based navigation for the five portal views.
  function navigate(view) {
    const validViews = [
      "dashboard",
      "users",
      "registration",
      "settings",
      "components",
    ];

    const valid = validViews.includes(view) ? view : "dashboard";

    document.querySelectorAll(".view-section").forEach((section) => {
      section.classList.toggle("d-none", section.id !== `view-${valid}`);
    });

    document.querySelectorAll(".sidebar-nav .nav-link").forEach((link) => {
      link.classList.toggle("active", link.dataset.view === valid);
    });

    const title =
      valid === "users"
        ? "User management"
        : valid.charAt(0).toUpperCase() + valid.slice(1);

    document.getElementById("breadcrumbCurrent").textContent = title;
    document.title = `Admin Portal | ${title}`;

    if (valid === "users") {
      renderUsers();
    }

    const sidebar = document.getElementById("appSidebar");

    if (window.innerWidth < 992 && sidebar.classList.contains("show")) {
      bootstrap.Offcanvas.getOrCreateInstance(sidebar).hide();
    }
  }

  // Handle links and buttons that switch between portal views.
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-view]");

    if (!target) return;

    event.preventDefault();

    const view = target.dataset.view;

    history.replaceState(null, "", `#${view}`);
    navigate(view);
  });

  window.addEventListener("hashchange", () => {
    navigate(location.hash.slice(1));
  });

  navigate(location.hash.slice(1));

  // Desktop sidebar collapse control.
  document
    .getElementById("desktopSidebarToggle")
    ?.addEventListener("click", (event) => {
      document.body.classList.toggle("sidebar-collapsed");

      const collapsed = document.body.classList.contains("sidebar-collapsed");

      event.currentTarget.setAttribute("aria-expanded", String(!collapsed));

      event.currentTarget.setAttribute(
        "aria-label",
        collapsed ? "Expand sidebar" : "Collapse sidebar",
      );
    });

  // User search and filters.
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

  // Pagination controls.
  document.getElementById("pagination")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page]");

    if (!button || button.disabled) return;

    currentPage = Number(button.dataset.page);
    renderUsers();
  });

  // Clear all user-directory filters.
  document
    .getElementById("clearFiltersButton")
    ?.addEventListener("click", () => {
      document.getElementById("userSearch").value = "";
      document.getElementById("statusFilter").value = "all";
      document.getElementById("roleFilter").value = "all";

      currentPage = 1;
      renderUsers();
    });

  // User table actions: edit and delete.
  document
    .getElementById("userTableBody")
    ?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");

      if (!button) return;

      const user = users.find((item) => item.id === Number(button.dataset.id));

      if (!user) return;

      if (button.dataset.action === "edit") {
        openEditModal(user);
      }

      if (button.dataset.action === "delete") {
        deleteTargetId = user.id;

        document.getElementById("deleteUserName").textContent = user.name;

        bootstrap.Modal.getOrCreateInstance(
          document.getElementById("deleteModal"),
        ).show();
      }
    });

  // Reset the user form whenever its modal closes.
  document
    .getElementById("userModal")
    ?.addEventListener("hidden.bs.modal", resetUserModal);

  // Clear a previous duplicate-email error when the email changes.
  document.getElementById("modalEmail")?.addEventListener("input", (event) => {
    event.currentTarget.setCustomValidity("");
  });

  // Add or edit a user.
  document.getElementById("userForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const emailInput = document.getElementById("modalEmail");

    const id = Number(document.getElementById("editUserId").value);

    const name = document.getElementById("modalName").value.trim();
    const email = emailInput.value.trim();

    emailInput.setCustomValidity("");

    if (
      users.some(
        (user) =>
          user.email.toLowerCase() === email.toLowerCase() && user.id !== id,
      )
    ) {
      emailInput.setCustomValidity("This email address is already registered.");

      form.classList.add("was-validated");

      showToast(
        "That email address is already in use.",
        "Email already exists",
      );

      return;
    }

    form.classList.add("was-validated");

    if (!form.checkValidity()) {
      return;
    }

    const existingUser = id ? users.find((user) => user.id === id) : null;

    const record = {
      id: id || Date.now(),
      name,
      email,
      role: document.getElementById("modalRole").value,
      status: document.getElementById("modalStatus").value,
      date: existingUser?.date || getLocalDateISO(),

      // Preserve existing profile and registration information when editing.
      avatar:
        existingUser?.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=efedff&color=6558d3`,

      phone: existingUser?.phone || "",
      gender: existingUser?.gender || "",
      department: existingUser?.department || "",
    };

    if (id) {
      users = users.map((user) => (user.id === id ? record : user));

      showToast("User details updated.");
    } else {
      users.unshift(record);
      showToast("New user added.");
    }

    currentPage = 1;

    refresh();

    bootstrap.Modal.getOrCreateInstance(
      document.getElementById("userModal"),
    ).hide();
  });

  // Confirm user deletion.
  document
    .getElementById("confirmDeleteButton")
    ?.addEventListener("click", () => {
      if (deleteTargetId === null) return;

      users = users.filter((user) => user.id !== deleteTargetId);
      deleteTargetId = null;

      refresh();

      bootstrap.Modal.getOrCreateInstance(
        document.getElementById("deleteModal"),
      ).hide();

      showToast("User deleted.");
    });

  // Reset the user form when opening the Add User modal.
  document
    .getElementById("addUserButton")
    ?.addEventListener("click", resetUserModal);

  document
    .getElementById("dashboardAddButton")
    ?.addEventListener("click", resetUserModal);

  // Global search opens User Management and transfers the search term.
  document
    .getElementById("globalSearch")
    ?.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;

      event.preventDefault();

      history.replaceState(null, "", "#users");
      navigate("users");

      const search = document.getElementById("userSearch");

      search.value = event.currentTarget.value;

      currentPage = 1;
      renderUsers();
    });

  // Export user records as a CSV file.
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
        new Blob([csv], {
          type: "text/csv;charset=utf-8",
        }),
      );

      const link = document.createElement("a");

      link.href = url;
      link.download = "admin-portal-users.csv";

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    });

  // Registration form elements.
  const registrationForm = document.getElementById("registrationForm");
  const registrationEmail = document.getElementById("regEmail");
  const registrationConfirm = document.getElementById("regConfirmPassword");
  const registrationPassword = document.getElementById("regPassword");
  const registrationImage = document.getElementById("regImage");
  const registrationPreview = document.getElementById("registrationPreview");

  // Save a new registration without storing its password.
  function finishRegistration(avatar) {
    const name = document.getElementById("regName").value.trim();
    const email = registrationEmail.value.trim();

    users.unshift({
      id: Date.now(),
      name,
      email,
      phone: document.getElementById("regPhone").value.trim(),
      gender: document.getElementById("regGender").value,
      department: document.getElementById("regDepartment").value,
      role: "Member",
      date: getLocalDateISO(),
      status: "Pending",
      avatar:
        avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=efedff&color=6558d3`,
    });

    currentPage = 1;

    refresh();

    registrationForm.reset();
    registrationForm.classList.remove("was-validated");

    registrationEmail.setCustomValidity("");
    registrationConfirm.setCustomValidity("");
    registrationImage.setCustomValidity("");

    registrationPreview.classList.add("d-none");
    registrationPreview.removeAttribute("src");

    showToast("Registration completed. Account is pending approval.");
  }

  // Validate and submit registration details.
  registrationForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = registrationEmail.value.trim().toLowerCase();

    const duplicateEmail = users.some(
      (user) => user.email.toLowerCase() === email,
    );

    registrationEmail.setCustomValidity(
      duplicateEmail ? "Email already exists." : "",
    );

    registrationConfirm.setCustomValidity(
      registrationConfirm.value === registrationPassword.value
        ? ""
        : "Passwords do not match.",
    );

    registrationForm.classList.add("was-validated");

    if (!registrationForm.checkValidity()) {
      if (duplicateEmail) {
        showToast("This email is already registered.", "Registration failed");
      }

      return;
    }

    const file = registrationImage.files[0];

    if (file) {
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        finishRegistration(String(reader.result));
      });

      reader.addEventListener("error", () => {
        showToast(
          "The selected image could not be read. Please try another image.",
          "Image upload failed",
        );
      });

      reader.readAsDataURL(file);
    } else {
      finishRegistration("");
    }
  });

  // Clear registration validation errors when fields change.
  registrationEmail?.addEventListener("input", (event) => {
    event.currentTarget.setCustomValidity("");
  });

  registrationConfirm?.addEventListener("input", (event) => {
    event.currentTarget.setCustomValidity("");
  });

  registrationPassword?.addEventListener("input", () => {
    registrationConfirm.setCustomValidity("");
  });

  // Validate and preview the selected profile image.
  registrationImage?.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (!file) {
      event.target.setCustomValidity("");
      registrationPreview.classList.add("d-none");
      registrationPreview.removeAttribute("src");

      return;
    }

    if (!file.type.startsWith("image/")) {
      event.target.setCustomValidity("Select an image file.");
      event.target.reportValidity();

      return;
    }

    event.target.setCustomValidity("");

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      registrationPreview.src = String(reader.result);
      registrationPreview.classList.remove("d-none");
    });

    reader.addEventListener("error", () => {
      showToast(
        "The selected image could not be previewed.",
        "Image preview failed",
      );
    });

    reader.readAsDataURL(file);
  });

  // Clear validation and image preview when registration is reset.
  registrationForm?.addEventListener("reset", () => {
    registrationForm.classList.remove("was-validated");

    registrationEmail.setCustomValidity("");
    registrationConfirm.setCustomValidity("");
    registrationImage.setCustomValidity("");

    registrationPreview.classList.add("d-none");
    registrationPreview.removeAttribute("src");
  });

  // Settings forms are front-end demonstrations.
  [
    "profileSettingsForm",
    "accountSettingsForm",
    "notificationSettingsForm",
  ].forEach((id) => {
    document.getElementById(id)?.addEventListener("submit", (event) => {
      event.preventDefault();

      if (event.currentTarget.reportValidity()) {
        showToast("Your preferences were saved in this demo session.");
      }
    });
  });

  // Validate the password confirmation in Settings.
  document
    .getElementById("passwordSettingsForm")
    ?.addEventListener("submit", (event) => {
      event.preventDefault();

      const form = event.currentTarget;
      const newPassword = document.getElementById("newPassword");
      const confirm = document.getElementById("confirmNewPassword");

      confirm.setCustomValidity(
        confirm.value === newPassword.value ? "" : "Passwords do not match.",
      );

      if (!form.reportValidity()) return;

      showToast("Password validation passed. No server password was changed.");
    });

  document
    .getElementById("confirmNewPassword")
    ?.addEventListener("input", (event) => {
      event.currentTarget.setCustomValidity("");
    });

  // Bootstrap component demonstrations.
  document.getElementById("showDemoToast")?.addEventListener("click", () => {
    showToast("This is a Bootstrap toast notification.", "Demo notification");
  });

  document
    .getElementById("notificationButton")
    ?.addEventListener("click", () => {
      showToast("You are all caught up.", "Notifications");
    });

  document.getElementById("signOutButton")?.addEventListener("click", () => {
    showToast(
      "This demonstration does not include authentication.",
      "Demo only",
    );
  });

  // Initialize Bootstrap tooltips.
  document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
    bootstrap.Tooltip.getOrCreateInstance(element);
  });

  // Initialize Bootstrap popovers.
  document.querySelectorAll('[data-bs-toggle="popover"]').forEach((element) => {
    bootstrap.Popover.getOrCreateInstance(element);
  });


  updateDashboard();
  renderActivities();
  renderUsers();
})();
