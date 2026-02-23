/* ESG Collaboration Mapping Dashboard - app.js
   Static GitHub Pages dashboard (CSV-driven)
*/

(() => {
  const DATA_DIR = "./data";

  const state = {
    raw: {
      initiatives: [],
      companyMaster: [],
      partnerCountsPrecomputed: [],
      mechanismCountsPrecomputed: [],
      clusterAssignments: [],
      clusterSummary: [],
      top10: [],
    },
    enrichedInitiatives: [],
    filteredInitiatives: [],
    initiativeTable: null,
    top10Table: null,
    selectedInitiativeId: null,
    maps: {
      companyByReportId: new Map(),
      clusterByInitiativeId: new Map(),
      clusterSummaryByClusterId: new Map(),
    },
  };

  const els = {
    statusText: document.getElementById("statusText"),
    scopePill: document.getElementById("scopePill"),
    rowsPill: document.getElementById("rowsPill"),

    kpiInitiatives: document.getElementById("kpiInitiatives"),
    kpiCompanies: document.getElementById("kpiCompanies"),
    kpiBG: document.getElementById("kpiBG"),
    kpiBN: document.getElementById("kpiBN"),
    kpiBS: document.getElementById("kpiBS"),

    fCollab: document.getElementById("fCollab"),
    fESG: document.getElementById("fESG"),
    fSector: document.getElementById("fSector"),
    fTheme: document.getElementById("fTheme"),
    fPattern: document.getElementById("fPattern"),
    fKPI: document.getElementById("fKPI"),
    fSearch: document.getElementById("fSearch"),
    btnReset: document.getElementById("btnReset"),
    btnDownloadFiltered: document.getElementById("btnDownloadFiltered"),
    btnDownloadTop10: document.getElementById("btnDownloadTop10"),
    btnTheme: document.getElementById("btnTheme"),

    dTitle: document.getElementById("dTitle"),
    dCompany: document.getElementById("dCompany"),
    dTags: document.getElementById("dTags"),
    dThemePattern: document.getElementById("dThemePattern"),
    dKPI: document.getElementById("dKPI"),
    dActors: document.getElementById("dActors"),
    dEvidenceMeta: document.getElementById("dEvidenceMeta"),
    dEvidenceQuote: document.getElementById("dEvidenceQuote"),
    dEvidenceExcerpt: document.getElementById("dEvidenceExcerpt"),
    dDesc: document.getElementById("dDesc"),
    dOutcomes: document.getElementById("dOutcomes"),
  };

  // -----------------------------
  // Helpers
  // -----------------------------
  function norm(v) {
    return (v ?? "").toString().trim();
  }

  function lower(v) {
    return norm(v).toLowerCase();
  }

  function keyify(str) {
    return norm(str).toLowerCase().replace(/\s+/g, "_");
  }

  function toInt(v) {
    const n = parseInt(String(v).replace(/[^\d-]/g, ""), 10);
    return Number.isFinite(n) ? n : null;
  }

  function uniq(arr) {
    return [...new Set(arr)];
  }

  function sortAlpha(arr) {
    return [...arr].sort((a, b) => a.localeCompare(b));
  }

  function safeText(v, fallback = "not stated") {
    const s = norm(v);
    if (!s) return fallback;
    return s;
  }

  function firstExisting(obj, candidates) {
    for (const c of candidates) {
      if (obj && Object.prototype.hasOwnProperty.call(obj, c)) return obj[c];
    }
    return "";
  }

  function normalizeHeaders(rows) {
    return rows.map((row) => {
      const clean = {};
      Object.keys(row || {}).forEach((k) => {
        clean[norm(k)] = row[k];
      });
      return clean;
    });
  }

  async function loadCsv(url, { optional = false } = {}) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        if (optional) return [];
        throw new Error(`HTTP ${res.status} for ${url}`);
      }
      const text = await res.text();
      const parsed = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
      });
      if (parsed.errors && parsed.errors.length) {
        console.warn(`CSV parse warnings for ${url}:`, parsed.errors.slice(0, 3));
      }
      return normalizeHeaders(parsed.data || []);
    } catch (err) {
      if (optional) {
        console.warn(`Optional CSV not loaded: ${url}`, err);
        return [];
      }
      throw err;
    }
  }

  function setStatus(msg) {
    els.statusText.textContent = msg;
  }

  function downloadCsv(filename, rows) {
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function getMultiSelectedValues(selectEl) {
    return Array.from(selectEl.selectedOptions).map((o) => o.value);
  }

  function fillMultiSelect(selectEl, values) {
    selectEl.innerHTML = "";
    values.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      selectEl.appendChild(opt);
    });
  }

  function countBy(rows, key) {
    const m = new Map();
    rows.forEach((r) => {
      const k = norm(r[key]) || "NOT STATED";
      m.set(k, (m.get(k) || 0) + 1);
    });
    return m;
  }

  function normalizeKPI(v) {
    const s = lower(v);
    if (!s || s === "not stated" || s === "na" || s === "n/a") return "NOT STATED";
    if (["yes", "y", "true", "1"].includes(s)) return "YES";
    if (["no", "n", "false", "0"].includes(s)) return "NO";
    // fallback if weird values
    if (s.includes("yes")) return "YES";
    if (s.includes("no")) return "NO";
    return "NOT STATED";
  }

  function normalizeCollab(v) {
    const s = upperSafe(v);
    if (["BG", "BN", "BS", "BB"].includes(s)) return s;
    return s || "NOT STATED";
  }

  function normalizeESG(v) {
    const s = upperSafe(v);
    if (["E", "S", "G", "X"].includes(s)) return s;
    return s || "NOT STATED";
  }

  function upperSafe(v) {
    return norm(v).toUpperCase();
  }

  function firstPage(v) {
    const n = toInt(v);
    return n ?? "";
  }

  function shortStr(v, max = 140) {
    const s = norm(v);
    if (s.length <= max) return s;
    return `${s.slice(0, max - 1)}…`;
  }

  // -----------------------------
  // Partner typing (edge counts)
  // -----------------------------
  function splitActors(raw) {
    const s = norm(raw);
    if (!s || s.toLowerCase() === "not stated") return [];

    // prefer strong delimiters first
    let chunks = s.split(/\s*[;|\n]\s*/).map(norm).filter(Boolean);

    // if still one chunk and very long, try comma split as fallback
    if (chunks.length <= 1 && s.includes(",")) {
      chunks = s.split(/\s*,\s*/).map(norm).filter(Boolean);
    }

    // de-duplicate exact repeats within the same row
    return uniq(chunks);
  }

  function classifyPartnerType(actorName) {
    const a = lower(actorName);

    // Government / state / regulator
    if (
      /(government|ministry|municipal|municipality|provincial|province|district|county|bureau|commission|regulator|sasac|administration|authorit(y|ies)|state council|people'?s government|local government|public security)/.test(a)
    ) {
      return "government";
    }

    // NGO / public organizations / foundations / UN bodies
    if (
      /(foundation|charity|red cross|one foundation|federation|association|society|public welfare|ngo|non[- ]?profit|nonprofit|united nations|un global compact|ungc|unep|undp|unicef|wwf|greenpeace|forum)/.test(a)
    ) {
      return "ngo_public";
    }

    // Universities / schools / hospitals / research institutes
    if (
      /(university|college|school|academy|hospital|clinic|medical|institute|laboratory|lab|research center|research centre)/.test(a)
    ) {
      return "academia_health";
    }

    // Businesses / firms / groups / suppliers
    if (
      /(company|co\.|corp|corporation|ltd|limited|holdings|group|bank|supplier|enterprise|industr(y|ies)|technology|tech|telecom)/.test(a)
    ) {
      return "business";
    }

    return "other";
  }

  function computePartnerEdgeCountsFromFiltered(rows) {
    const counts = new Map(); // key: collab|partner_type -> n

    rows.forEach((r) => {
      const collab = r.collab_type_short || "NOT STATED";
      const actors = splitActors(r.actors_involved);

      // Count each actor mention as an edge/mention
      actors.forEach((actor) => {
        const p = classifyPartnerType(actor);
        const key = `${collab}||${p}`;
        counts.set(key, (counts.get(key) || 0) + 1);
      });
    });

    const out = [];
    counts.forEach((n, key) => {
      const [collab_type_short, partner_type] = key.split("||");
      out.push({ collab_type_short, partner_type, count: n });
    });
    return out;
  }

  // -----------------------------
  // Mechanism tagging (transparent rules)
  // -----------------------------
  const mechanismRules = [
    { key: "donation_philanthropy", label: "donation_philanthropy", regex: /\b(donation|donate|charity|charitable|philanthropy|fundraising|public welfare|relief fund)\b/i },
    { key: "joint_research_innovation", label: "joint_research_innovation", regex: /\b(joint research|co-?research|collaborat(e|ion).*research|innovation|r&d|research and development|laboratory|lab|pilot project)\b/i },
    { key: "training_education", label: "training_education", regex: /\b(training|education|academy|capacity building|course|curriculum|workshop|talent development|internship|scholarship)\b/i },
    { key: "emissions_carbon", label: "emissions_carbon", regex: /\b(emission|carbon|ghg|greenhouse gas|decarbon|net zero|carbon neutral|carbon footprint)\b/i },
    { key: "renewable_energy", label: "renewable_energy", regex: /\b(renewable|photovoltaic|pv|solar|wind power|clean energy|green power|energy storage)\b/i },
    { key: "water", label: "water", regex: /\b(water|wastewater|water stewardship|water resiliency|water resilience)\b/i },
    { key: "biodiversity_wildlife", label: "biodiversity_wildlife", regex: /\b(biodiversity|wildlife|ecosystem|habitat|species|ecological protection)\b/i },
    { key: "health_medical", label: "health_medical", regex: /\b(health|medical|hospital|clinic|disease|rehabilitation|healthcare)\b/i },
    { key: "rural_revitalization", label: "rural_revitalization", regex: /\b(rural revitalization|rural|village|farmer|agricultural development|county development)\b/i },
    { key: "cybersecurity_awareness", label: "cybersecurity_awareness", regex: /\b(cybersecurity|cyber security|information security|security awareness|privacy protection)\b/i },
  ];

  function computeMechanismCounts(rows) {
    const counts = new Map(mechanismRules.map((r) => [r.label, 0]));
    rows.forEach((r) => {
      const text = [
        r.initiative_title,
        r.initiative_description,
        r.outputs_or_outcomes,
        r.evidence_excerpt,
        r.evidence_quote_15w,
        r.theme_tag,
      ]
        .map(norm)
        .join(" ")
        .toLowerCase();

      mechanismRules.forEach((rule) => {
        if (rule.regex.test(text)) {
          counts.set(rule.label, (counts.get(rule.label) || 0) + 1);
        }
      });
    });

    return [...counts.entries()]
      .map(([mechanism, initiative_count]) => ({ mechanism, initiative_count }))
      .filter((d) => d.initiative_count > 0)
      .sort((a, b) => b.initiative_count - a.initiative_count);
  }

  // -----------------------------
  // Data preparation
  // -----------------------------
  function buildMaps() {
    state.maps.companyByReportId.clear();
    state.maps.clusterByInitiativeId.clear();
    state.maps.clusterSummaryByClusterId.clear();

    state.raw.companyMaster.forEach((r) => {
      const reportId = norm(firstExisting(r, ["report_id"]));
      if (!reportId) return;
      state.maps.companyByReportId.set(reportId, {
        file_name: norm(firstExisting(r, ["file_name"])),
        company_name_clean: norm(firstExisting(r, ["company_name_clean"])),
        industry_sector: norm(firstExisting(r, ["industry_sector"])),
        ownership_type: norm(firstExisting(r, ["ownership_type"])),
        year_of_report: norm(firstExisting(r, ["year_of_report"])),
        reporting_standard_mentions: norm(firstExisting(r, ["reporting_standard_mentions"])),
      });
    });

    state.raw.clusterAssignments.forEach((r) => {
      const initiativeId = norm(firstExisting(r, ["initiative_id"]));
      const clusterId = norm(firstExisting(r, ["cluster_id"]));
      if (!initiativeId) return;
      state.maps.clusterByInitiativeId.set(initiativeId, clusterId);
    });

    state.raw.clusterSummary.forEach((r) => {
      const cid = norm(firstExisting(r, ["cluster_id"]));
      if (!cid) return;
      state.maps.clusterSummaryByClusterId.set(cid, {
        pattern_label: norm(firstExisting(r, ["pattern_label"])),
        top_theme: norm(firstExisting(r, ["top_theme"])),
        dominant_collab_type: norm(firstExisting(r, ["dominant_collab_type"])),
        dominant_esg_block: norm(firstExisting(r, ["dominant_esg_block"])),
        dominant_partner_type: norm(firstExisting(r, ["dominant_partner_type"])),
        top_mechanisms: norm(firstExisting(r, ["top_mechanisms"])),
        example_initiatives_with_evidence: norm(firstExisting(r, ["example_initiatives_with_evidence"])),
        n: norm(firstExisting(r, ["n"])),
        top_terms: norm(firstExisting(r, ["top_terms"])),
      });
    });
  }

  function enrichInitiatives() {
    const rows = state.raw.initiatives.map((r, idx) => {
      const reportId = norm(firstExisting(r, ["report_id"]));
      const master = state.maps.companyByReportId.get(reportId) || {};

      const initiative_id = norm(firstExisting(r, ["initiative_id"])) || `ROW_${idx + 1}`;
      const cluster_id = norm(state.maps.clusterByInitiativeId.get(initiative_id));
      const clusterSummary = state.maps.clusterSummaryByClusterId.get(cluster_id) || {};

      const company_name =
        norm(firstExisting(r, ["company_name_fixed", "company_canonical"])) ||
        norm(master.company_name_clean) ||
        "NOT STATED";

      const initiative_title = norm(firstExisting(r, ["initiative_title"])) || "NOT STATED";
      const initiative_description = norm(firstExisting(r, ["initiative_description"])) || "";
      const outputs_or_outcomes = norm(firstExisting(r, ["outputs_or_outcomes"])) || "";
      const actors_involved = norm(firstExisting(r, ["actors_involved"])) || "not stated";

      const evidence_file_name =
        norm(firstExisting(r, ["evidence_file_name"])) || norm(master.file_name) || "NOT STATED";

      const page_primary = firstPage(firstExisting(r, ["page_primary"])) || "";
      const evidence_page_numbers = norm(firstExisting(r, ["evidence_page_numbers"])) || "";
      const evidence_quote_15w = norm(firstExisting(r, ["evidence_quote_15w"])) || "";
      const evidence_excerpt = norm(firstExisting(r, ["evidence_excerpt"])) || "";

      const collab_type_short = normalizeCollab(firstExisting(r, ["collab_type_short"]));
      const ESG_block_norm = normalizeESG(firstExisting(r, ["ESG_block_norm"]));
      const theme_tag = norm(firstExisting(r, ["theme_tag"])) || "NOT STATED";

      const industry_sector =
        norm(firstExisting(r, ["industry_sector"])) || norm(master.industry_sector) || "NOT STATED";

      const ownership_type =
        norm(firstExisting(r, ["ownership_type"])) || norm(master.ownership_type) || "NOT STATED";

      const year_of_report =
        norm(firstExisting(r, ["year_of_report"])) || norm(master.year_of_report) || "NOT STATED";

      const KPI_present = normalizeKPI(firstExisting(r, ["KPI_present"]));
      const KPI_list = norm(firstExisting(r, ["KPI_list"])) || "not stated";

      const geography = norm(firstExisting(r, ["geography"])) || "not stated";

      const pattern_label = norm(clusterSummary.pattern_label) || "NOT STATED";
      const top_theme = norm(clusterSummary.top_theme) || "";
      const top_mechanisms = norm(clusterSummary.top_mechanisms) || "";

      const search_blob = [
        company_name,
        collab_type_short,
        ESG_block_norm,
        theme_tag,
        initiative_title,
        initiative_description,
        outputs_or_outcomes,
        actors_involved,
        evidence_file_name,
        evidence_quote_15w,
        evidence_excerpt,
        pattern_label,
      ]
        .join(" | ")
        .toLowerCase();

      return {
        // original-ish fields
        initiative_id,
        report_id: reportId,
        company_name,
        industry_sector,
        ownership_type,
        year_of_report,
        ESG_block_norm,
        theme_tag,
        collab_type_short,
        initiative_title,
        initiative_description,
        outputs_or_outcomes,
        KPI_present,
        KPI_list,
        geography,
        actors_involved,
        evidence_file_name,
        page_primary,
        evidence_page_numbers,
        evidence_quote_15w,
        evidence_excerpt,
        confidence: norm(firstExisting(r, ["confidence"])) || "",
        qa_reasons: norm(firstExisting(r, ["qa_reasons"])) || "",

        // enrichment
        cluster_id: cluster_id || "",
        pattern_label,
        cluster_top_theme: top_theme,
        cluster_top_mechanisms: top_mechanisms,

        // internal
        _search_blob: search_blob,
      };
    });

    state.enrichedInitiatives = rows;
    state.filteredInitiatives = [...rows];
  }

  function prepareTop10() {
    // Prefer generic_patterns_brief_top10.csv; fallback to cluster summary
    if (state.raw.top10.length) return;

    state.raw.top10 = state.raw.clusterSummary
      .map((r) => ({
        cluster_id: norm(firstExisting(r, ["cluster_id"])),
        n: toInt(firstExisting(r, ["n"])) || 0,
        pattern_label: norm(firstExisting(r, ["pattern_label"])),
        top_theme: norm(firstExisting(r, ["top_theme"])),
        dominant_collab_type: norm(firstExisting(r, ["dominant_collab_type"])),
        dominant_esg_block: norm(firstExisting(r, ["dominant_esg_block"])),
        dominant_partner_type: norm(firstExisting(r, ["dominant_partner_type"])),
        top_mechanisms: norm(firstExisting(r, ["top_mechanisms"])),
        example_initiatives_with_evidence: norm(firstExisting(r, ["example_initiatives_with_evidence"])),
      }))
      .sort((a, b) => (b.n || 0) - (a.n || 0))
      .slice(0, 10);
  }

  // -----------------------------
  // Filters
  // -----------------------------
  function initFilterOptions() {
    const rows = state.enrichedInitiatives;

    fillMultiSelect(
      els.fCollab,
      sortAlpha(uniq(rows.map((r) => r.collab_type_short).filter(Boolean)))
    );
    fillMultiSelect(
      els.fESG,
      sortAlpha(uniq(rows.map((r) => r.ESG_block_norm).filter(Boolean)))
    );
    fillMultiSelect(
      els.fSector,
      sortAlpha(uniq(rows.map((r) => r.industry_sector).filter(Boolean)))
    );
    fillMultiSelect(
      els.fTheme,
      sortAlpha(uniq(rows.map((r) => r.theme_tag).filter(Boolean)))
    );
    fillMultiSelect(
      els.fPattern,
      sortAlpha(uniq(rows.map((r) => r.pattern_label).filter(Boolean)))
    );
  }

  function applyFilters() {
    const selCollab = new Set(getMultiSelectedValues(els.fCollab));
    const selESG = new Set(getMultiSelectedValues(els.fESG));
    const selSector = new Set(getMultiSelectedValues(els.fSector));
    const selTheme = new Set(getMultiSelectedValues(els.fTheme));
    const selPattern = new Set(getMultiSelectedValues(els.fPattern));
    const selKPI = norm(els.fKPI.value || "ALL").toUpperCase();
    const q = lower(els.fSearch.value);

    const filtered = state.enrichedInitiatives.filter((r) => {
      if (selCollab.size && !selCollab.has(r.collab_type_short)) return false;
      if (selESG.size && !selESG.has(r.ESG_block_norm)) return false;
      if (selSector.size && !selSector.has(r.industry_sector)) return false;
      if (selTheme.size && !selTheme.has(r.theme_tag)) return false;
      if (selPattern.size && !selPattern.has(r.pattern_label)) return false;

      if (selKPI !== "ALL") {
        if (r.KPI_present !== selKPI) return false;
      }

      if (q && !r._search_blob.includes(q)) return false;
      return true;
    });

    state.filteredInitiatives = filtered;

    renderKPIs();
    renderCharts();
    refreshInitiativeTable();
    refreshRowsPill();

    // If selected row no longer present, clear detail
    if (
      state.selectedInitiativeId &&
      !filtered.some((r) => r.initiative_id === state.selectedInitiativeId)
    ) {
      state.selectedInitiativeId = null;
      clearDetailPanel();
    }
  }

  function resetFilters() {
    [els.fCollab, els.fESG, els.fSector, els.fTheme, els.fPattern].forEach((sel) => {
      Array.from(sel.options).forEach((o) => (o.selected = false));
    });
    els.fKPI.value = "ALL";
    els.fSearch.value = "";
    applyFilters();
  }

  // -----------------------------
  // Rendering - KPIs
  // -----------------------------
  function renderKPIs() {
    const rows = state.filteredInitiatives;
    const companyKeys = uniq(
      rows.map((r) => r.report_id || r.company_name).filter(Boolean)
    );

    const collabMap = countBy(rows, "collab_type_short");

    els.kpiInitiatives.textContent = rows.length.toLocaleString();
    els.kpiCompanies.textContent = companyKeys.length.toLocaleString();
    els.kpiBG.textContent = (collabMap.get("BG") || 0).toLocaleString();
    els.kpiBN.textContent = (collabMap.get("BN") || 0).toLocaleString();
    els.kpiBS.textContent = (collabMap.get("BS") || 0).toLocaleString();
  }

  function refreshRowsPill() {
    els.rowsPill.textContent = `Rows: ${state.filteredInitiatives.length}`;
  }

  // -----------------------------
  // Rendering - Charts
  // -----------------------------
  function plotBar(elId, labels, values, titleText = "", { horizontal = false, stacked = false, traces = null } = {}) {
    const el = document.getElementById(elId);

    let data;
    if (traces) {
      data = traces;
    } else {
      data = [{
        type: "bar",
        x: horizontal ? values : labels,
        y: horizontal ? labels : values,
        orientation: horizontal ? "h" : "v",
        hovertemplate: "%{y}: %{x}<extra></extra>",
      }];
    }

    const layout = {
      margin: { t: 12, r: 12, b: 40, l: horizontal ? 120 : 40 },
      paper_bgcolor: "transparent",
      plot_bgcolor: "transparent",
      font: { family: "Inter, system-ui, sans-serif", size: 12 },
      xaxis: { automargin: true, gridcolor: "rgba(127,127,127,0.15)" },
      yaxis: { automargin: true, gridcolor: "rgba(127,127,127,0.15)" },
      showlegend: !!traces,
      legend: { orientation: "h", y: 1.15, x: 0 },
      barmode: stacked ? "stack" : "group",
    };

    const config = { responsive: true, displayModeBar: false };

    Plotly.react(el, data, layout, config);
  }

  function renderCollabChart(rows) {
    const order = ["BN", "BG", "BS", "BB", "NOT STATED"];
    const counts = countBy(rows, "collab_type_short");
    const labels = order.filter((k) => counts.has(k));
    const values = labels.map((k) => counts.get(k) || 0);
    plotBar("chartCollab", labels, values);
  }

  function renderESGChart(rows) {
    const order = ["E", "S", "G", "X", "NOT STATED"];
    const counts = countBy(rows, "ESG_block_norm");
    const labels = order.filter((k) => counts.has(k));
    const values = labels.map((k) => counts.get(k) || 0);
    plotBar("chartESG", labels, values);
  }

  function renderMechanismChart(rows) {
    let mech = computeMechanismCounts(rows);

    // fallback to precomputed global if nothing matched
    if (!mech.length && state.raw.mechanismCountsPrecomputed.length) {
      mech = state.raw.mechanismCountsPrecomputed.map((r) => ({
        mechanism: norm(firstExisting(r, ["mechanism"])),
        initiative_count: toInt(firstExisting(r, ["initiative_count"])) || 0,
      }));
    }

    const top = mech.slice(0, 12);
    const labels = top.map((d) => d.mechanism);
    const values = top.map((d) => d.initiative_count);
    plotBar("chartMechanisms", labels, values, "", { horizontal: true });
  }

  function renderPartnerChart(rows) {
    let partnerRows = computePartnerEdgeCountsFromFiltered(rows);

    // fallback to precomputed file if filtered parse gives nothing
    if (!partnerRows.length && state.raw.partnerCountsPrecomputed.length) {
      partnerRows = state.raw.partnerCountsPrecomputed.map((r) => ({
        collab_type_short: norm(firstExisting(r, ["collab_type_short"])),
        partner_type: norm(firstExisting(r, ["partner_type"])),
        count: toInt(firstExisting(r, ["count", "edge_count"])) || 0,
      }));
    }

    const collabOrder = ["BG", "BN", "BS", "BB"];
    const partnerOrder = ["government", "ngo_public", "academia_health", "business", "other"];

    const traces = partnerOrder.map((ptype) => ({
      type: "bar",
      name: ptype,
      x: collabOrder,
      y: collabOrder.map((c) => {
        const hit = partnerRows.find((r) => r.collab_type_short === c && r.partner_type === ptype);
        return hit ? (toInt(hit.count) || 0) : 0;
      }),
      hovertemplate: `${ptype}<br>%{x}: %{y}<extra></extra>`,
    }));

    plotBar("chartPartners", [], [], "", { traces, stacked: true });
  }

  function renderCharts() {
    const rows = state.filteredInitiatives;
    renderCollabChart(rows);
    renderESGChart(rows);
    renderMechanismChart(rows);
    renderPartnerChart(rows);
  }

  // -----------------------------
  // Rendering - Tables
  // -----------------------------
  function initTop10Table() {
    const rows = state.raw.top10.map((r) => ({
      cluster_id: norm(firstExisting(r, ["cluster_id"])),
      n: toInt(firstExisting(r, ["n"])) || 0,
      pattern_label: norm(firstExisting(r, ["pattern_label"])),
      top_theme: norm(firstExisting(r, ["top_theme"])),
      dominant_collab_type: norm(firstExisting(r, ["dominant_collab_type"])),
      dominant_esg_block: norm(firstExisting(r, ["dominant_esg_block"])),
      dominant_partner_type: norm(firstExisting(r, ["dominant_partner_type"])),
      top_mechanisms: norm(firstExisting(r, ["top_mechanisms"])),
      example_initiatives_with_evidence: norm(firstExisting(r, ["example_initiatives_with_evidence"])),
    }));

    state.top10Table = new Tabulator("#top10Table", {
      data: rows,
      layout: "fitColumns",
      responsiveLayout: "collapse",
      pagination: "local",
      paginationSize: 10,
      movableColumns: false,
      columns: [
        { title: "Cluster", field: "cluster_id", width: 80 },
        { title: "n", field: "n", width: 70, hozAlign: "right" },
        { title: "Pattern label", field: "pattern_label", minWidth: 180 },
        { title: "Top theme", field: "top_theme", minWidth: 140 },
        { title: "Collab", field: "dominant_collab_type", width: 90 },
        { title: "ESG", field: "dominant_esg_block", width: 80 },
        { title: "Partner type", field: "dominant_partner_type", minWidth: 120 },
        { title: "Top mechanisms", field: "top_mechanisms", minWidth: 240 },
        {
          title: "Example evidence",
          field: "example_initiatives_with_evidence",
          minWidth: 280,
          formatter: (cell) => shortStr(cell.getValue(), 220),
        },
      ],
    });
  }

  function initiativeTableData(rows) {
    return rows.map((r) => ({
      initiative_id: r.initiative_id,
      company: r.company_name,
      collab: r.collab_type_short,
      esg: r.ESG_block_norm,
      theme: r.theme_tag,
      pattern: r.pattern_label,
      title: r.initiative_title,
      kpi: r.KPI_present,
      file: r.evidence_file_name,
      page: r.page_primary,
      quote: r.evidence_quote_15w,
      // keep full row for details
      _full: r,
    }));
  }

  function initInitiativeTable() {
    state.initiativeTable = new Tabulator("#initiativeTable", {
      data: initiativeTableData(state.filteredInitiatives),
      layout: "fitColumns",
      responsiveLayout: "collapse",
      pagination: "local",
      paginationSize: 12,
      paginationSizeSelector: [12, 25, 50, 100],
      movableColumns: true,
      rowClick: (_e, row) => {
        const data = row.getData();
        state.selectedInitiativeId = data.initiative_id;
        renderDetailPanel(data._full);
      },
      columns: [
        { title: "Company", field: "company", width: 150, headerFilter: "input" },
        { title: "Collab", field: "collab", width: 80, hozAlign: "center" },
        { title: "ESG", field: "esg", width: 70, hozAlign: "center" },
        { title: "Theme", field: "theme", minWidth: 140 },
        { title: "Pattern", field: "pattern", minWidth: 140 },
        { title: "Initiative title", field: "title", minWidth: 240 },
        { title: "KPI", field: "kpi", width: 90, hozAlign: "center" },
        { title: "Evidence file", field: "file", minWidth: 160 },
        { title: "Page", field: "page", width: 70, hozAlign: "right" },
        {
          title: "Quote",
          field: "quote",
          minWidth: 220,
          formatter: (cell) => shortStr(cell.getValue(), 140),
        },
      ],
    });

    // Default select first row if present
    const first = state.filteredInitiatives[0];
    if (first) {
      state.selectedInitiativeId = first.initiative_id;
      renderDetailPanel(first);
    }
  }

  function refreshInitiativeTable() {
    if (!state.initiativeTable) return;
    state.initiativeTable.replaceData(initiativeTableData(state.filteredInitiatives));
    if (!state.filteredInitiatives.length) {
      clearDetailPanel();
      return;
    }

    // preserve previous selection if still there
    const selected =
      state.selectedInitiativeId &&
      state.filteredInitiatives.find((r) => r.initiative_id === state.selectedInitiativeId);

    if (selected) {
      renderDetailPanel(selected);
    } else {
      state.selectedInitiativeId = state.filteredInitiatives[0].initiative_id;
      renderDetailPanel(state.filteredInitiatives[0]);
    }
  }

  // -----------------------------
  // Detail panel
  // -----------------------------
  function renderDetailPanel(r) {
    if (!r) return clearDetailPanel();

    els.dTitle.textContent = safeText(r.initiative_title, "NOT STATED");
    els.dCompany.textContent = `${safeText(r.company_name)} (${safeText(r.industry_sector)})`;

    els.dTags.textContent = `${safeText(r.collab_type_short)} / ${safeText(r.ESG_block_norm)}`;
    els.dThemePattern.textContent = `${safeText(r.theme_tag)} | ${safeText(r.pattern_label)}`;
    els.dKPI.textContent =
      r.KPI_present === "YES"
        ? `YES${r.KPI_list && lower(r.KPI_list) !== "not stated" ? ` — ${r.KPI_list}` : ""}`
        : safeText(r.KPI_present);

    els.dActors.textContent = safeText(r.actors_involved);

    const pagePart = r.page_primary ? `p. ${r.page_primary}` : "page not stated";
    const pagesRaw =
      r.evidence_page_numbers && r.evidence_page_numbers !== String(r.page_primary)
        ? ` (pages: ${r.evidence_page_numbers})`
        : "";
    els.dEvidenceMeta.textContent = `${safeText(r.evidence_file_name)} | ${pagePart}${pagesRaw}`;

    els.dEvidenceQuote.textContent = safeText(r.evidence_quote_15w, "NOT STATED");
    els.dEvidenceExcerpt.textContent = safeText(r.evidence_excerpt, "NOT STATED");
    els.dDesc.textContent = safeText(r.initiative_description, "NOT STATED");
    els.dOutcomes.textContent = safeText(r.outputs_or_outcomes, "NOT STATED");
  }

  function clearDetailPanel() {
    [
      els.dTitle,
      els.dCompany,
      els.dTags,
      els.dThemePattern,
      els.dKPI,
      els.dActors,
      els.dEvidenceMeta,
      els.dEvidenceQuote,
      els.dEvidenceExcerpt,
      els.dDesc,
      els.dOutcomes,
    ].forEach((el) => (el.textContent = "—"));
  }

  // -----------------------------
  // Theme
  // -----------------------------
  function initTheme() {
    const saved = localStorage.getItem("esgDashTheme");
    if (saved === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }

    els.btnTheme.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      if (current === "dark") {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("esgDashTheme", "light");
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("esgDashTheme", "dark");
      }
    });
  }

  // -----------------------------
  // Events
  // -----------------------------
  function bindEvents() {
    [els.fCollab, els.fESG, els.fSector, els.fTheme, els.fPattern, els.fKPI].forEach((el) => {
      el.addEventListener("change", applyFilters);
    });

    let searchTimer = null;
    els.fSearch.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(applyFilters, 180);
    });

    els.btnReset.addEventListener("click", resetFilters);

    els.btnDownloadFiltered.addEventListener("click", () => {
      const rows = state.filteredInitiatives.map((r) => ({
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
        evidence_page_numbers: r.evidence_page_numbers,
        evidence_quote_15w: r.evidence_quote_15w,
        evidence_excerpt: r.evidence_excerpt,
        confidence: r.confidence,
        qa_reasons: r.qa_reasons,
      }));
      downloadCsv("initiatives_filtered_dashboard_export.csv", rows);
    });

    els.btnDownloadTop10.addEventListener("click", () => {
      const rows = state.raw.top10.map((r) => ({
        cluster_id: firstExisting(r, ["cluster_id"]),
        n: firstExisting(r, ["n"]),
        pattern_label: firstExisting(r, ["pattern_label"]),
        top_theme: firstExisting(r, ["top_theme"]),
        dominant_collab_type: firstExisting(r, ["dominant_collab_type"]),
        dominant_esg_block: firstExisting(r, ["dominant_esg_block"]),
        dominant_partner_type: firstExisting(r, ["dominant_partner_type"]),
        top_mechanisms: firstExisting(r, ["top_mechanisms"]),
        example_initiatives_with_evidence: firstExisting(r, ["example_initiatives_with_evidence"]),
      }));
      downloadCsv("generic_patterns_brief_top10_dashboard_export.csv", rows);
    });
  }

  // -----------------------------
  // Boot
  // -----------------------------
  async function boot() {
    try {
      setStatus("Loading datasets from ./data/ …");

      initTheme();

      const [
        initiatives,
        companyMaster,
        mechanismCounts,
        partnerCounts,
        clusterAssignments,
        clusterSummary,
        top10,
      ] = await Promise.all([
        loadCsv(`${DATA_DIR}/initiatives.csv`),
        loadCsv(`${DATA_DIR}/company_master_clean.csv`),
        loadCsv(`${DATA_DIR}/patterns_mechanism_counts.csv`, { optional: true }),
        loadCsv(`${DATA_DIR}/patterns_partner_types_from_initiatives.csv`, { optional: true }),
        loadCsv(`${DATA_DIR}/patterns_topic_cluster_assignments.csv`, { optional: true }),
        loadCsv(`${DATA_DIR}/patterns_topic_clusters_summary.csv`, { optional: true }),
        loadCsv(`${DATA_DIR}/generic_patterns_brief_top10.csv`, { optional: true }),
      ]);

      state.raw.initiatives = initiatives;
      state.raw.companyMaster = companyMaster;
      state.raw.mechanismCountsPrecomputed = mechanismCounts;
      state.raw.partnerCountsPrecomputed = partnerCounts;
      state.raw.clusterAssignments = clusterAssignments;
      state.raw.clusterSummary = clusterSummary;
      state.raw.top10 = top10;

      buildMaps();
      enrichInitiatives();
      prepareTop10();

      initFilterOptions();
      bindEvents();
      renderKPIs();
      renderCharts();
      initTop10Table();
      initInitiativeTable();
      refreshRowsPill();

      const companies = uniq(state.enrichedInitiatives.map((r) => r.report_id).filter(Boolean)).length;
      setStatus(
        `Loaded ${state.enrichedInitiatives.length} initiatives, ${companies} companies, ` +
        `${state.raw.clusterSummary.length || 0} cluster summaries.`
      );

      // Scope pill text
      els.scopePill.textContent = `Scope: initiatives.csv (${state.enrichedInitiatives.length} rows)`;
    } catch (err) {
      console.error(err);
      setStatus(`Load error: ${err.message}`);
      els.scopePill.textContent = "Scope: load failed";
    }
  }

  boot();
})();
