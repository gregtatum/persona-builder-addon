// @ts-check
/**
 * @import {HistoryRecord} from "./types"
 */

import {
  getActivePersonaId,
  setActivePersonaId,
  watchActivePersona,
} from "./active-persona.mjs";
import {
  deleteHistoryEntry,
  getPageSnapshot,
  listHistoryForPersona,
  listPersonas,
} from "./persona-db.mjs";

/**
 * @param {any} message
 * @param {...any} rest
 */
export function log(message, ...rest) {
  console.log("[persona]", message, ...rest);
}

const personaNameEl = document.getElementById("persona-name");
const historyListEl = document.getElementById("history-list");
const emptyStateEl = document.getElementById("empty-state");
const personaSelectEl = /** @type {HTMLSelectElement | null} */ (
  document.getElementById("persona-select")
);

async function load() {
  const personas = await listPersonas();
  renderPersonaOptions(personas);

  const personaId = await getActivePersonaId();
  await renderPersonaAndHistory(personaId);

  if (personaSelectEl) {
    personaSelectEl.addEventListener("change", async () => {
      const selectedId = personaSelectEl.value;
      await setActivePersonaId(selectedId);
      await renderPersonaAndHistory(selectedId);
    });
  }

  watchActivePersona(async (id) => {
    if (id && personaSelectEl) {
      personaSelectEl.value = id;
    }
    await renderPersonaAndHistory(id);
  });

  const refresh = async () => {
    const current = await getActivePersonaId();
    await renderPersonaAndHistory(current);
  };

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      void refresh();
    }
  });
  window.addEventListener("focus", () => {
    void refresh();
  });
}

/**
 * @param {import("./types").PersonaRecord[]} personas
 */
function renderPersonaOptions(personas) {
  if (!personaSelectEl) {
    return;
  }
  personaSelectEl.innerHTML = "";
  personas.forEach((persona) => {
    const option = document.createElement("option");
    option.value = persona.id;
    option.textContent = persona.name;
    personaSelectEl.appendChild(option);
  });
}

/**
 * @param {string | undefined} personaId
 */
async function renderPersonaAndHistory(personaId) {
  if (!personaId) {
    renderPersonaName("No active persona");
    renderHistory([]);
    return;
  }

  const personas = await listPersonas();
  const persona = personas.find((p) => p.id === personaId);
  renderPersonaName(persona ? persona.name : "Unknown persona");

  const history = await listHistoryForPersona(personaId);
  renderHistory(history);

  if (personaSelectEl) {
    personaSelectEl.value = personaId;
  }
}

/**
 * @param {string} name
 */
function renderPersonaName(name) {
  if (personaNameEl) {
    personaNameEl.textContent = `Active persona: ${name}`;
  }
}

/**
 * @param {HistoryRecord[]} history
 */
function renderHistory(history) {
  if (!historyListEl || !emptyStateEl) {
    return;
  }
  historyListEl.innerHTML = "";

  if (history.length === 0) {
    renderEmpty(true);
    return;
  }

  renderEmpty(false);

  history.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "history-item";

    const meta = document.createElement("div");
    meta.className = "history-meta";

    const title = document.createElement("p");
    title.className = "history-title";
    title.textContent = entry.title || entry.url;
    meta.appendChild(title);

    const link = document.createElement("a");
    link.className = "history-link";
    link.href = entry.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = entry.url;
    meta.appendChild(link);

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.gap = "12px";
    header.style.alignItems = "center";

    const actions = document.createElement("div");
    actions.className = "history-actions";

    const viewBtn = document.createElement("button");
    viewBtn.className = "delete-btn";
    viewBtn.type = "button";
    viewBtn.textContent = "View snapshot";
    viewBtn.style.color = "#0f172a";
    viewBtn.style.borderColor = "#e2e8f0";
    viewBtn.style.background = "#fff";

    const container = document.createElement("div");
    container.style.width = "100%";

    viewBtn.addEventListener("click", async () => {
      const existing = container.querySelector("iframe");
      if (existing) {
        existing.remove();
        return;
      }
      try {
        const snapshot = await getPageSnapshot(entry.id);
        if (!snapshot?.html) {
          viewBtn.textContent = "No snapshot";
          return;
        }
        const iframe = document.createElement("iframe");
        iframe.className = "snapshot-frame";
        iframe.srcdoc = snapshot.html;
        container.appendChild(iframe);
      } catch (error) {
        log("Failed to load snapshot", error);
      }
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.type = "button";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", async () => {
      await deleteHistoryEntry(entry.id);
      await renderPersonaAndHistory(entry.personaId);
    });

    actions.appendChild(viewBtn);
    actions.appendChild(deleteBtn);
    header.appendChild(meta);
    header.appendChild(actions);
    li.appendChild(header);
    li.appendChild(container);

    historyListEl.appendChild(li);
  });
}

/**
 * @param {boolean} isEmpty
 */
function renderEmpty(isEmpty) {
  if (!emptyStateEl) {
    return;
  }
  emptyStateEl.hidden = !isEmpty;
}

void load().catch((error) => log("Failed to load persona view", error));
