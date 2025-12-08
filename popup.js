// @ts-check

/**
 * @typedef {Object} PersonaRecord
 * @property {string} id
 * @property {string} name
 * @property {string} createdAt
 *
 * @typedef {Object} HistoryRecord
 * @property {string} id
 * @property {string} personaId
 * @property {string} url
 * @property {string} title
 * @property {string} description
 * @property {string} visitedAt
 *
 * @typedef {Object} PageSnapshotRecord
 * @property {string} historyId
 * @property {string} personaId
 * @property {string} url
 * @property {string} capturedAt
 * @property {string} html
 *
 * @typedef {Object} InsightRecord
 * @property {string} id
 * @property {string} personaId
 * @property {string} kind
 * @property {any} content
 * @property {string} createdAt
 */

const DB_NAME = "personaBuilder";
const DB_VERSION = 1;
/** @type {IDBDatabase | null} */
let db = null;

/**
 * @returns {string}
 */
function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Open (and upgrade) the IndexedDB database.
 * @returns {Promise<IDBDatabase>}
 */
function openDb() {
  if (db) {
    return Promise.resolve(db);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error || new Error("Failed to open DB"));

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains("personas")) {
        database.createObjectStore("personas", { keyPath: "id" });
      }

      if (!database.objectStoreNames.contains("history")) {
        const history = database.createObjectStore("history", { keyPath: "id" });
        history.createIndex("byPersona", "personaId", { unique: false });
        history.createIndex("byPersonaVisitedAt", ["personaId", "visitedAt"], { unique: false });
        history.createIndex("byPersonaUrl", ["personaId", "url"], { unique: false });
      }

      if (!database.objectStoreNames.contains("pageSnapshots")) {
        const pageSnapshots = database.createObjectStore("pageSnapshots", { keyPath: "historyId" });
        pageSnapshots.createIndex("byHistory", "historyId", { unique: true });
        pageSnapshots.createIndex("byPersona", "personaId", { unique: false });
      }

      if (!database.objectStoreNames.contains("insights")) {
        const insights = database.createObjectStore("insights", { keyPath: "id" });
        insights.createIndex("byPersona", "personaId", { unique: false });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(request.result);
    };
  });
}

/**
 * @template T
 * @param {IDBObjectStore | IDBIndex} source
 * @param {IDBValidKey | IDBKeyRange | null} [keyOrRange]
 * @returns {Promise<T[]>}
 */
function getAll(source, keyOrRange = null) {
  return new Promise((resolve, reject) => {
    const request = source.getAll(keyOrRange);
    request.onerror = () => reject(request.error || new Error("getAll failed"));
    request.onsuccess = () => resolve(/** @type {T[]} */ (request.result));
  });
}

/**
 * @template T
 * @param {IDBObjectStore} source
 * @param {T} value
 * @returns {Promise<void>}
 */
function put(source, value) {
  return new Promise((resolve, reject) => {
    const request = source.put(value);
    request.onerror = () => reject(request.error || new Error("put failed"));
    request.onsuccess = () => resolve();
  });
}

/**
 * @param {IDBObjectStore} source
 * @param {IDBValidKey | IDBKeyRange} key
 * @returns {Promise<void>}
 */
function remove(source, key) {
  return new Promise((resolve, reject) => {
    const request = source.delete(key);
    request.onerror = () => reject(request.error || new Error("delete failed"));
    request.onsuccess = () => resolve();
  });
}

/**
 * @param {"readonly" | "readwrite"} mode
 * @param {string[]} storeNames
 * @returns {Promise<IDBTransaction>}
 */
async function transaction(mode, storeNames) {
  const database = await openDb();
  return database.transaction(storeNames, mode);
}

/**
 * @param {string} name
 * @returns {Promise<PersonaRecord>}
 */
async function addPersona(name) {
  const tx = await transaction("readwrite", ["personas"]);
  /** @type {PersonaRecord} */
  const persona = {
    id: makeId(),
    name,
    createdAt: new Date().toISOString()
  };
  await put(tx.objectStore("personas"), persona);
  tx.commit?.();
  return persona;
}

/**
 * @returns {Promise<PersonaRecord[]>}
 */
