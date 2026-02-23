(() => {
  const DATA = {
    companyMaster: [],
    initiativesSubset: [],
    initiativesFull: [],
    initiativesCurrent: [],
    clusterAssignments: [],
    clusterSummary: [],
    topPatterns: [],
    mechanismCountsPre: [],
    partnerCountsPre: [],
  };

  const MAPS = {
    companyByReportId: new Map(),
    clusterByInitiativeId: new Map(),
    clusterSummaryById: new Map(),
  };

  const UI = {
    filtered: [],
    page: 1,
    pageSize: 15,
    selectedId: null,
    activeTab: "overview",
    filters: {
      search: "",
      kpi: "ALL",
      collab: new Set(),
      esg: new Set(),
      sector: new Set(),
      theme: new Set(),
      pattern: new Set(),
    }
  };

  const EL = {
    statusText: document.getElementById("statusText"),
    datasetPill: document.getElementById("datasetPill"),
    rowsPill: document.getElementById("rowsPill"),

    kpiInitiatives: document.getElementById("kpiInitiatives"),
    kpiCompanies: document.getElementById("kpiCompanies"),
    kpiBG: document.getElementById("kpiBG"),
    kpiBN: document.getElementById("kpiBN"),
    kpiBS: document.getElementById("kpiBS"),
    kpiBB: document.getElementById("kpiBB"),

    datasetSelect: document.getElementById("datasetSelect"),
    searchInput: document.getElementById("searchInput"),
    kpiFilter: document.getElementById("kpiFilter"),
    collabChecklist: document.getElementById("collabChecklist"),
    esgChecklist: document.getElementById("esgChecklist"),
    sectorChecklist: document.getElementById("sectorChecklist"),
    themeChecklist: document.getElementById("themeChecklist"),
    patternChecklist: document.getElementById("patternChecklist"),
    resetFilters: document.getElementById("resetFilters"),
    downloadFiltered: document.getElementById("downloadFiltered"),
    downloadTopPatterns: document.getElementById("downloadTopPatterns"),

    topPatternsTableBody: document.querySelector("#topPatternsTable tbody"),
    clusterSummaryCards: document.getElementById("clusterSummaryCards"),

    initiativesTableBody: document.querySelector("#initiativesTable tbody"),
    prevPage: document.getElementById("prevPage"),
    nextPage: document.getElementById("nextPage"),
    pageInfo: document.getElementById("pageInfo"),

    dTitle: document.getElementById("dTitle"),
    dCompany: document.getElementById("dCompany"),
    dCollabEsg: document.getElementById("dCollabEsg"),
    dThemePattern: document.getElementById("dThemePattern"),
    dKpi: document.getElementById("dKpi"),
    dActors: document.getElementById("dActors"),
    dEvidenceMeta: document.getElementById("dEvidenceMeta"),
    dQuote: document.getElementById("dQuote"),
    dExcerpt: document.getElementById("dExcerpt"),
    dDesc: document.getElementById("dDesc"),
    dOutcomes: document.getElementById("dOutcomes"),

    themeToggle: document.getElementById("themeToggle")
  };

  // --------------------------
  // Helpers
  // --------------------------
  const S = (v) => (v ?? "").toString().trim();
  const L = (v) => S(v).toLowerCase();
  const U = (v) => S(v).toUpperCase();

  function setStatus(msg) { EL.statusText.textContent = msg; }

  function parseCSV(text) {
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    return (parsed.data || []).map(row => {
      const clean = {};
      Object.keys(row || {}).forEach(k => clean[S(k)] = row[k]);
      return clean;
    });
  }

  async function loadCSV(path, optional = false) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) {
        if (optional) return [];
        throw new Error(`${path} not found (${res.status})`);
      }
      const text = await res.text();
      return parseCSV(text);
    } catch (e) {
      if (optional) return [];
      throw e;
    }
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

  function unique(arr) { return [...new Set(arr.filter(Boolean))]; }
  function sortAlpha(arr) { return [...arr].sort((a,b) => a.localeCompare(b)); }

  function normalizeKPI(v) {
    const t = L(v);
    if (!t || t === "not stated" || t === "na" || t === "n/a") return "NOT STATED";
    if (["yes","y","true","1"].includes(t)) return "YES";
    if (["no","n","false","0"].includes(t)) return "NO";
    return t.includes("yes") ? "YES" : (t.includes("no") ? "NO" : "NOT STATED");
  }

  function short(v, n=120) {
    const t = S(v);
    return t.length > n ? t.slice(0, n-1) + "…" : t;
  }

  function firstInt(v) {
    const m = S(v).match(/\d+/);
    return m ? parseInt(m[0], 10) : "";
  }

  // --------------------------
  // Data loading + enrichment
  // --------------------------
  async function loadAll() {
    setStatus("Loading data files from /data ...");

    const [
      companyMaster,
      initiativesSubset,
      clusterAssignments,
      clusterSummary,
      topPatterns,
      mechanismCountsPre,
      partnerCountsPre,
      initiativesFull1,
      initiativesFull2
    ] = await Promise.all([
      loadCSV("./data/company_master_clean.csv"),
      loadCSV("./data/initiatives.csv"),
      loadCSV("./data/patterns_topic_cluster_assignments.csv", true),
      loadCSV("./data/patterns_topic_clusters_summary.csv", true),
      loadCSV("./data/generic_patterns_brief_top10.csv", true),
      loadCSV("./data/patterns_mechanism_counts.csv", true),
      loadCSV("./data/patterns_partner_types_from_initiatives.csv", true),
      loadCSV("./data/initiatives_full.csv", true), // optional future file name
      loadCSV("./data/initiatives_FULL_SHAREABLE_NO_NONSENSE_FINAL.csv", true) // optional future file
    ]);

    DATA.companyMaster = companyMaster;
    DATA.initiativesSubset = initiativesSubset;
    DATA.initiativesFull = initiativesFull1.length ? initiativesFull1 : initiativesFull2;
    DATA.clusterAssignments = clusterAssignments;
    DATA.clusterSummary = clusterSummary;
    DATA.topPatterns = topPatterns;
    DATA.mechanismCountsPre = mechanismCountsPre;
    DATA.partnerCountsPre = partnerCountsPre;

    buildMaps();
    setDataset("auto");
    setStatus("Data loaded successfully.");
  }

  function buildMaps() {
    MAPS.companyByReportId.clear();
    MAPS.clusterByInitiativeId.clear();
    MAPS.clusterSummaryById.clear();

    DATA.companyMaster.forEach(r => {
      const reportId = S(r.report_id);
      if (!reportId) return;
      MAPS.companyByReportId.set(reportId, {
        file_name: S(r.file_name),
        company_name_clean: S(r.company_name_clean),
        industry_sector: S(r.industry_sector),
        ownership_type: S(r.ownership_type),
        year_of_report: S(r.year_of_report),
        reporting_standard_mentions: S(r.reporting_standard_mentions),
      });
    });

    DATA.clusterAssignments.forEach(r => {
      const iid = S(r.initiative_id);
      const cid = S(r.cluster_id);
      if (iid) MAPS.clusterByInitiativeId.set(iid, cid);
    });

    DATA.clusterSummary.forEach(r => {
      const cid = S(r.cluster_id);
      if (!cid) return;
      MAPS.clusterSummaryById.set(cid, {
        cluster_id: cid,
        n: S(r.n),
        pattern_label: S(r.pattern_label),
        top_theme: S(r.top_theme),
        dominant_collab_type: S(r.dominant_collab_type),
        dominant_esg_block: S(r.dominant_esg_block),
        dominant_partner_type: S(r.dominant_partner_type),
        top_mechanisms: S(r.top_mechanisms),
        example_initiatives_with_evidence: S(r.example_initiatives_with_evidence),
      });
    });
  }

  function enrichInitiativeRow(r, idx) {
    const report_id = S(r.report_id);
    const master = MAPS.companyByReportId.get(report_id) || {};

    const initiative_id = S(r.initiative_id) || `ROW_${idx + 1}`;
    const cluster_id = MAPS.clusterByInitiativeId.get(initiative_id) || "";
    const cluster = MAPS.clusterSummaryById.get(cluster_id) || {};

    const row = {
      initiative_id,
      report_id,
      company_name: S(r.company_name_fixed) || S(r.company_canonical) || master.company_name_clean || "NOT STATED",
      industry_sector: S(r.industry_sector) || master.industry_sector || "NOT STATED",
      ownership_type: S(r.ownership_type) || master.ownership_type || "NOT STATED",
      year_of_report: S(r.year_of_report) || master.year_of_report || "NOT STATED",

      collab_type_short: U(r.collab_type_short) || "NOT STATED",
      ESG_block_norm: U(r.ESG_block_norm) || "NOT STATED",
      theme_tag: S(r.theme_tag) || "NOT STATED",

      initiative_title: S(r.initiative_title) || "NOT STATED",
      initiative_description: S(r.initiative_description),
      outputs_or_outcomes: S(r.outputs_or_outcomes),

      KPI_present: normalizeKPI(r.KPI_present),
      KPI_list: S(r.KPI_list) || "not stated",
      geography: S(r.geography) || "not stated",
      actors_involved: S(r.actors_involved) || "not stated",

      evidence_file_name: S(r.evidence_file_name) || master.file_name || "NOT STATED",
      page_primary: firstInt(r.page_primary),
      evidence_page_numbers: S(r.evidence_page_numbers),
      evidence_quote_15w: S(r.evidence_quote_15w),
      evidence_excerpt: S(r.evidence_excerpt),

      confidence: S(r.confidence),
      qa_reasons: S(r.qa_reasons),

      cluster_id,
      pattern_label: cluster.pattern_label || "NOT STATED",
      cluster_top_mechanisms: cluster.top_mechanisms || "",
      cluster_top_theme: cluster.top_theme || ""
    };

    row._search = [
      row.company_name, row.industry_sector, row.collab_type_short, row.ESG_block_norm,
      row.theme_tag, row.pattern_label, row.initiative_title, row.initiative_description,
      row.outputs_or_outcomes, row.actors_involved, row.evidence_file_name,
      row.evidence_quote_15w, row.evidence_excerpt
    ].join(" | ").toLowerCase();

    return row;
  }

  function setDataset(mode) {
    let raw = [];
    let label = "";

    if (mode === "full") {
      raw = DATA.initiativesFull.length ? DATA.initiativesFull : DATA.initiativesSubset;
      label = DATA.initiativesFull.length ? "Full initiatives file" : "Subset only (full file not found)";
    } else if (mode === "subset") {
      raw = DATA.initiativesSubset;
      label = "Subset (initiatives.csv)";
    } else {
      if (DATA.initiativesFull.length) {
        raw = DATA.initiativesFull;
        label = "Full initiatives file";
      } else {
        raw = DATA.initiativesSubset;
        label = "Subset (initiatives.csv)";
      }
    }

    DATA.initiativesCurrent = raw.map(enrichInitiativeRow);
    UI.page = 1;
    UI.selectedId = null;

    EL.datasetPill.textContent = `Dataset: ${label}`;
    rebuildAll();
  }

  // --------------------------
  // Checklist UI
  // --------------------------
  function renderChecklist(container, values, filterKey) {
    container.innerHTML = "";
    values.forEach(v => {
      const id = `${filterKey}_${CSS.escape(v).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
      const label = document.createElement("label");
      label.className = "check-item";

      const input = document.createElement("input");
      input.type = "checkbox";
      input.value = v;
      input.checked = UI.filters[filterKey].has(v);
      input.addEventListener("change", () => {
        if (input.checked) UI.filters[filterKey].add(v);
        else UI.filters[filterKey].delete(v);
        UI.page = 1;
        applyFiltersAndRender();
      });

      const text = document.createElement("span");
      text.textContent = v;

      label.appendChild(input);
      label.appendChild(text);
      container.appendChild(label);
    });
  }

  function fillAllChecklists() {
    const rows = DATA.initiativesCurrent;

    const collabValues = sortAlpha(unique(rows.map(r => r.collab_type_short)));
    const esgValues = sortAlpha(unique(rows.map(r => r.ESG_block_norm)));
    const sectorValues = sortAlpha(unique(rows.map(r => r.industry_sector)));
    const themeValues = sortAlpha(unique(rows.map(r => r.theme_tag)));
    const patternValues = sortAlpha(unique(rows.map(r => r.pattern_label)));

    // initialize default (all selected) only if empty
    if (UI.filters.collab.size === 0) collabValues.forEach(v => UI.filters.collab.add(v));
    if (UI.filters.esg.size === 0) esgValues.forEach(v => UI.filters.esg.add(v));
    if (UI.filters.sector.size === 0) sectorValues.forEach(v => UI.filters.sector.add(v));
    if (UI.filters.theme.size === 0) themeValues.forEach(v => UI.filters.theme.add(v));
    if (UI.filters.pattern.size === 0) patternValues.forEach(v => UI.filters.pattern.add(v));

    renderChecklist(EL.collabChecklist, collabValues, "collab");
    renderChecklist(EL.esgChecklist, esgValues, "esg");
    renderChecklist(EL.sectorChecklist, sectorValues, "sector");
    renderChecklist(EL.themeChecklist, themeValues, "theme");
    renderChecklist(EL.patternChecklist, patternValues, "pattern");
  }

  function resetFiltersToAll() {
    UI.filters.search = "";
    UI.filters.kpi = "ALL";
    EL.searchInput.value = "";
    EL.kpiFilter.value = "ALL";

    ["collab","esg","sector","theme","pattern"].forEach(key => UI.filters[key].clear());
    fillAllChecklists(); // refill and select all
    UI.page = 1;
    applyFiltersAndRender();
  }

  // --------------------------
  // Filter logic
  // --------------------------
  function applyFilters() {
    const q = L(UI.filters.search);
    UI.filtered = DATA.initiativesCurrent.filter(r => {
      if (!UI.filters.collab.has(r.collab_type_short)) return false;
      if (!UI.filters.esg.has(r.ESG_block_norm)) return false;
      if (!UI.filters.sector.has(r.industry_sector)) return false;
      if (!UI.filters.theme.has(r.theme_tag)) return false;
      if (!UI.filters.pattern.has(r.pattern_label)) return false;

      if (UI.filters.kpi !== "ALL" && r.KPI_present !== UI.filters.kpi) return false;
      if (q && !r._search.includes(q)) return false;

      return true;
    });
  }

  // --------------------------
  // Charts
  // --------------------------
  function countBy(rows, field) {
    const m = new Map();
    rows.forEach(r => {
      const k = S(r[field]) || "NOT STATED";
      m.set(k, (m.get(k) || 0) + 1);
    });
    return m;
  }

  function plotBar(divId, labels, values, horizontal = false) {
    Plotly.react(divId, [{
      type: "bar",
      x: horizontal ? values : labels,
      y: horizontal ? labels : values,
      orientation: horizontal ? "h" : "v",
      marker: { line: { width: 0 } },
      hovertemplate: horizontal ? "%{y}: %{x}<extra></extra>" : "%{x}: %{y}<extra></extra>"
    }], {
      margin: { l: horizontal ? 140 : 40, r: 12, t: 10, b: 40 },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      font: { family: "Inter, sans-serif", size: 12 },
      xaxis: { gridcolor: "rgba(148,163,184,0.2)" },
      yaxis: { gridcolor: "rgba(148,163,184,0.2)" }
    }, { responsive: true, displayModeBar: false });
  }

  function renderCollabChart() {
    const c = countBy(UI.filtered, "collab_type_short");
    const order = ["BN","BG","BS","BB","NOT STATED"];
    const labels = order.filter(k => c.has(k));
    plotBar("chartCollab", labels, labels.map(l => c.get(l) || 0));
  }

  function renderESGChart() {
    const c = countBy(UI.filtered, "ESG_block_norm");
    const order = ["E","S","G","X","NOT STATED"];
    const labels = order.filter(k => c.has(k));
    plotBar("chartESG", labels, labels.map(l => c.get(l) || 0));
  }

  const mechanismRules = [
    ["donation_philanthropy", /\b(donation|donate|charity|foundation|public welfare|fundraising)\b/i],
    ["joint_research_innovation", /\b(joint|co-?operation|collaborat|innovation|r&d|research|laboratory|pilot)\b/i],
    ["training_education", /\b(training|education|academy|workshop|talent|scholarship|internship)\b/i],
    ["emissions_carbon", /\b(carb|emission|ghg|greenhouse gas|decarbon|net zero)\b/i],
    ["renewable_energy", /\b(solar|photovoltaic|pv|wind|renewable|energy storage|clean energy)\b/i],
    ["water", /\b(water|wastewater|water stewardship|water resiliency)\b/i],
    ["biodiversity_wildlife", /\b(biodiversity|wildlife|ecosystem|habitat|species)\b/i],
    ["health_medical", /\b(health|medical|hospital|clinic|rehabilitation)\b/i],
    ["rural_revitalization", /\b(rural|village|farmer|agriculture|revitalization)\b/i],
    ["cybersecurity_awareness", /\b(cybersecurity|cyber security|privacy|security awareness)\b/i],
  ];

  function computeMechanismCountsFiltered() {
    const counts = new Map(mechanismRules.map(([k]) => [k, 0]));

    UI.filtered.forEach(r => {
      const text = [
        r.initiative_title, r.initiative_description, r.outputs_or_outcomes,
        r.evidence_excerpt, r.evidence_quote_15w, r.theme_tag
      ].join(" ").toLowerCase();

      mechanismRules.forEach(([name, rx]) => {
        if (rx.test(text)) counts.set(name, (counts.get(name) || 0) + 1);
      });
    });

    return [...counts.entries()]
      .map(([mechanism, count]) => ({ mechanism, count }))
      .filter(d => d.count > 0)
      .sort((a,b) => b.count - a.count);
  }

  function renderMechanismChart() {
    let data = computeMechanismCountsFiltered();

    // fallback to precomputed if no filtered rows
    if (!data.length && DATA.mechanismCountsPre.length) {
      data = DATA.mechanismCountsPre.map(r => ({
        mechanism: S(r.mechanism),
        count: Number(S(r.initiative_count)) || 0
      })).sort((a,b) => b.count - a.count);
    }

    const top = data.slice(0, 12);
    plotBar("chartMechanisms", top.map(d => d.mechanism), top.map(d => d.count), true);
  }

  function splitActors(raw) {
    const t = S(raw);
    if (!t || L(t) === "not stated") return [];
    let parts = t.split(/\s*[;\n|]\s*/).map(S).filter(Boolean);
    if (parts.length <= 1 && t.includes(",")) parts = t.split(/\s*,\s*/).map(S).filter(Boolean);
    return [...new Set(parts)];
  }

  function classifyPartnerType(actor) {
    const a = L(actor);
    if (/(government|ministry|bureau|commission|district|provincial|municipal|people'?s government|sasac|administration|authority)/.test(a)) return "government";
    if (/(foundation|charity|association|society|ngo|nonprofit|public welfare|united nations|un global compact|one foundation|federation)/.test(a)) return "ngo_public";
    if (/(university|college|school|academy|hospital|clinic|medical|institute|lab|laboratory)/.test(a)) return "academia_health";
    if (/(company|corp|corporation|ltd|limited|group|holdings|supplier|bank|technology|enterprise)/.test(a)) return "business";
    return "other";
  }

  function computePartnerEdgesFiltered() {
    const counts = new Map(); // key = collab|partner
    UI.filtered.forEach(r => {
      splitActors(r.actors_involved).forEach(actor => {
        const p = classifyPartnerType(actor);
        const key = `${r.collab_type_short}||${p}`;
        counts.set(key, (counts.get(key) || 0) + 1);
      });
    });

    const rows = [];
    counts.forEach((n, key) => {
      const [collab, partner] = key.split("||");
      rows.push({ collab, partner, n });
    });
    return rows;
  }

  function renderPartnerChart() {
    const rows = computePartnerEdgesFiltered();
    const collabs = ["BG","BN","BS","BB"];
    const partners = ["government","ngo_public","academia_health","business","other"];

    const traces = partners.map(p => ({
      type: "bar",
      name: p,
      x: collabs,
      y: collabs.map(c => (rows.find(r => r.collab === c && r.partner === p)?.n || 0)),
      hovertemplate: `${p}<br>%{x}: %{y}<extra></extra>`
    }));

    Plotly.react("chartPartners", traces, {
      barmode: "stack",
      margin: { l: 40, r: 12, t: 10, b: 40 },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      font: { family: "Inter, sans-serif", size: 12 },
      legend: { orientation: "h", y: 1.15, x: 0 },
      xaxis: { gridcolor: "rgba(148,163,184,0.2)" },
      yaxis: { gridcolor: "rgba(148,163,184,0.2)" }
    }, { responsive: true, displayModeBar: false });
  }

  // --------------------------
  // Tables + detail panel
  // --------------------------
  function renderTopPatternsTable() {
    const rows = (DATA.topPatterns.length ? DATA.topPatterns : DATA.clusterSummary)
      .map(r => ({
        cluster_id: S(r.cluster_id),
        n: Number(S(r.n)) || 0,
        pattern_label: S(r.pattern_label),
        top_theme: S(r.top_theme),
        dominant_collab_type: S(r.dominant_collab_type),
        dominant_esg_block: S(r.dominant_esg_block),
        dominant_partner_type: S(r.dominant_partner_type),
        top_mechanisms: S(r.top_mechanisms),
        example_initiatives_with_evidence: S(r.example_initiatives_with_evidence)
      }))
      .sort((a,b) => b.n - a.n)
      .slice(0, 10);

    EL.topPatternsTableBody.innerHTML = rows.map(r => `
      <tr>
        <td>${r.cluster_id}</td>
        <td>${r.n}</td>
        <td>${escapeHTML(r.pattern_label)}</td>
        <td>${escapeHTML(r.top_theme)}</td>
        <td>${escapeHTML(r.dominant_collab_type)}</td>
        <td>${escapeHTML(r.dominant_esg_block)}</td>
        <td>${escapeHTML(r.dominant_partner_type)}</td>
        <td>${escapeHTML(short(r.top_mechanisms, 120))}</td>
        <td>${escapeHTML(short(r.example_initiatives_with_evidence, 140))}</td>
      </tr>
    `).join("");
  }

  function renderClusterSummaryCards() {
    const rows = DATA.clusterSummary
      .map(r => ({
        cluster_id: S(r.cluster_id),
        n: Number(S(r.n)) || 0,
        pattern_label: S(r.pattern_label),
        top_theme: S(r.top_theme),
        dominant_collab_type: S(r.dominant_collab_type),
        dominant_esg_block: S(r.dominant_esg_block),
        dominant_partner_type: S(r.dominant_partner_type),
        top_mechanisms: S(r.top_mechanisms),
      }))
      .sort((a,b) => b.n - a.n)
      .slice(0, 12);

    EL.clusterSummaryCards.innerHTML = rows.map(r => `
      <div class="summary-card">
        <div class="title">Cluster ${escapeHTML(r.cluster_id)} — ${escapeHTML(r.pattern_label)}</div>
        <div class="meta">n=${r.n} | ${escapeHTML(r.dominant_collab_type)} / ${escapeHTML(r.dominant_esg_block)} | ${escapeHTML(r.dominant_partner_type)}</div>
        <div class="body">
          <div><strong>Top theme:</strong> ${escapeHTML(r.top_theme || "NOT STATED")}</div>
          <div><strong>Top mechanisms:</strong> ${escapeHTML(short(r.top_mechanisms || "NOT STATED", 180))}</div>
        </div>
      </div>
    `).join("");
  }

  function renderInitiativesTable() {
    const start = (UI.page - 1) * UI.pageSize;
    const pageRows = UI.filtered.slice(start, start + UI.pageSize);
    const totalPages = Math.max(1, Math.ceil(UI.filtered.length / UI.pageSize));

    EL.pageInfo.textContent = `Page ${UI.page} of ${totalPages}`;
    EL.prevPage.disabled = UI.page <= 1;
    EL.nextPage.disabled = UI.page >= totalPages;

    EL.initiativesTableBody.innerHTML = pageRows.map(r => `
      <tr data-id="${escapeAttr(r.initiative_id)}" class="${UI.selectedId === r.initiative_id ? "active-row" : ""}">
        <td>${escapeHTML(r.company_name)}</td>
        <td>${escapeHTML(r.collab_type_short)}</td>
        <td>${escapeHTML(r.ESG_block_norm)}</td>
        <td>${escapeHTML(short(r.theme_tag, 30))}</td>
        <td>${escapeHTML(short(r.pattern_label, 32))}</td>
        <td>${escapeHTML(short(r.initiative_title, 75))}</td>
        <td>${escapeHTML(short(r.evidence_file_name, 30))}</td>
        <td>${escapeHTML(String(r.page_primary || ""))}</td>
      </tr>
    `).join("");

    EL.initiativesTableBody.querySelectorAll("tr").forEach(tr => {
      tr.addEventListener("click", () => {
        UI.selectedId = tr.getAttribute("data-id");
        renderSelectedDetail();
        renderInitiativesTable(); // refresh highlight only
      });
    });

    if (!UI.selectedId && UI.filtered.length) {
      UI.selectedId = UI.filtered[0].initiative_id;
      renderSelectedDetail();
      renderInitiativesTable();
    }

    if (!UI.filtered.length) clearDetail();
  }

  function renderSelectedDetail() {
    const r = UI.filtered.find(x => x.initiative_id === UI.selectedId);
    if (!r) return clearDetail();

    EL.dTitle.textContent = r.initiative_title || "NOT STATED";
    EL.dCompany.textContent = `${r.company_name} | ${r.industry_sector}`;
    EL.dCollabEsg.textContent = `${r.collab_type_short} / ${r.ESG_block_norm}`;
    EL.dThemePattern.textContent = `${r.theme_tag} | ${r.pattern_label}`;
    EL.dKpi.textContent = r.KPI_present === "YES"
      ? `YES${r.KPI_list && L(r.KPI_list) !== "not stated" ? ` — ${r.KPI_list}` : ""}`
      : r.KPI_present;
    EL.dActors.textContent = r.actors_involved || "NOT STATED";
    EL.dEvidenceMeta.textContent = `${r.evidence_file_name} | page ${r.page_primary || "NOT STATED"}`;
    EL.dQuote.textContent = r.evidence_quote_15w || "NOT STATED";
    EL.dExcerpt.textContent = r.evidence_excerpt || "NOT STATED";
    EL.dDesc.textContent = r.initiative_description || "NOT STATED";
    EL.dOutcomes.textContent = r.outputs_or_outcomes || "NOT STATED";
  }

  function clearDetail() {
    [EL.dTitle, EL.dCompany, EL.dCollabEsg, EL.dThemePattern, EL.dKpi, EL.dActors, EL.dEvidenceMeta, EL.dQuote, EL.dExcerpt, EL.dDesc, EL.dOutcomes]
      .forEach(el => el.textContent = "—");
  }

  // --------------------------
  // KPIs
  // --------------------------
  function renderKPIs() {
    const rows = UI.filtered;
    const companyCount = unique(rows.map(r => r.report_id)).length;
    const collab = countBy(rows, "collab_type_short");

    EL.kpiInitiatives.textContent = rows.length.toLocaleString();
    EL.kpiCompanies.textContent = companyCount.toLocaleString();
    EL.kpiBN.textContent = (collab.get("BN") || 0).toLocaleString();
    EL.kpiBG.textContent = (collab.get("BG") || 0).toLocaleString();
    EL.kpiBS.textContent = (collab.get("BS") || 0).toLocaleString();
    EL.kpiBB.textContent = (collab.get("BB") || 0).toLocaleString();

    EL.rowsPill.textContent = `Rows: ${rows.length}`;
  }

  // --------------------------
  // Main render cycle
  // --------------------------
  function applyFiltersAndRender() {
    applyFilters();
    renderKPIs();
    renderCollabChart();
    renderESGChart();
    renderMechanismChart();
    renderPartnerChart();
    renderInitiativesTable();
    renderTopPatternsTable();
    renderClusterSummaryCards();
  }

  function rebuildAll() {
    // clear filter sets so they match current dataset options
    UI.filters.collab.clear();
    UI.filters.esg.clear();
    UI.filters.sector.clear();
    UI.filters.theme.clear();
    UI.filters.pattern.clear();

    fillAllChecklists();
    UI.filters.search = "";
    UI.filters.kpi = "ALL";
    EL.searchInput.value = "";
    EL.kpiFilter.value = "ALL";
    applyFiltersAndRender();
  }

  // --------------------------
  // Events
  // --------------------------
  function bindEvents() {
    // Tabs
    document.querySelectorAll(".tab").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(`panel-${btn.dataset.tab}`).classList.add("active");
      });
    });

    // Theme
    const savedTheme = localStorage.getItem("esg_theme");
    if (savedTheme === "dark") document.documentElement.setAttribute("data-theme", "dark");

    EL.themeToggle.addEventListener("click", () => {
      const dark = document.documentElement.getAttribute("data-theme") === "dark";
      if (dark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("esg_theme", "light");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("esg_theme", "dark");
      }
    });

    // Dataset scope switch
    EL.datasetSelect.addEventListener("change", () => {
      setDataset(EL.datasetSelect.value);
    });

    // Search + KPI
    let debounce = null;
    EL.searchInput.addEventListener("input", () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        UI.filters.search = EL.searchInput.value;
        UI.page = 1;
        applyFiltersAndRender();
      }, 180);
    });

    EL.kpiFilter.addEventListener("change", () => {
      UI.filters.kpi = EL.kpiFilter.value;
      UI.page = 1;
      applyFiltersAndRender();
    });

    // Select all / none buttons
    document.querySelectorAll(".select-all").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const target = btn.dataset.target;
        const container = document.getElementById(target);
        container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
          cb.checked = true;
          const key = mapChecklistTargetToFilterKey(target);
          UI.filters[key].add(cb.value);
        });
        UI.page = 1;
        applyFiltersAndRender();
      });
    });

    document.querySelectorAll(".clear-all").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const target = btn.dataset.target;
        const container = document.getElementById(target);
        const key = mapChecklistTargetToFilterKey(target);
        UI.filters[key].clear();
        container.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        UI.page = 1;
        applyFiltersAndRender();
      });
    });

    EL.resetFilters.addEventListener("click", resetFiltersToAll);

    EL.downloadFiltered.addEventListener("click", () => {
      const rows = UI.filtered.map(r => ({
        initiative_id: r.initiative_id,
        report_id: r.report_id,
        company_name: r.company_name,
        industry_sector: r.industry_sector,
        ownership_type: r.ownership_type,
        year_of_report: r.year_of_report,
        collab_type_short: r.collab_type_short,
        ESG_block_norm: r.ESG_block_norm,
        theme_tag: r.theme_tag,
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
        evidence_quote_15w: r.evidence_quote_15w,
        evidence_excerpt: r.evidence_excerpt
      }));
      csvDownload("dashboard_filtered_initiatives.csv", rows);
    });

    EL.downloadTopPatterns.addEventListener("click", () => {
      const rows = (DATA.topPatterns.length ? DATA.topPatterns : DATA.clusterSummary).slice(0, 10);
      csvDownload("dashboard_top_patterns.csv", rows);
    });

    EL.prevPage.addEventListener("click", () => {
      if (UI.page > 1) {
        UI.page--;
        renderInitiativesTable();
      }
    });

    EL.nextPage.addEventListener("click", () => {
      const totalPages = Math.max(1, Math.ceil(UI.filtered.length / UI.pageSize));
      if (UI.page < totalPages) {
        UI.page++;
        renderInitiativesTable();
      }
    });
  }

  function mapChecklistTargetToFilterKey(targetId) {
    if (targetId === "collabChecklist") return "collab";
    if (targetId === "esgChecklist") return "esg";
    if (targetId === "sectorChecklist") return "sector";
    if (targetId === "themeChecklist") return "theme";
    if (targetId === "patternChecklist") return "pattern";
    throw new Error("Unknown checklist target");
  }

  // --------------------------
  // Escape helpers
  // --------------------------
  function escapeHTML(str) {
    return S(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(str) {
    return escapeHTML(str).replace(/'/g, "&#39;");
  }

  // --------------------------
  // Init
  // --------------------------
  async function init() {
    try {
      bindEvents();
      await loadAll();
    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err.message}`);
      alert("Dashboard failed to load. Check file names in /data and browser console (F12).");
    }
  }

  init();
})();
