(() => {
  // =========================
  // CONFIG
  // =========================
  const PATHS = {
    subsetInitiatives: "./data/initiatives.csv",
    fullInitiatives: "./data/initiatives_full_501.csv", // optional: upload if you want the 501 scope switch
    companyMaster: "./data/company_master_clean.csv",
    mechanismCounts: "./data/patterns_mechanism_counts.csv",
    partnerCounts: "./data/patterns_partner_types_from_initiatives.csv",
    clusterAssignments: "./data/patterns_topic_cluster_assignments.csv",
    clusterSummary: "./data/patterns_topic_clusters_summary.csv",
    top10: "./data/generic_patterns_brief_top10.csv"
  };

  // =========================
  // I18N
  // =========================
  const I18N = {
    en: {
      brandTitle: "ESG Collaboration Mapping",
      brandSubtitle: "Chinese companies • BRICS+ focus",
      scopeTitle: "Dataset Scope",
      scopeSubset: "Subset (111)",
      scopeFull: "Full (501)",
      scopeNoteSubset: "Using the cleaned subset for pattern analysis.",
      scopeNoteFullMissing: "Full extraction file not found (upload data/initiatives_full_501.csv).",
      scopeNoteFull: "Using the full extraction dataset (for coverage checks).",
      filtersTitle: "Filters",
      searchLabel: "Search",
      searchPlaceholder: "Search title, actor, evidence...",
      kpiFilterLabel: "KPI Present",
      collabFilterLabel: "Collaboration Type",
      esgFilterLabel: "ESG Block",
      sectorFilterLabel: "Sector",
      themeFilterLabel: "Theme",
      patternFilterLabel: "Pattern Group",
      resetFilters: "Reset filters",
      exportFiltered: "Export filtered CSV",
      statusTitle: "Status",
      dashboardTitle: "Dashboard",
      dashboardSubtitle: "Evidence-backed mapping of ESG collaboration initiatives",
      kpiInitiatives: "Initiatives",
      kpiCompanies: "Companies",
      tabOverview: "Overview",
      tabPatterns: "Patterns",
      tabEvidence: "Evidence Explorer",
      tabMethod: "Method",
      chartCollabTitle: "Collaboration Type Distribution",
      chartESGTitle: "ESG Block Distribution",
      chartMechanismTitle: "Mechanism Signals",
      chartMechanismNote: "Keyword-based transparent tagging",
      chartPartnerTitle: "Partner Types by Collaboration",
      chartPartnerNote: "Counts are actor/partner mentions (edges)",
      patternsTop10Title: "Top Pattern Groups",
      exportTop10: "Export top patterns CSV",
      patternCardsTitle: "Pattern Cards",
      evidenceTableTitle: "Initiatives",
      detailPanelTitle: "Initiative Details",
      detailTitle: "Title",
      detailCompany: "Company",
      detailTags: "Labels",
      detailThemePattern: "Theme / Pattern",
      detailKPI: "KPI",
      detailActors: "Actors involved",
      detailEvidenceMeta: "Evidence source",
      detailQuote: "Short quote",
      detailExcerpt: "Evidence excerpt",
      detailDescription: "Description",
      detailOutcome: "Outputs / outcomes",
      methodTitle: "Technical Method (Short)",
      datasetFilesTitle: "Files loaded",
      msSelectAll: "Select all",
      msClear: "Clear",
      msSearchPlaceholder: "Search options...",
      msAny: "Any",
      rows: "Rows",
      companies: "Companies",
      subsetLabel: "Subset",
      fullLabel: "Full",
      methodIntro:
        "This dashboard summarizes a structured ESG initiative dataset from Chinese company reports. It is designed for supervisor review, evidence checking, and pattern exploration.",
      methodStepsTitle: "Method steps",
      methodStep1: "Indexing: company metadata is read from company_master_clean.csv and linked by report_id.",
      methodStep2: "Initiative table: initiatives are loaded from initiatives.csv (subset) and optionally initiatives_full_501.csv (full extraction).",
      methodStep3: "Pattern mapping: cluster assignments and cluster summaries are merged to label initiatives with pattern groups.",
      methodStep4: "Mechanism signals: transparent keyword rules tag mechanism categories (donation, training, R&D, carbon, water, biodiversity, etc.).",
      methodStep5: "Partner types: actors_involved text is split into actor mentions and classified into government / ngo_public / academia_health / business / other.",
      methodStep6: "Charts and tables are recalculated from the current filtered view (not static screenshots).",
      noData: "No data",
      notStated: "NOT STATED",
      loadedStatus: "Loaded",
      loadError: "Load error",
      fileOptionalMissing: "Optional file not found",
      activeFilters: "Active filters",
      collabDescBG: "Business ↔ Government",
      collabDescBN: "Business ↔ NGO/Public",
      collabDescBS: "Business ↔ Society/Community",
      collabDescBB: "Business ↔ Business"
    },
    ru: {
      brandTitle: "Карта ESG-взаимодействий",
      brandSubtitle: "Китайские компании • фокус BRICS+",
      scopeTitle: "Набор данных",
      scopeSubset: "Подвыборка (111)",
      scopeFull: "Полный (501)",
      scopeNoteSubset: "Используется очищенная подвыборка для анализа паттернов.",
      scopeNoteFullMissing: "Файл полного извлечения не найден (загрузите data/initiatives_full_501.csv).",
      scopeNoteFull: "Используется полный набор извлечений (для проверки охвата).",
      filtersTitle: "Фильтры",
      searchLabel: "Поиск",
      searchPlaceholder: "Поиск по названию, участнику, доказательству...",
      kpiFilterLabel: "Наличие KPI",
      collabFilterLabel: "Тип взаимодействия",
      esgFilterLabel: "Блок ESG",
      sectorFilterLabel: "Сектор",
      themeFilterLabel: "Тема",
      patternFilterLabel: "Группа паттернов",
      resetFilters: "Сбросить фильтры",
      exportFiltered: "Скачать отфильтрованный CSV",
      statusTitle: "Статус",
      dashboardTitle: "Дашборд",
      dashboardSubtitle: "Карта ESG-инициатив с подтверждающими фрагментами",
      kpiInitiatives: "Инициативы",
      kpiCompanies: "Компании",
      tabOverview: "Обзор",
      tabPatterns: "Паттерны",
      tabEvidence: "Проверка доказательств",
      tabMethod: "Метод",
      chartCollabTitle: "Распределение по типам взаимодействия",
      chartESGTitle: "Распределение по блокам ESG",
      chartMechanismTitle: "Сигналы механизмов",
      chartMechanismNote: "Прозрачная разметка по ключевым словам",
      chartPartnerTitle: "Типы партнёров по типу взаимодействия",
      chartPartnerNote: "Счётчики = упоминания акторов (ребра)",
      patternsTop10Title: "Топ групп паттернов",
      exportTop10: "Скачать CSV топ-паттернов",
      patternCardsTitle: "Карточки паттернов",
      evidenceTableTitle: "Инициативы",
      detailPanelTitle: "Детали инициативы",
      detailTitle: "Название",
      detailCompany: "Компания",
      detailTags: "Метки",
      detailThemePattern: "Тема / Паттерн",
      detailKPI: "KPI",
      detailActors: "Участники",
      detailEvidenceMeta: "Источник доказательства",
      detailQuote: "Короткая цитата",
      detailExcerpt: "Фрагмент доказательства",
      detailDescription: "Описание",
      detailOutcome: "Результаты / эффекты",
      methodTitle: "Технический метод (кратко)",
      datasetFilesTitle: "Загруженные файлы",
      msSelectAll: "Выбрать всё",
      msClear: "Очистить",
      msSearchPlaceholder: "Поиск опций...",
      msAny: "Любые",
      rows: "Строк",
      companies: "Компаний",
      subsetLabel: "Подвыборка",
      fullLabel: "Полный",
      methodIntro:
        "Этот дашборд показывает структурированный набор ESG-инициатив из отчетов китайских компаний. Он нужен для проверки результатов руководителем, верификации доказательств и анализа повторяющихся паттернов.",
      methodStepsTitle: "Шаги метода",
      methodStep1: "Индексация: метаданные компаний читаются из company_master_clean.csv и связываются по report_id.",
      methodStep2: "Таблица инициатив: инициативы загружаются из initiatives.csv (подвыборка) и при наличии initiatives_full_501.csv (полный набор).",
      methodStep3: "Связь с паттернами: присваиваются cluster_id и названия паттернов через файлы кластеров.",
      methodStep4: "Сигналы механизмов: применяются прозрачные правила по ключевым словам (пожертвования, обучение, R&D, углерод, вода, биоразнообразие и др.).",
      methodStep5: "Типы партнёров: поле actors_involved разбивается на участников и классифицируется как government / ngo_public / academia_health / business / other.",
      methodStep6: "Графики и таблицы пересчитываются от текущего набора после фильтрации (а не из статичных скриншотов).",
      noData: "Нет данных",
      notStated: "НЕ УКАЗАНО",
      loadedStatus: "Загружено",
      loadError: "Ошибка загрузки",
      fileOptionalMissing: "Не найден необязательный файл",
      activeFilters: "Активные фильтры",
      collabDescBG: "Бизнес ↔ Государство",
      collabDescBN: "Бизнес ↔ НКО/публичные орг.",
      collabDescBS: "Бизнес ↔ Общество/сообщества",
      collabDescBB: "Бизнес ↔ Бизнес"
    }
  };

  // =========================
  // STATE
  // =========================
  const state = {
    lang: localStorage.getItem("dashLang") || "en",
    theme: localStorage.getItem("dashTheme") || "light",
    scope: "subset", // subset | full

    raw: {
      subsetInitiatives: [],
      fullInitiatives: [],
      companyMaster: [],
      mechanismCounts: [],
      partnerCounts: [],
      clusterAssignments: [],
      clusterSummary: [],
      top10: []
    },

    currentRows: [], // enriched rows for active scope
    filteredRows: [],
    fullAvailable: false,

    maps: {
      companyByReportId: new Map(),
      clusterByInitiativeId: new Map(),
      clusterSummaryById: new Map()
    },

    filters: {
      search: "",
      kpi: "ALL",
      collab: new Set(),
      esg: new Set(),
      sector: new Set(),
      theme: new Set(),
      pattern: new Set()
    },

    ui: {
      page: 1,
      pageSize: 12,
      selectedInitiativeId: null,
      activeTab: "overview"
    }
  };

  // =========================
  // DOM
  // =========================
  const el = {
    statusText: document.getElementById("statusText"),
    pillRows: document.getElementById("pillRows"),
    pillCompanies: document.getElementById("pillCompanies"),
    topSubtitle: document.getElementById("topSubtitle"),

    btnLang: document.getElementById("btnLang"),
    btnTheme: document.getElementById("btnTheme"),
    btnReset: document.getElementById("btnReset"),
    btnExport: document.getElementById("btnExport"),
    btnExportTop10: document.getElementById("btnExportTop10"),
    btnPrevPage: document.getElementById("btnPrevPage"),
    btnNextPage: document.getElementById("btnNextPage"),

    scopeSubset: document.getElementById("scopeSubset"),
    scopeFull: document.getElementById("scopeFull"),
    scopeNote: document.getElementById("scopeNote"),

    fSearch: document.getElementById("fSearch"),
    fKPI: document.getElementById("fKPI"),

    msCollab: document.getElementById("msCollab"),
    msESG: document.getElementById("msESG"),
    msSector: document.getElementById("msSector"),
    msTheme: document.getElementById("msTheme"),
    msPattern: document.getElementById("msPattern"),
    activeChips: document.getElementById("activeChips"),

    kpiInitiatives: document.getElementById("kpiInitiatives"),
    kpiCompanies: document.getElementById("kpiCompanies"),
    kpiBN: document.getElementById("kpiBN"),
    kpiBG: document.getElementById("kpiBG"),
    kpiBS: document.getElementById("kpiBS"),

    chartCollab: document.getElementById("chartCollab"),
    chartESG: document.getElementById("chartESG"),
    chartMechanisms: document.getElementById("chartMechanisms"),
    chartPartners: document.getElementById("chartPartners"),

    top10Table: document.getElementById("top10Table"),
    patternCards: document.getElementById("patternCards"),
    initiativeTable: document.getElementById("initiativeTable"),
    pageInfo: document.getElementById("pageInfo"),

    dTitle: document.getElementById("dTitle"),
    dCompany: document.getElementById("dCompany"),
    dTags: document.getElementById("dTags"),
    dThemePattern: document.getElementById("dThemePattern"),
    dKPI: document.getElementById("dKPI"),
    dActors: document.getElementById("dActors"),
    dEvidenceMeta: document.getElementById("dEvidenceMeta"),
    dQuote: document.getElementById("dQuote"),
    dExcerpt: document.getElementById("dExcerpt"),
    dDescription: document.getElementById("dDescription"),
    dOutcome: document.getElementById("dOutcome"),

    methodText: document.getElementById("methodText"),
    filesLoadedList: document.getElementById("filesLoadedList"),

    tabButtons: Array.from(document.querySelectorAll(".tab-btn")),
    tabPanels: {
      overview: document.getElementById("tab-overview"),
      patterns: document.getElementById("tab-patterns"),
      evidence: document.getElementById("tab-evidence"),
      method: document.getElementById("tab-method")
    }
  };

  // =========================
  // HELPERS
  // =========================
  const t = (key) => I18N[state.lang][key] || key;

  const norm = (v) => (v ?? "").toString().trim();
  const lower = (v) => norm(v).toLowerCase();
  const upper = (v) => norm(v).toUpperCase();

  function pick(row, keys) {
    for (const k of keys) {
      if (Object.prototype.hasOwnProperty.call(row, k)) return row[k];
    }
    return "";
  }

  function safeInt(v) {
    const n = parseInt(String(v).replace(/[^\d-]/g, ""), 10);
    return Number.isFinite(n) ? n : null;
  }

  function uniq(arr) {
    return [...new Set(arr)];
  }

  function alphaSort(arr) {
    return [...arr].sort((a, b) => a.localeCompare(b));
  }

  function yesNoNormalize(v) {
    const s = lower(v);
    if (!s || s === "not stated" || s === "na" || s === "n/a") return "NOT STATED";
    if (["yes", "y", "true", "1"].includes(s)) return "YES";
    if (["no", "n", "false", "0"].includes(s)) return "NO";
    if (s.includes("yes")) return "YES";
    if (s.includes("no")) return "NO";
    return "NOT STATED";
  }

  function collabNormalize(v) {
    const s = upper(v);
    if (["BG", "BN", "BS", "BB"].includes(s)) return s;
    return s || "NOT STATED";
  }

  function esgNormalize(v) {
    const s = upper(v);
    if (["E", "S", "G", "X"].includes(s)) return s;
    return s || "NOT STATED";
  }

  function shortText(v, n = 100) {
    const s = norm(v);
    if (s.length <= n) return s;
    return s.slice(0, n - 1) + "…";
  }

  function csvDownload(filename, rows) {
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function loadCsv(path, optional = false) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) {
        if (optional) return null;
        throw new Error(`${res.status} ${path}`);
      }
      const text = await res.text();
      const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
      return (parsed.data || []).map((r) => {
        const clean = {};
        Object.keys(r).forEach((k) => (clean[norm(k)] = r[k]));
        return clean;
      });
    } catch (err) {
      if (optional) return null;
      throw err;
    }
  }

  function setStatus(message) {
    el.statusText.textContent = message;
  }

  function applyTheme() {
    if (state.theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      el.btnTheme.textContent = "☀";
    } else {
      document.documentElement.removeAttribute("data-theme");
      el.btnTheme.textContent = "☾";
    }
  }

  function collabLabel(c) {
    const map = {
      BG: t("collabDescBG"),
      BN: t("collabDescBN"),
      BS: t("collabDescBS"),
      BB: t("collabDescBB")
    };
    return map[c] || c;
  }

  // =========================
  // MULTI-SELECT COMPONENT
  // =========================
  const multiSelects = {};

  function createMultiSelect(container, key) {
    container.innerHTML = "";

    const trigger = document.createElement("button");
    trigger.className = "ms-trigger";
    trigger.type = "button";
    trigger.innerHTML = `<span>${t("msAny")}</span><span class="count">0</span>`;

    const panel = document.createElement("div");
    panel.className = "ms-panel";

    const search = document.createElement("input");
    search.className = "ms-search";
    search.type = "text";
    search.placeholder = t("msSearchPlaceholder");

    const actions = document.createElement("div");
    actions.className = "ms-actions";

    const btnAll = document.createElement("button");
    btnAll.className = "btn btn-outline small";
    btnAll.type = "button";
    btnAll.textContent = t("msSelectAll");

    const btnClear = document.createElement("button");
    btnClear.className = "btn btn-outline small";
    btnClear.type = "button";
    btnClear.textContent = t("msClear");

    actions.append(btnAll, btnClear);

    const list = document.createElement("div");
    list.className = "ms-list";

    panel.append(search, actions, list);
    container.append(trigger, panel);

    multiSelects[key] = { container, trigger, panel, search, btnAll, btnClear, list, key, options: [] };

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAllMultiSelects(key);
      panel.classList.toggle("open");
    });

    search.addEventListener("input", () => {
      const q = lower(search.value);
      Array.from(list.children).forEach((node) => {
        const txt = lower(node.dataset.value || "");
        node.style.display = txt.includes(q) ? "" : "none";
      });
    });

    btnAll.addEventListener("click", () => {
      state.filters[key] = new Set(multiSelects[key].options);
      updateMultiSelectUI(key);
      applyFiltersAndRender();
    });

    btnClear.addEventListener("click", () => {
      state.filters[key] = new Set();
      updateMultiSelectUI(key);
      applyFiltersAndRender();
    });
  }

  function closeAllMultiSelects(exceptKey = null) {
    Object.entries(multiSelects).forEach(([k, ms]) => {
      if (k !== exceptKey) ms.panel.classList.remove("open");
    });
  }

  document.addEventListener("click", () => closeAllMultiSelects());

  function populateMultiSelect(key, values) {
    const ms = multiSelects[key];
    ms.options = values;

    ms.list.innerHTML = "";
    values.forEach((value) => {
      const row = document.createElement("label");
      row.className = "ms-item";
      row.dataset.value = value;

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = state.filters[key].has(value);

      const txt = document.createElement("span");
      txt.textContent = value;

      cb.addEventListener("change", () => {
        if (cb.checked) state.filters[key].add(value);
        else state.filters[key].delete(value);
        updateMultiSelectUI(key);
        applyFiltersAndRender();
      });

      row.append(cb, txt);
      ms.list.appendChild(row);
    });

    updateMultiSelectUI(key);
  }

  function updateMultiSelectUI(key) {
    const ms = multiSelects[key];
    const selectedCount = state.filters[key].size;

    const label =
      selectedCount === 0
        ? t("msAny")
        : selectedCount === 1
        ? Array.from(state.filters[key])[0]
        : `${selectedCount} selected`;

    ms.trigger.children[0].textContent = label;
    ms.trigger.children[1].textContent = selectedCount;

    Array.from(ms.list.querySelectorAll("input[type=checkbox]")).forEach((cb) => {
      const value = cb.parentElement.dataset.value;
      cb.checked = state.filters[key].has(value);
    });
  }

  // =========================
  // LOAD + PREP
  // =========================
  async function loadAll() {
    setStatus("Loading CSV files…");

    const [
      subsetInitiatives,
      fullInitiativesOpt,
      companyMaster,
      mechanismCounts,
      partnerCounts,
      clusterAssignments,
      clusterSummary,
      top10
    ] = await Promise.all([
      loadCsv(PATHS.subsetInitiatives),
      loadCsv(PATHS.fullInitiatives, true),
      loadCsv(PATHS.companyMaster),
      loadCsv(PATHS.mechanismCounts, true),
      loadCsv(PATHS.partnerCounts, true),
      loadCsv(PATHS.clusterAssignments, true),
      loadCsv(PATHS.clusterSummary, true),
      loadCsv(PATHS.top10, true)
    ]);

    state.raw.subsetInitiatives = subsetInitiatives || [];
    state.raw.fullInitiatives = fullInitiativesOpt || [];
    state.raw.companyMaster = companyMaster || [];
    state.raw.mechanismCounts = mechanismCounts || [];
    state.raw.partnerCounts = partnerCounts || [];
    state.raw.clusterAssignments = clusterAssignments || [];
    state.raw.clusterSummary = clusterSummary || [];
    state.raw.top10 = top10 || [];

    state.fullAvailable = state.raw.fullInitiatives.length > 0;

    buildMaps();
    refreshScopeRows(); // sets currentRows + filteredRows
    buildFilterOptions();
    setStatus(`${t("loadedStatus")}: ${state.currentRows.length} rows (${state.scope})`);
  }

  function buildMaps() {
    state.maps.companyByReportId.clear();
    state.maps.clusterByInitiativeId.clear();
    state.maps.clusterSummaryById.clear();

    state.raw.companyMaster.forEach((r) => {
      const reportId = norm(pick(r, ["report_id"]));
      if (!reportId) return;
      state.maps.companyByReportId.set(reportId, {
        file_name: norm(pick(r, ["file_name"])),
        company_name_clean: norm(pick(r, ["company_name_clean"])),
        industry_sector: norm(pick(r, ["industry_sector"])),
        ownership_type: norm(pick(r, ["ownership_type"])),
        year_of_report: norm(pick(r, ["year_of_report"])),
        reporting_standard_mentions: norm(pick(r, ["reporting_standard_mentions"]))
      });
    });

    state.raw.clusterAssignments.forEach((r) => {
      const initiativeId = norm(pick(r, ["initiative_id"]));
      const clusterId = norm(pick(r, ["cluster_id"]));
      if (initiativeId) state.maps.clusterByInitiativeId.set(initiativeId, clusterId);
    });

    state.raw.clusterSummary.forEach((r) => {
      const cid = norm(pick(r, ["cluster_id"]));
      if (!cid) return;
      state.maps.clusterSummaryById.set(cid, {
        cluster_id: cid,
        n: safeInt(pick(r, ["n"])) || 0,
        pattern_label: norm(pick(r, ["pattern_label"])),
        top_theme: norm(pick(r, ["top_theme"])),
        dominant_collab_type: norm(pick(r, ["dominant_collab_type"])),
        dominant_esg_block: norm(pick(r, ["dominant_esg_block"])),
        dominant_partner_type: norm(pick(r, ["dominant_partner_type"])),
        top_mechanisms: norm(pick(r, ["top_mechanisms"])),
        example_initiatives_with_evidence: norm(pick(r, ["example_initiatives_with_evidence"]))
      });
    });
  }

  function enrichRows(rows) {
    return rows.map((r, idx) => {
      const reportId = norm(pick(r, ["report_id"]));
      const master = state.maps.companyByReportId.get(reportId) || {};
      const initiative_id = norm(pick(r, ["initiative_id"])) || `ROW_${idx + 1}`;

      const clusterId = norm(state.maps.clusterByInitiativeId.get(initiative_id));
      const cluster = state.maps.clusterSummaryById.get(clusterId) || {};

      const companyName =
        norm(pick(r, ["company_name_fixed", "company_canonical", "company"])) ||
        norm(master.company_name_clean) ||
        t("notStated");

      const row = {
        initiative_id,
        report_id: reportId,
        company_name: companyName,
        industry_sector: norm(pick(r, ["industry_sector"])) || norm(master.industry_sector) || t("notStated"),
        ownership_type: norm(pick(r, ["ownership_type"])) || norm(master.ownership_type) || t("notStated"),
        year_of_report: norm(pick(r, ["year_of_report"])) || norm(master.year_of_report) || t("notStated"),

        collab_type_short: collabNormalize(pick(r, ["collab_type_short"])),
        ESG_block_norm: esgNormalize(pick(r, ["ESG_block_norm", "ESG_block"])),
        theme_tag: norm(pick(r, ["theme_tag"])) || t("notStated"),

        initiative_title: norm(pick(r, ["initiative_title"])) || t("notStated"),
        initiative_description: norm(pick(r, ["initiative_description"])) || "",
        outputs_or_outcomes: norm(pick(r, ["outputs_or_outcomes"])) || "",

        KPI_present: yesNoNormalize(pick(r, ["KPI_present"])),
        KPI_list: norm(pick(r, ["KPI_list"])) || "",
        geography: norm(pick(r, ["geography"])) || "",

        actors_involved: norm(pick(r, ["actors_involved", "actor_name"])) || "",
        evidence_file_name: norm(pick(r, ["evidence_file_name"])) || norm(master.file_name) || t("notStated"),
        page_primary: safeInt(pick(r, ["page_primary"])) || "",
        evidence_page_numbers: norm(pick(r, ["evidence_page_numbers"])) || "",
        evidence_quote_15w: norm(pick(r, ["evidence_quote_15w"])) || "",
        evidence_excerpt: norm(pick(r, ["evidence_excerpt"])) || "",
        confidence: norm(pick(r, ["confidence"])) || "",
        qa_reasons: norm(pick(r, ["qa_reasons"])) || "",

        cluster_id: clusterId || "",
        pattern_label: cluster.pattern_label || t("notStated"),
        cluster_top_theme: cluster.top_theme || "",
        cluster_top_mechanisms: cluster.top_mechanisms || "",

        _search: [
          companyName,
          pick(r, ["company_canonical", "company_name_fixed"]),
          pick(r, ["initiative_title"]),
          pick(r, ["initiative_description"]),
          pick(r, ["outputs_or_outcomes"]),
          pick(r, ["actors_involved"]),
          pick(r, ["evidence_quote_15w"]),
          pick(r, ["evidence_excerpt"]),
          cluster.pattern_label || ""
        ].join(" | ").toLowerCase()
      };

      return row;
    });
  }

  function refreshScopeRows() {
    const sourceRows =
      state.scope === "full" && state.fullAvailable
        ? state.raw.fullInitiatives
        : state.raw.subsetInitiatives;

    state.currentRows = enrichRows(sourceRows);
    state.filteredRows = [...state.currentRows];
    state.ui.page = 1;
    state.ui.selectedInitiativeId = null;

    // Reset pattern filter values if scope changed and old values no longer exist
    // (keep selections, but they'll naturally yield zero rows if not present)
  }

  // =========================
  // FILTERS
  // =========================
  function buildFilterOptions() {
    const rows = state.currentRows;

    const collabVals = alphaSort(uniq(rows.map(r => r.collab_type_short).filter(Boolean)));
    const esgVals = alphaSort(uniq(rows.map(r => r.ESG_block_norm).filter(Boolean)));
    const sectorVals = alphaSort(uniq(rows.map(r => r.industry_sector).filter(Boolean)));
    const themeVals = alphaSort(uniq(rows.map(r => r.theme_tag).filter(Boolean)));
    const patternVals = alphaSort(uniq(rows.map(r => r.pattern_label).filter(Boolean)));

    populateMultiSelect("collab", collabVals);
    populateMultiSelect("esg", esgVals);
    populateMultiSelect("sector", sectorVals);
    populateMultiSelect("theme", themeVals);
    populateMultiSelect("pattern", patternVals);
  }

  function applyFilters() {
    state.filters.search = lower(el.fSearch.value);
    state.filters.kpi = upper(el.fKPI.value || "ALL");

    const rows = state.currentRows.filter((r) => {
      if (state.filters.collab.size && !state.filters.collab.has(r.collab_type_short)) return false;
      if (state.filters.esg.size && !state.filters.esg.has(r.ESG_block_norm)) return false;
      if (state.filters.sector.size && !state.filters.sector.has(r.industry_sector)) return false;
      if (state.filters.theme.size && !state.filters.theme.has(r.theme_tag)) return false;
      if (state.filters.pattern.size && !state.filters.pattern.has(r.pattern_label)) return false;

      if (state.filters.kpi !== "ALL" && r.KPI_present !== state.filters.kpi) return false;

      if (state.filters.search && !r._search.includes(state.filters.search)) return false;

      return true;
    });

    state.filteredRows = rows;
    state.ui.page = 1;

    // Keep selected item if still in filtered set
    if (state.ui.selectedInitiativeId && !rows.some(r => r.initiative_id === state.ui.selectedInitiativeId)) {
      state.ui.selectedInitiativeId = null;
    }
  }

  function clearFilters() {
    state.filters = {
      search: "",
      kpi: "ALL",
      collab: new Set(),
      esg: new Set(),
      sector: new Set(),
      theme: new Set(),
      pattern: new Set()
    };

    el.fSearch.value = "";
    el.fKPI.value = "ALL";

    ["collab", "esg", "sector", "theme", "pattern"].forEach((k) => updateMultiSelectUI(k));

    applyFiltersAndRender();
  }

  function renderActiveChips() {
    const chips = [];

    const addSetChips = (set, prefix) => {
      Array.from(set).forEach(v => chips.push(`${prefix}: ${v}`));
    };

    if (state.filters.search) chips.push(`${t("searchLabel")}: ${state.filters.search}`);
    if (state.filters.kpi !== "ALL") chips.push(`KPI: ${state.filters.kpi}`);

    addSetChips(state.filters.collab, "Collab");
    addSetChips(state.filters.esg, "ESG");
    addSetChips(state.filters.sector, "Sector");
    addSetChips(state.filters.theme, "Theme");
    addSetChips(state.filters.pattern, "Pattern");

    el.activeChips.innerHTML = "";
    chips.forEach(c => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = c;
      el.activeChips.appendChild(chip);
    });
  }

  // =========================
  // METRICS + CHARTS
  // =========================
  function countBy(rows, field) {
    const m = new Map();
    rows.forEach(r => {
      const k = norm(r[field]) || t("notStated");
      m.set(k, (m.get(k) || 0) + 1);
    });
    return m;
  }

  function splitActors(raw) {
    const s = norm(raw);
    if (!s || lower(s) === "not stated") return [];
    let parts = s.split(/\s*[;|\n]\s*/).map(norm).filter(Boolean);
    if (parts.length <= 1 && s.includes(",")) {
      parts = s.split(/\s*,\s*/).map(norm).filter(Boolean);
    }
    return uniq(parts);
  }

  function classifyPartnerType(actor) {
    const a = lower(actor);
    if (/(government|ministry|municipal|provincial|province|district|county|bureau|commission|regulator|sasac|administration|authorit(y|ies)|people'?s government|state council)/.test(a)) return "government";
    if (/(foundation|charity|public welfare|ngo|nonprofit|non-profit|association|society|federation|united nations|un global compact|ungc|unep|undp|unicef|wwf|one foundation|forum)/.test(a)) return "ngo_public";
    if (/(university|college|school|academy|hospital|clinic|medical|institute|lab|laboratory|research center|research centre)/.test(a)) return "academia_health";
    if (/(company|co\.|corp|corporation|group|ltd|limited|holdings|bank|supplier|enterprise|technology|tech|telecom)/.test(a)) return "business";
    return "other";
  }

  const mechanismRules = [
    ["donation_philanthropy", /\b(donation|donate|charity|charitable|philanthropy|fundraising|public welfare|foundation)\b/i],
    ["joint_research_innovation", /\b(joint research|co-?research|innovation|r&d|research and development|pilot project|laboratory|lab)\b/i],
    ["training_education", /\b(training|education|academy|capacity building|scholarship|internship|talent|workshop|course)\b/i],
    ["emissions_carbon", /\b(emission|carbon|ghg|greenhouse gas|decarbon|net zero|carbon neutral)\b/i],
    ["renewable_energy", /\b(renewable|solar|photovoltaic|pv|wind power|clean energy|energy storage)\b/i],
    ["water", /\b(water|wastewater|water stewardship|water resiliency|water resilience)\b/i],
    ["biodiversity_wildlife", /\b(biodiversity|wildlife|ecosystem|habitat|ecological)\b/i],
    ["health_medical", /\b(health|medical|hospital|clinic|healthcare|rehabilitation)\b/i],
    ["rural_revitalization", /\b(rural revitalization|rural|village|farmer|agricultural)\b/i],
    ["cybersecurity_awareness", /\b(cybersecurity|cyber security|security awareness|information security|privacy)\b/i]
  ];

  function computeMechanismCounts(rows) {
    const counts = new Map(mechanismRules.map(([k]) => [k, 0]));

    rows.forEach(r => {
      const text = [
        r.initiative_title,
        r.initiative_description,
        r.outputs_or_outcomes,
        r.evidence_excerpt,
        r.evidence_quote_15w,
        r.theme_tag
      ].join(" ").toLowerCase();

      mechanismRules.forEach(([k, re]) => {
        if (re.test(text)) counts.set(k, (counts.get(k) || 0) + 1);
      });
    });

    return [...counts.entries()]
      .map(([mechanism, initiative_count]) => ({ mechanism, initiative_count }))
      .filter(d => d.initiative_count > 0)
      .sort((a, b) => b.initiative_count - a.initiative_count);
  }

  function computePartnerEdges(rows) {
    const map = new Map();
    rows.forEach(r => {
      const collab = r.collab_type_short || "NOT STATED";
      splitActors(r.actors_involved).forEach(actor => {
        const p = classifyPartnerType(actor);
        const key = `${collab}||${p}`;
        map.set(key, (map.get(key) || 0) + 1);
      });
    });

    return [...map.entries()].map(([k, count]) => {
      const [collab_type_short, partner_type] = k.split("||");
      return { collab_type_short, partner_type, count };
    });
  }

  function plot(elId, traces, layout = {}) {
    const dark = state.theme === "dark";
    Plotly.react(
      elId,
      traces,
      {
        margin: { t: 14, r: 12, b: 40, l: 40 },
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
        font: {
          family: "Inter, system-ui, sans-serif",
          color: dark ? "#e5e7eb" : "#334155",
          size: 12
        },
        xaxis: { gridcolor: dark ? "rgba(148,163,184,.15)" : "rgba(100,116,139,.15)", automargin: true },
        yaxis: { gridcolor: dark ? "rgba(148,163,184,.15)" : "rgba(100,116,139,.15)", automargin: true },
        legend: { orientation: "h", y: 1.14, x: 0 },
        ...layout
      },
      { responsive: true, displayModeBar: false }
    );
  }

  function renderCharts() {
    const rows = state.filteredRows;

    // Collaboration chart
    const collabOrder = ["BN", "BG", "BS", "BB", "NOT STATED"];
    const collabCounts = countBy(rows, "collab_type_short");
    const cLabels = collabOrder.filter(k => collabCounts.has(k));
    const cValues = cLabels.map(k => collabCounts.get(k) || 0);

    plot(el.chartCollab, [{
      type: "bar",
      x: cLabels,
      y: cValues,
      hovertemplate: "%{x}: %{y}<extra></extra>"
    }]);

    // ESG chart
    const esgOrder = ["E", "S", "G", "X", "NOT STATED"];
    const esgCounts = countBy(rows, "ESG_block_norm");
    const eLabels = esgOrder.filter(k => esgCounts.has(k));
    const eValues = eLabels.map(k => esgCounts.get(k) || 0);

    plot(el.chartESG, [{
      type: "bar",
      x: eLabels,
      y: eValues,
      hovertemplate: "%{x}: %{y}<extra></extra>"
    }]);

    // Mechanism chart
    const mechs = computeMechanismCounts(rows).slice(0, 12);
    plot(el.chartMechanisms, [{
      type: "bar",
      x: mechs.map(d => d.initiative_count),
      y: mechs.map(d => d.mechanism),
      orientation: "h",
      hovertemplate: "%{y}: %{x}<extra></extra>"
    }], { margin: { t: 14, r: 12, b: 32, l: 165 } });

    // Partner chart (stacked)
    const partnerRows = computePartnerEdges(rows);
    const pOrder = ["government", "ngo_public", "academia_health", "business", "other"];
    const traces = pOrder.map(p => ({
      type: "bar",
      name: p,
      x: ["BG", "BN", "BS", "BB"],
      y: ["BG", "BN", "BS", "BB"].map(c => {
        const hit = partnerRows.find(r => r.collab_type_short === c && r.partner_type === p);
        return hit ? hit.count : 0;
      }),
      hovertemplate: `${p}<br>%{x}: %{y}<extra></extra>`
    }));

    plot(el.chartPartners, traces, { barmode: "stack" });
  }

  // =========================
  // TABLES + DETAIL
  // =========================
  function renderTop10Table() {
    const source = state.raw.top10.length
      ? state.raw.top10.map(r => ({
          cluster_id: norm(pick(r, ["cluster_id"])),
          n: safeInt(pick(r, ["n"])) || 0,
          pattern_label: norm(pick(r, ["pattern_label"])),
          top_theme: norm(pick(r, ["top_theme"])),
          dominant_collab_type: norm(pick(r, ["dominant_collab_type"])),
          dominant_esg_block: norm(pick(r, ["dominant_esg_block"])),
          dominant_partner_type: norm(pick(r, ["dominant_partner_type"])),
          top_mechanisms: norm(pick(r, ["top_mechanisms"])),
          example_initiatives_with_evidence: norm(pick(r, ["example_initiatives_with_evidence"]))
        }))
      : [...state.maps.clusterSummaryById.values()]
          .sort((a, b) => b.n - a.n)
          .slice(0, 10);

    el.top10Table.innerHTML = `
      <thead>
        <tr>
          <th>Cluster</th>
          <th>n</th>
          <th>Pattern</th>
          <th>Top theme</th>
          <th>Collab</th>
          <th>ESG</th>
          <th>Partner</th>
          <th>Top mechanisms</th>
          <th>Example</th>
        </tr>
      </thead>
      <tbody>
        ${
          source.map(r => `
            <tr>
              <td class="mono">${escapeHtml(r.cluster_id)}</td>
              <td>${r.n}</td>
              <td>${escapeHtml(r.pattern_label)}</td>
              <td>${escapeHtml(r.top_theme)}</td>
              <td>${escapeHtml(r.dominant_collab_type)}</td>
              <td>${escapeHtml(r.dominant_esg_block)}</td>
              <td>${escapeHtml(r.dominant_partner_type)}</td>
              <td class="wrap">${escapeHtml(shortText(r.top_mechanisms, 90))}</td>
              <td class="wrap">${escapeHtml(shortText(r.example_initiatives_with_evidence, 90))}</td>
            </tr>
          `).join("")
        }
      </tbody>
    `;

    // Pattern cards
    el.patternCards.innerHTML = source.slice(0, 10).map(r => `
      <div class="pattern-card">
        <div class="pc-top">
          <div class="pc-id">#${escapeHtml(String(r.cluster_id))}</div>
          <div class="pc-n">n = ${r.n}</div>
        </div>
        <div class="pc-title">${escapeHtml(r.pattern_label || "—")}</div>
        <div class="pc-line"><strong>Theme:</strong> ${escapeHtml(r.top_theme || "—")}</div>
        <div class="pc-line"><strong>Type:</strong> ${escapeHtml(r.dominant_collab_type || "—")} / ${escapeHtml(r.dominant_esg_block || "—")}</div>
        <div class="pc-line"><strong>Partner:</strong> ${escapeHtml(r.dominant_partner_type || "—")}</div>
        <div class="pc-line"><strong>Mechanisms:</strong> ${escapeHtml(shortText(r.top_mechanisms || "—", 80))}</div>
        <div class="pc-example">${escapeHtml(shortText(r.example_initiatives_with_evidence || "—", 110))}</div>
      </div>
    `).join("");
  }

  function escapeHtml(v) {
    return norm(v)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function renderInitiativeTable() {
    const rows = state.filteredRows;
    const pageSize = state.ui.pageSize;
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

    if (state.ui.page > totalPages) state.ui.page = totalPages;
    const start = (state.ui.page - 1) * pageSize;
    const pageRows = rows.slice(start, start + pageSize);

    el.pageInfo.textContent = `${state.ui.page} / ${totalPages}`;

    el.initiativeTable.innerHTML = `
      <thead>
        <tr>
          <th>Company</th>
          <th>Collab</th>
          <th>ESG</th>
          <th>Theme</th>
          <th>Pattern</th>
          <th>Title</th>
          <th>Page</th>
        </tr>
      </thead>
      <tbody>
        ${
          pageRows.length
            ? pageRows.map(r => `
                <tr data-id="${escapeHtml(r.initiative_id)}" class="${state.ui.selectedInitiativeId === r.initiative_id ? "active" : ""}">
                  <td>${escapeHtml(r.company_name)}</td>
                  <td>${escapeHtml(r.collab_type_short)}</td>
                  <td>${escapeHtml(r.ESG_block_norm)}</td>
                  <td class="wrap">${escapeHtml(shortText(r.theme_tag, 40))}</td>
                  <td class="wrap">${escapeHtml(shortText(r.pattern_label, 40))}</td>
                  <td class="wrap">${escapeHtml(shortText(r.initiative_title, 100))}</td>
                  <td>${r.page_primary || ""}</td>
                </tr>
              `).join("")
            : `<tr><td colspan="7">${t("noData")}</td></tr>`
        }
      </tbody>
    `;

    Array.from(el.initiativeTable.querySelectorAll("tbody tr[data-id]")).forEach((tr) => {
      tr.addEventListener("click", () => {
        state.ui.selectedInitiativeId = tr.dataset.id;
        const row = state.filteredRows.find(x => x.initiative_id === state.ui.selectedInitiativeId);
        renderDetail(row);
        renderInitiativeTable();
      });
    });

    if (!state.ui.selectedInitiativeId && pageRows[0]) {
      state.ui.selectedInitiativeId = pageRows[0].initiative_id;
      renderDetail(pageRows[0]);
      renderInitiativeTable();
    } else if (!pageRows.length) {
      renderDetail(null);
    }
  }

  function renderDetail(r) {
    if (!r) {
      [
        el.dTitle, el.dCompany, el.dTags, el.dThemePattern, el.dKPI, el.dActors,
        el.dEvidenceMeta, el.dQuote, el.dExcerpt, el.dDescription, el.dOutcome
      ].forEach(node => node.textContent = "—");
      return;
    }

    el.dTitle.textContent = r.initiative_title || "—";
    el.dCompany.textContent = `${r.company_name} | ${r.industry_sector}`;
    el.dTags.textContent = `${r.collab_type_short} (${collabLabel(r.collab_type_short)}) | ${r.ESG_block_norm}`;
    el.dThemePattern.textContent = `${r.theme_tag} | ${r.pattern_label}`;
    el.dKPI.textContent = r.KPI_present === "YES"
      ? `YES${r.KPI_list ? ` — ${r.KPI_list}` : ""}`
      : (r.KPI_present || "—");
    el.dActors.textContent = r.actors_involved || "—";

    const pageText = r.page_primary ? `p. ${r.page_primary}` : "page not stated";
    const pagesExtra = r.evidence_page_numbers && String(r.evidence_page_numbers) !== String(r.page_primary)
      ? ` (pages: ${r.evidence_page_numbers})`
      : "";
    el.dEvidenceMeta.textContent = `${r.evidence_file_name || "—"} | ${pageText}${pagesExtra}`;

    el.dQuote.textContent = r.evidence_quote_15w || "—";
    el.dExcerpt.textContent = r.evidence_excerpt || "—";
    el.dDescription.textContent = r.initiative_description || "—";
    el.dOutcome.textContent = r.outputs_or_outcomes || "—";
  }

  // =========================
  // RENDER KPIs + HEADER
  // =========================
  function renderKPIsAndHeader() {
    const rows = state.filteredRows;
    const companyCount = uniq(rows.map(r => r.report_id || r.company_name).filter(Boolean)).length;
    const collabMap = countBy(rows, "collab_type_short");

    el.kpiInitiatives.textContent = rows.length.toLocaleString();
    el.kpiCompanies.textContent = companyCount.toLocaleString();
    el.kpiBN.textContent = (collabMap.get("BN") || 0).toLocaleString();
    el.kpiBG.textContent = (collabMap.get("BG") || 0).toLocaleString();
    el.kpiBS.textContent = (collabMap.get("BS") || 0).toLocaleString();

    el.pillRows.textContent = `${t("rows")}: ${rows.length}`;
    el.pillCompanies.textContent = `${t("companies")}: ${companyCount}`;

    if (state.scope === "subset") {
      el.scopeNote.textContent = t("scopeNoteSubset");
    } else {
      el.scopeNote.textContent = state.fullAvailable ? t("scopeNoteFull") : t("scopeNoteFullMissing");
    }

    el.scopeSubset.classList.toggle("active", state.scope === "subset");
    el.scopeFull.classList.toggle("active", state.scope === "full");

    if (!state.fullAvailable) {
      el.scopeFull.classList.add("disabled");
      el.scopeFull.disabled = true;
    } else {
      el.scopeFull.disabled = false;
    }
  }

  // =========================
  // METHOD TAB + FILES
  // =========================
  function renderMethodTab() {
    el.methodText.innerHTML = `
      <p>${escapeHtml(t("methodIntro"))}</p>
      <div><strong>${escapeHtml(t("methodStepsTitle"))}</strong></div>
      <ol>
        <li>${escapeHtml(t("methodStep1"))}</li>
        <li>${escapeHtml(t("methodStep2"))}</li>
        <li>${escapeHtml(t("methodStep3"))}</li>
        <li>${escapeHtml(t("methodStep4"))}</li>
        <li>${escapeHtml(t("methodStep5"))}</li>
        <li>${escapeHtml(t("methodStep6"))}</li>
      </ol>
    `;

    const fileItems = [
      ["company_master_clean.csv", state.raw.companyMaster.length],
      ["initiatives.csv", state.raw.subsetInitiatives.length],
      ["initiatives_full_501.csv (optional)", state.raw.fullInitiatives.length],
      ["patterns_topic_cluster_assignments.csv", state.raw.clusterAssignments.length],
      ["patterns_topic_clusters_summary.csv", state.raw.clusterSummary.length],
      ["generic_patterns_brief_top10.csv", state.raw.top10.length],
      ["patterns_mechanism_counts.csv", state.raw.mechanismCounts.length],
      ["patterns_partner_types_from_initiatives.csv", state.raw.partnerCounts.length]
    ];

    el.filesLoadedList.innerHTML = fileItems
      .map(([name, n]) => `<li>${escapeHtml(name)} — ${n || 0} rows</li>`)
      .join("");
  }

  // =========================
  // I18N RENDER
  // =========================
  function applyI18nStatic() {
    document.documentElement.lang = state.lang;

    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const key = node.dataset.i18n;
      if (I18N[state.lang][key]) node.textContent = I18N[state.lang][key];
    });

    el.fSearch.placeholder = t("searchPlaceholder");
    el.btnLang.textContent = state.lang === "en" ? "RU" : "EN";
    el.topSubtitle.textContent = t("dashboardSubtitle");

    // Rebuild static options in KPI select (to keep labels clean)
    const current = el.fKPI.value;
    el.fKPI.innerHTML = `
      <option value="ALL">ALL</option>
      <option value="YES">YES</option>
      <option value="NO">NO</option>
      <option value="NOT STATED">${t("notStated")}</option>
    `;
    el.fKPI.value = current === "NOT STATED" ? "NOT STATED" : current;

    // Update multiselect labels/buttons
    Object.keys(multiSelects).forEach((key) => {
      const ms = multiSelects[key];
      if (!ms) return;
      ms.search.placeholder = t("msSearchPlaceholder");
      ms.btnAll.textContent = t("msSelectAll");
      ms.btnClear.textContent = t("msClear");
      updateMultiSelectUI(key);
    });

    renderKPIsAndHeader();
    renderMethodTab();
    renderActiveChips();
  }

  // =========================
  // TABS
  // =========================
  function setTab(tabName) {
    state.ui.activeTab = tabName;
    el.tabButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.tab === tabName));
    Object.entries(el.tabPanels).forEach(([k, panel]) => {
      panel.classList.toggle("active", k === tabName);
    });
  }

  // =========================
  // MAIN RENDER PIPELINE
  // =========================
  function applyFiltersAndRender() {
    applyFilters();
    renderActiveChips();
    renderKPIsAndHeader();
    renderCharts();
    renderTop10Table();
    renderInitiativeTable();
    renderMethodTab();

    setStatus(
      `${t("loadedStatus")}: ${state.filteredRows.length}/${state.currentRows.length} rows • ${state.scope === "subset" ? t("subsetLabel") : t("fullLabel")}`
    );
  }

  // =========================
  // EXPORTS
  // =========================
  function exportFiltered() {
    const rows = state.filteredRows.map(r => ({
      initiative_id: r.initiative_id,
      report_id: r.report_id,
      company_name: r.company_name,
      industry_sector: r.industry_sector,
      ownership_type: r.ownership_type,
      year_of_report: r.year_of_report,
      collab_type_short: r.collab_type_short,
      ESG_block_norm: r.ESG_block_norm,
      theme_tag: r.theme_tag,
      cluster_id: r.cluster_id,
      pattern_label: r.pattern_label,
      initiative_title: r.initiative_title,
      initiative_description: r.initiative_description,
      outputs_or_outcomes: r.outputs_or_outcomes,
      KPI_present: r.KPI_present,
      KPI_list: r.KPI_list,
      geography: r.geography,
      actors_involved: r.actors_involved,
      evidence_file_name: r.evidence_file_name,
      page_primary: r.page_primary,
      evidence_page_numbers: r.evidence_page_numbers,
      evidence_quote_15w: r.evidence_quote_15w,
      evidence_excerpt: r.evidence_excerpt,
      confidence: r.confidence,
      qa_reasons: r.qa_reasons
    }));
    csvDownload(`filtered_initiatives_${state.scope}.csv`, rows);
  }

  function exportTop10() {
    const rows = (state.raw.top10.length ? state.raw.top10 : [...state.maps.clusterSummaryById.values()])
      .map(r => ({
        cluster_id: norm(pick(r, ["cluster_id"])),
        n: safeInt(pick(r, ["n"])) || 0,
        pattern_label: norm(pick(r, ["pattern_label"])),
        top_theme: norm(pick(r, ["top_theme"])),
        dominant_collab_type: norm(pick(r, ["dominant_collab_type"])),
        dominant_esg_block: norm(pick(r, ["dominant_esg_block"])),
        dominant_partner_type: norm(pick(r, ["dominant_partner_type"])),
        top_mechanisms: norm(pick(r, ["top_mechanisms"])),
        example_initiatives_with_evidence: norm(pick(r, ["example_initiatives_with_evidence"]))
      }));
    csvDownload("top_patterns_dashboard.csv", rows);
  }

  // =========================
  // EVENTS
  // =========================
  function bindEvents() {
    // Theme
    el.btnTheme.addEventListener("click", () => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("dashTheme", state.theme);
      applyTheme();
      renderCharts();
    });

    // Language
    el.btnLang.addEventListener("click", () => {
      state.lang = state.lang === "en" ? "ru" : "en";
      localStorage.setItem("dashLang", state.lang);
      applyI18nStatic();
    });

    // Scope
    el.scopeSubset.addEventListener("click", () => {
      state.scope = "subset";
      refreshScopeRows();
      buildFilterOptions();
      applyFiltersAndRender();
    });

    el.scopeFull.addEventListener("click", () => {
      if (!state.fullAvailable) return;
      state.scope = "full";
      refreshScopeRows();
      buildFilterOptions();
      applyFiltersAndRender();
    });

    // Filters
    let searchTimer = null;
    el.fSearch.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(applyFiltersAndRender, 180);
    });

    el.fKPI.addEventListener("change", applyFiltersAndRender);

    el.btnReset.addEventListener("click", clearFilters);
    el.btnExport.addEventListener("click", exportFiltered);
    el.btnExportTop10.addEventListener("click", exportTop10);

    // Pagination
    el.btnPrevPage.addEventListener("click", () => {
      if (state.ui.page > 1) {
        state.ui.page -= 1;
        renderInitiativeTable();
      }
    });

    el.btnNextPage.addEventListener("click", () => {
      const totalPages = Math.max(1, Math.ceil(state.filteredRows.length / state.ui.pageSize));
      if (state.ui.page < totalPages) {
        state.ui.page += 1;
        renderInitiativeTable();
      }
    });

    // Tabs
    el.tabButtons.forEach(btn => {
      btn.addEventListener("click", () => setTab(btn.dataset.tab));
    });
  }

  // =========================
  // INIT
  // =========================
  async function init() {
    try {
      // Build multiselects before load
      createMultiSelect(el.msCollab, "collab");
      createMultiSelect(el.msESG, "esg");
      createMultiSelect(el.msSector, "sector");
      createMultiSelect(el.msTheme, "theme");
      createMultiSelect(el.msPattern, "pattern");

      applyTheme();
      bindEvents();
      applyI18nStatic();

      await loadAll();

      applyFiltersAndRender();
      setTab("overview");
    } catch (err) {
      console.error(err);
      setStatus(`${t("loadError")}: ${err.message}`);
    }
  }

  init();
})();