async function listPersonas() {
  const tx = await transaction("readonly", ["personas"]);
  const all = await getAll(/** @type {IDBObjectStore} */ (tx.objectStore("personas")));
  tx.commit?.();
  return all.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

/**
 * @param {string} personaId
 * @param {Omit<HistoryRecord, "personaId">} history
 * @returns {Promise<HistoryRecord>}
 */
async function addHistoryEntry(personaId, history) {
  const tx = await transaction("readwrite", ["history"]);
  const record = {
    ...history,
    id: history.id || makeId(),
    personaId
  };
  await put(tx.objectStore("history"), record);
  tx.commit?.();
  return record;
}

/**
 * @param {PageSnapshotRecord} snapshot
 * @returns {Promise<void>}
 */
async function addPageSnapshot(snapshot) {
  const tx = await transaction("readwrite", ["pageSnapshots"]);
  await put(tx.objectStore("pageSnapshots"), snapshot);
  tx.commit?.();
}

/**
 * @param {string} personaId
 * @param {Omit<InsightRecord, "personaId">} insight
 * @returns {Promise<InsightRecord>}
 */
async function addInsight(personaId, insight) {
  const tx = await transaction("readwrite", ["insights"]);
  const record = {
    ...insight,
    id: insight.id || makeId(),
    personaId
  };
  await put(tx.objectStore("insights"), record);
  tx.commit?.();
  return record;
}

/**
 * @template {HTMLElement} T
 * @param {string} id
 * @param {new (...args: any[]) => T} ctor
 * @returns {T}
 */
function getElement(id, ctor) {
  const el = document.getElementById(id);
  if (!(el instanceof ctor)) {
    throw new Error(`Expected ${id} to be a ${ctor.name}`);
  }
  return el;
}

const personaSelect = getElement("persona-select", HTMLSelectElement);
const personaForm = getElement("persona-form", HTMLDivElement);
const personaNameInput = getElement("persona-name", HTMLInputElement);
const addPersonaBtn = getElement("add-persona", HTMLButtonElement);
const savePersonaBtn = getElement("save-persona", HTMLButtonElement);
const captureBtn = getElement("capture", HTMLButtonElement);

/** @type {PersonaRecord[]} */
let personas = [];

function renderPersonas() {
  personaSelect.innerHTML = "";
  personas.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    personaSelect.appendChild(opt);
  });
}

/**
 * @param {string} [personaId]
 */
function selectPersona(personaId) {
  if (!personaId && personas.length > 0) {
    personaSelect.value = personas[0].id;
    return;
  }
  if (personaId) {
    personaSelect.value = personaId;
  }
}

/**
 * @param {string} [selectId]
 */
async function refreshPersonas(selectId) {
  personas = await listPersonas();
  if (personas.length === 0) {
    const created = await addPersona("Default Persona");
    personas = [created];
    console.log("Seeded default persona");
    selectId = created.id;
  }
  renderPersonas();
  selectPersona(selectId);
}

async function addPersonaFlow() {
  const name = (personaNameInput.value || "").trim();
  if (!name) {
    console.log("Persona add cancelled: no name provided");
    return;
  }
  const persona = await addPersona(name);
  await refreshPersonas(persona.id);
  personaNameInput.value = "";
  personaForm.classList.add("hidden");
  console.log("Persona added", persona);
}

function captureCurrentPersona() {
  const selectedId = personaSelect.value;
  const persona = personas.find((p) => p.id === selectedId);
  if (!persona) {
    console.log("Capture skipped: no persona selected");
    return;
  }
  console.log("Capture page for persona", persona);
}

function togglePersonaForm() {
  const isHidden = personaForm.classList.contains("hidden");
  personaForm.classList.toggle("hidden");
  if (isHidden) {
    personaNameInput.focus();
  }
}

addPersonaBtn.addEventListener("click", togglePersonaForm);
savePersonaBtn.addEventListener("click", () => {
  void addPersonaFlow();
});
personaNameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    void addPersonaFlow();
  }
});
captureBtn.addEventListener("click", captureCurrentPersona);
personaSelect.addEventListener("change", () => {
  const persona = personas.find((p) => p.id === personaSelect.value);
  console.log("Persona switched", persona);
});

void refreshPersonas();
