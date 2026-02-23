/* China ESG Collaboration Dashboard (Static, GitHub Pages)
   Built for:
   - data/initiatives.csv (CLEAN subset, 111 rows)
   - data/initiatives2.csv (FULL extraction, 501 rows)
   - supporting pattern CSVs
*/

const DATA = {
  initiativesClean: "./data/initiatives.csv",
  initiativesFull: "./data/initiatives2.csv",
  companyMaster: "./data/company_master_clean.csv",
  top10: "./data/generic_patterns_brief_top10.csv",
  mech: "./data/patterns_mechanism_counts.csv",
  partner: "./data/patterns_partner_types_from_initiatives.csv",
  clusterSummary: "./data/patterns_topic_clusters_summary.csv",
  clusterAssign: "./data/patterns_topic_cluster_assignments.csv",
};

function $(id){ return document.getElementById(id); }

function showToast(msg){
  const el = $("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  setTimeout(()=> el.classList.add("hidden"), 1800);
}

function parseCSV(url){
  return new Promise((resolve, reject)=>{
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (res)=> resolve(res.data),
      error: (err)=> reject(err),
    });
  });
}

function uniq(arr){
  const s = new Set();
  for (const v of arr){
    if (v === null || v === undefined) continue;
    const x = String(v).trim();
    if (!x) continue;
    s.add(x);
  }
  return Array.from(s).sort((a,b)=>a.localeCompare(b));
}

function safeStr(v){ return (v===null || v===undefined) ? "" : String(v).trim(); }
function toInt(v){
  const n = Number(String(v).replace(/[^0-9.-]/g,""));
  return Number.isFinite(n) ? Math.trunc(n) : 0;
}
function yesNoNorm(v){
  const s = safeStr(v).toLowerCase();
  if (["yes","y","true","1"].includes(s)) return "YES";
  if (["no","n","false","0"].includes(s)) return "NO";
  if (!s) return "NOT STATED";
  return "NOT STATED";
}
function firstPage(v){
  const s = safeStr(v);
  if (!s) return "";
  const m = s.match(/\d+/);
  return m ? m[0] : "";
}
function shortQuote15w(text){
  const t = safeStr(text).replace(/\s+/g," ").trim();
  if (!t) return "";
  return t.split(" ").slice(0, 15).join(" ");
}

function setLoading(on){
  $("loadingOverlay").style.display = on ? "flex" : "none";
}

function formatNum(n){
  try { return new Intl.NumberFormat().format(n); } catch(e){ return String(n); }
}

function buildCompanyIndex(companyRows){
  const map = new Map();
  for (const r of companyRows){
    const id = safeStr(r.report_id);
    if (!id) continue;
    map.set(id, {
      report_id: id,
      file_name: safeStr(r.file_name),
      company_name_clean: safeStr(r.company_name_clean),
      industry_sector: safeStr(r.industry_sector),
      ownership_type: safeStr(r.ownership_type),
      year_of_report: safeStr(r.year_of_report),
      reporting_standard_mentions: safeStr(r.reporting_standard_mentions),
    });
  }
  return map;
}

function buildClusterAssignMap(rows){
  const map = new Map();
  for (const r of rows){
    const id = safeStr(r.initiative_id);
    if (!id) continue;
    map.set(id, {
      cluster_id: safeStr(r.cluster_id),
      initiative_title: safeStr(r.initiative_title),
      evidence_quote_15w: safeStr(r.evidence_quote_15w),
    });
  }
  return map;
}

function normalizeClean(cleanRows, companyIndex, clusterAssignMap){
  return cleanRows.map(r => {
    const report_id = safeStr(r.report_id);
    const cm = companyIndex.get(report_id) || {};
    const ca = clusterAssignMap.get(safeStr(r.initiative_id)) || {};

    const company =
      safeStr(r.company_name_fixed) ||
      safeStr(r.company_canonical) ||
      cm.company_name_clean ||
      "NOT STATED";

    const initiative_title =
      safeStr(r.initiative_title) ||
      safeStr(ca.initiative_title) ||
      "";

    return {
      dataset: "CLEAN (111)",
      initiative_id: safeStr(r.initiative_id),
      report_id,
      company,
      industry_sector: safeStr(r.industry_sector) || cm.industry_sector || "NOT STATED",
      ownership_type: safeStr(r.ownership_type) || cm.ownership_type || "NOT STATED",
      year_of_report: safeStr(r.year_of_report) || cm.year_of_report || "NOT STATED",
      collab_type: safeStr(r.collab_type_short) || "NOT STATED",
      esg_block: safeStr(r.ESG_block_norm) || "NOT STATED",
      theme_tag: safeStr(r.theme_tag) || "not_stated",
      cluster_id: safeStr(ca.cluster_id),
      initiative_title,
      initiative_description: safeStr(r.initiative_description),
      outputs_or_outcomes: safeStr(r.outputs_or_outcomes),
      kpi_present: yesNoNorm(r.KPI_present),
      kpi_list: safeStr(r.KPI_list),
      geography: safeStr(r.geography) || "not stated",
      actors_involved: safeStr(r.actors_involved),
      evidence_file_name: safeStr(r.evidence_file_name) || "NOT STATED",
      evidence_page: safeStr(r.page_primary) || firstPage(r.evidence_page_numbers) || "",
      evidence_quote_15w: safeStr(r.evidence_quote_15w) || safeStr(ca.evidence_quote_15w) || shortQuote15w(r.evidence_excerpt),
      evidence_excerpt: safeStr(r.evidence_excerpt),
    };
  });
}

function normalizeFull(fullRows, companyIndex){
  return fullRows.map(r => {
    const report_id = safeStr(r.report_id);
    const cm = companyIndex.get(report_id) || {};

    return {
      dataset: "FULL (501)",
      initiative_id: safeStr(r.initiative_id),
      report_id,
      company: safeStr(r.company_name_english) || cm.company_name_clean || "NOT STATED",
      industry_sector: cm.industry_sector || "NOT STATED",
      ownership_type: cm.ownership_type || "NOT STATED",
      year_of_report: cm.year_of_report || "NOT STATED",
      collab_type: safeStr(r.collaboration_type) || "NOT STATED",
      esg_block: safeStr(r.ESG_block) || "NOT STATED",
      theme_tag: safeStr(r.theme_tag) || "not_stated",
      cluster_id: "",
      initiative_title: safeStr(r.initiative_title) || "",
      initiative_description: safeStr(r.initiative_description),
      outputs_or_outcomes: safeStr(r.outputs_or_outcomes),
      kpi_present: yesNoNorm(r.KPI_present),
      kpi_list: safeStr(r.KPI_list),
      geography: safeStr(r.geography) || "not stated",
      actors_involved: safeStr(r.actors_involved),
      evidence_file_name: safeStr(r.evidence_file_name) || cm.file_name || "NOT STATED",
      evidence_page: firstPage(r.evidence_page_numbers) || "",
      evidence_quote_15w: shortQuote15w(r.evidence_excerpt),
      evidence_excerpt: safeStr(r.evidence_excerpt),
    };
  });
}

function computeCounts(rows, field){
  const m = new Map();
  for (const r of rows){
    const k = safeStr(r[field]) || "NOT STATED";
    m.set(k, (m.get(k)||0) + 1);
  }
  const out = Array.from(m.entries()).map(([k,v])=>({k,v}));
  out.sort((a,b)=>b.v-a.v);
  return out;
}

function chartDestroySafe(ch){
  if (ch && typeof ch.destroy === "function") ch.destroy();
}

let STATE = {
  allClean: [],
  allFull: [],
  companyIndex: new Map(),
  top10: [],
  mech: [],
  partner: [],
  datasetMode: "CLEAN (111)",
  filtered: [],
  charts: { collab:null, esg:null, theme:null, mechanism:null, partner:null },
  choices: {},
};

function renderKPIs(){
  const rows = STATE.filtered;
  $("kpiInitiatives").textContent = formatNum(rows.length);

  const companies = new Set(rows.map(r=>r.company));
  $("kpiCompanies").textContent = formatNum(companies.size);

  $("kpiBG").textContent = formatNum(rows.filter(r=>r.collab_type==="BG").length);
  $("kpiBN").textContent = formatNum(rows.filter(r=>r.collab_type==="BN").length);
  $("kpiBS").textContent = formatNum(rows.filter(r=>r.collab_type==="BS").length);

  // BB only meaningful in FULL
  const bb = rows.filter(r=>r.collab_type==="BB").length;
  $("kpiBB") ? ($("kpiBB").textContent = formatNum(bb)) : null;
}

function renderCharts(){
  const rows = STATE.filtered;

  // Collaboration chart
  const cCounts = computeCounts(rows, "collab_type");
  chartDestroySafe(STATE.charts.collab);
  STATE.charts.collab = new Chart($("chartCollab"), {
    type: "bar",
    data: { labels: cCounts.map(x=>x.k), datasets: [{ label:"Initiatives", data: cCounts.map(x=>x.v) }] },
    options: { responsive:true, plugins:{ legend:{ display:false } }, scales:{ x:{ grid:{display:false}}, y:{ beginAtZero:true } } }
  });

  // ESG chart
  const eCounts = computeCounts(rows, "esg_block");
  chartDestroySafe(STATE.charts.esg);
  STATE.charts.esg = new Chart($("chartESG"), {
    type: "bar",
    data: { labels: eCounts.map(x=>x.k), datasets: [{ label:"Initiatives", data: eCounts.map(x=>x.v) }] },
    options: { responsive:true, plugins:{ legend:{ display:false } }, scales:{ x:{ grid:{display:false}}, y:{ beginAtZero:true } } }
  });

  // Theme chart (top 12)
  const tCounts = computeCounts(rows, "theme_tag").slice(0,12);
  chartDestroySafe(STATE.charts.theme);
  STATE.charts.theme = new Chart($("chartTheme"), {
    type: "bar",
    data: { labels: tCounts.map(x=>x.k), datasets: [{ label:"Initiatives", data: tCounts.map(x=>x.v) }] },
    options: { indexAxis:"y", responsive:true, plugins:{ legend:{ display:false } }, scales:{ x:{ beginAtZero:true }, y:{ grid:{ display:false } } } }
  });

  // Mechanism chart (precomputed from CLEAN subset)
  const mech = STATE.mech || [];
  chartDestroySafe(STATE.charts.mechanism);
  STATE.charts.mechanism = new Chart($("chartMechanism"), {
    type: "bar",
    data: { labels: mech.map(r=>safeStr(r.mechanism)), datasets: [{ label:"Count", data: mech.map(r=>toInt(r.initiative_count)) }] },
    options: { indexAxis:"y", responsive:true, plugins:{ legend:{ display:false } }, scales:{ x:{ beginAtZero:true }, y:{ grid:{ display:false } } } }
  });

  // Partner stacked (precomputed from CLEAN subset; counts are edges/mentions)
  const partner = STATE.partner || [];
  const collabs = uniq(partner.map(r=>r.collab_type_short));
  const ptypes = uniq(partner.map(r=>r.partner_type));

  const datasets = ptypes.map(pt => ({
    label: pt,
    data: collabs.map(c => {
      const row = partner.find(r => safeStr(r.collab_type_short)===c && safeStr(r.partner_type)===pt);
      return row ? toInt(row.count) : 0;
    }),
    stack: "stack1",
  }));

  chartDestroySafe(STATE.charts.partner);
  STATE.charts.partner = new Chart($("chartPartner"), {
    type: "bar",
    data: { labels: collabs, datasets },
    options: {
      responsive:true,
      plugins:{ legend:{ position:"bottom" } },
      scales:{ x:{ stacked:true, grid:{display:false} }, y:{ stacked:true, beginAtZero:true } }
    }
  });
}

function renderTopPatterns(){
  const wrap = $("topPatterns");
  wrap.innerHTML = "";

  const rows = STATE.top10 || [];
  for (const r of rows){
    const label = safeStr(r.pattern_label) || `Cluster ${safeStr(r.cluster_id)}`;
    const card = document.createElement("div");
    card.className = "card p-4";
    card.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="text-sm muted">Pattern</div>
          <div class="text-base font-semibold">${label}</div>
          <div class="mt-2 flex flex-wrap gap-2">
            <span class="badge">n=${safeStr(r.n)}</span>
            <span class="badge">${safeStr(r.dominant_collab_type) || "—"}</span>
            <span class="badge">${safeStr(r.dominant_esg_block) || "—"}</span>
            <span class="badge">${safeStr(r.dominant_partner_type) || "—"}</span>
          </div>
        </div>
        <button class="btn btn-primary" data-cluster="${safeStr(r.cluster_id)}">View examples</button>
      </div>
      <div class="mt-3 text-sm"><span class="muted">Top theme:</span> ${safeStr(r.top_theme) || "NOT STATED"}</div>
      <div class="mt-2 text-sm"><span class="muted">Mechanisms:</span> ${safeStr(r.top_mechanisms) || "NOT STATED"}</div>
    `;
    wrap.appendChild(card);
  }

  wrap.querySelectorAll("button[data-cluster]").forEach(btn => {
    btn.addEventListener("click", () => {
      const cid = btn.getAttribute("data-cluster") || "";
      $("tabPatterns").click();
      if (STATE.choices.cluster){
        STATE.choices.cluster.setChoiceByValue(cid);
      }
      $("pageNum").value = 1;
      filterRows();
      $("examplesModal").classList.remove("hidden");
      renderExamplesModal(cid);
    });
  });
}

function renderExamplesModal(clusterId){
  const cid = safeStr(clusterId);
  const modalTitle = $("examplesTitle");
  const modalBody = $("examplesBody");

  const top = (STATE.top10 || []).find(r => safeStr(r.cluster_id) === cid);
  modalTitle.textContent = top ? (safeStr(top.pattern_label) || `Cluster ${cid}`) : `Cluster ${cid}`;

  if (STATE.datasetMode !== "CLEAN (111)"){
    modalBody.innerHTML = `
      <div class="muted">Pattern clusters are computed on CLEAN (111). Switch dataset to CLEAN to browse cluster-filtered initiatives.</div>
      <div class="mt-3 text-sm"><span class="muted">Examples (from summary):</span><br>${top ? safeStr(top.example_initiatives_with_evidence) : "NOT FOUND"}</div>
    `;
    return;
  }

  const rows = STATE.filtered.filter(r => safeStr(r.cluster_id) === cid).slice(0, 25);
  const parts = [];
  parts.push(`<div class="text-sm muted">Showing up to 25 initiatives in this pattern (filtered).</div>`);
  if (top && safeStr(top.example_initiatives_with_evidence)){
    parts.push(`<div class="mt-2 text-sm"><span class="muted">Summary examples:</span> ${safeStr(top.example_initiatives_with_evidence)}</div>`);
  }
  parts.push("<div class='hr my-3'></div>");

  for (const r of rows){
    const cite = `${r.evidence_file_name} | p${r.evidence_page} | ${r.evidence_quote_15w || ""}`;
    parts.push(`
      <div class="card p-3 mb-3">
        <div class="flex items-start justify-between gap-2">
          <div class="font-semibold">${r.company}</div>
          <div class="flex gap-2">
            <span class="badge">${r.collab_type}</span>
            <span class="badge">${r.esg_block}</span>
            <span class="badge">${r.theme_tag.replaceAll("_"," ")}</span>
          </div>
        </div>
        <div class="mt-2 text-sm">${r.initiative_title || "(no title)"}</div>
        <div class="mt-2 text-xs muted">Evidence: ${cite}</div>
        <div class="mt-2">
          <button class="btn btn-primary" data-copy="${encodeURIComponent(cite)}">Copy citation</button>
        </div>
      </div>
    `);
  }

  modalBody.innerHTML = parts.join("");
  modalBody.querySelectorAll("button[data-copy]").forEach(b => {
    b.addEventListener("click", async ()=>{
      const txt = decodeURIComponent(b.getAttribute("data-copy"));
      try{ await navigator.clipboard.writeText(txt); showToast("Copied."); }
      catch(e){ showToast("Copy failed."); }
    });
  });
}

function renderTable(){
  const rows = STATE.filtered;
  const pageSize = Number($("pageSize").value) || 20;
  const page = Number($("pageNum").value) || 1;
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const cur = Math.min(Math.max(page, 1), totalPages);
  $("pageNum").value = cur;

  const start = (cur-1)*pageSize;
  const slice = rows.slice(start, start+pageSize);

  $("pageInfo").textContent = `Page ${cur} / ${totalPages} • Rows ${formatNum(rows.length)}`;

  const tbody = $("tableBody");
  tbody.innerHTML = "";
  for (const r of slice){
    const cite = `${r.evidence_file_name} | p${r.evidence_page} | ${r.evidence_quote_15w || ""}`;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="text-xs">${r.initiative_id}</td>
      <td>${r.company}</td>
      <td class="text-sm"><span class="badge">${r.collab_type}</span></td>
      <td class="text-sm"><span class="badge">${r.esg_block}</span></td>
      <td class="text-xs">${r.theme_tag}</td>
      <td class="text-sm font-medium">${r.initiative_title || "(no title)"}</td>
      <td class="text-xs">${r.kpi_present}</td>
      <td class="text-xs">${r.geography}</td>
      <td class="text-xs">${r.evidence_file_name}<br><span class="muted">p${r.evidence_page}</span></td>
      <td class="text-xs muted">${r.evidence_quote_15w || ""}</td>
      <td class="text-xs">
        <button class="btn btn-primary" data-copy="${encodeURIComponent(cite)}">Copy</button>
      </td>
    `;
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll("button[data-copy]").forEach(b => {
    b.addEventListener("click", async ()=>{
      const txt = decodeURIComponent(b.getAttribute("data-copy"));
      try{ await navigator.clipboard.writeText(txt); showToast("Copied."); }
      catch(e){ showToast("Copy failed."); }
    });
  });
}

function downloadFiltered(){
  const rows = STATE.filtered;
  if (!rows.length){ showToast("No rows to download."); return; }

  const cols = [
    "dataset","initiative_id","report_id","company","industry_sector","ownership_type","year_of_report",
    "collab_type","esg_block","theme_tag","cluster_id","initiative_title","initiative_description","outputs_or_outcomes",
    "kpi_present","kpi_list","geography","actors_involved","evidence_file_name","evidence_page","evidence_quote_15w","evidence_excerpt"
  ];

  const csv = Papa.unparse(rows.map(r=>{
    const o={};
    for (const c of cols) o[c]= (r[c] ?? "");
    return o;
  }));

  const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `filtered_initiatives_${STATE.datasetMode.startsWith("FULL") ? "full" : "clean"}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function renderAll(){
  $("datasetNote").textContent =
    STATE.datasetMode === "FULL (501)"
      ? "FULL dataset selected (501 rows). Pattern summaries/mechanisms/partner-types are computed on CLEAN subset."
      : "CLEAN subset selected (111 rows). Pattern summaries/mechanisms/partner-types align to this subset.";

  renderKPIs();
  renderCharts();
  renderTable();
  renderTopPatterns();
}

function filterRows(){
  const all = (STATE.datasetMode === "FULL (501)") ? STATE.allFull : STATE.allClean;

  const collab = STATE.choices.collab?.getValue(true) || [];
  const esg = STATE.choices.esg?.getValue(true) || [];
  const sector = STATE.choices.sector?.getValue(true) || [];
  const theme = STATE.choices.theme?.getValue(true) || [];
  const company = STATE.choices.company?.getValue(true) || [];
  const cluster = STATE.choices.cluster?.getValue(true) || [];
  const kpi = $("kpiFilter").value;
  const q = safeStr($("searchBox").value).toLowerCase();

  const out = all.filter(r => {
    if (collab.length && !collab.includes(r.collab_type)) return false;
    if (esg.length && !esg.includes(r.esg_block)) return false;
    if (sector.length && !sector.includes(r.industry_sector)) return false;
    if (theme.length && !theme.includes(r.theme_tag)) return false;
    if (company.length && !company.includes(r.company)) return false;

    if (STATE.datasetMode === "CLEAN (111)" && cluster.length && !cluster.includes(r.cluster_id)) return false;

    if (kpi !== "ALL" && r.kpi_present !== kpi) return false;

    if (q){
      const hay = (r.initiative_title + " " + r.initiative_description + " " + r.actors_involved + " " + r.evidence_excerpt).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  STATE.filtered = out;
  renderAll();
}

function setupTabs(){
  const tabs = [
    {btn:"tabOverview", panel:"panelOverview"},
    {btn:"tabPatterns", panel:"panelPatterns"},
    {btn:"tabLibrary", panel:"panelLibrary"},
    {btn:"tabMethods", panel:"panelMethods"},
  ];
  for (const t of tabs){
    $(t.btn).addEventListener("click", ()=>{
      for (const x of tabs){
        $(x.btn).classList.toggle("active", x.btn===t.btn);
        $(x.panel).classList.toggle("hidden", x.panel!==t.panel);
      }
    });
  }
}

function setupFiltersOnce(allClean, allFull){
  const pool = allClean.concat(allFull);

  const collab = uniq(pool.map(r=>r.collab_type));
  const esg = uniq(pool.map(r=>r.esg_block));
  const sector = uniq(pool.map(r=>r.industry_sector));
  const theme = uniq(pool.map(r=>r.theme_tag));
  const company = uniq(pool.map(r=>r.company));
  const cluster = uniq(allClean.map(r=>r.cluster_id).filter(Boolean));

  function fillSelect(id, options, placeholder){
    const sel = $(id);
    sel.innerHTML = "";
    for (const opt of options){
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt;
      sel.appendChild(o);
    }
    if (STATE.choices[id]) STATE.choices[id].destroy();
    STATE.choices[id] = new Choices(sel, {
      removeItemButton: true,
      shouldSort: true,
      placeholder: true,
      placeholderValue: placeholder,
      searchPlaceholderValue: "Type to search…",
      itemSelectText: "",
    });
  }

  fillSelect("collabFilter", collab, "Collaboration type");
  fillSelect("esgFilter", esg, "ESG block");
  fillSelect("sectorFilter", sector, "Industry sector");
  fillSelect("themeFilter", theme, "Theme tag");
  fillSelect("companyFilter", company, "Company");
  fillSelect("clusterFilter", cluster, "Cluster (clean only)");

  STATE.choices.collab = STATE.choices["collabFilter"];
  STATE.choices.esg = STATE.choices["esgFilter"];
  STATE.choices.sector = STATE.choices["sectorFilter"];
  STATE.choices.theme = STATE.choices["themeFilter"];
  STATE.choices.company = STATE.choices["companyFilter"];
  STATE.choices.cluster = STATE.choices["clusterFilter"];

  // default selections
  STATE.choices.collab.setChoiceByValue(collab);
  STATE.choices.esg.setChoiceByValue(esg);

  ["collabFilter","esgFilter","sectorFilter","themeFilter","companyFilter","clusterFilter"].forEach(id=>{
    $(id).addEventListener("change", ()=>{ $("pageNum").value = 1; filterRows(); });
  });
  $("kpiFilter").addEventListener("change", ()=>{ $("pageNum").value = 1; filterRows(); });
  $("searchBox").addEventListener("input", ()=>{ $("pageNum").value = 1; filterRows(); });

  $("datasetMode").addEventListener("change", ()=>{
    STATE.datasetMode = $("datasetMode").value;

    // FULL has no cluster ids -> clear cluster filter
    if (STATE.datasetMode === "FULL (501)" && STATE.choices.cluster){
      STATE.choices.cluster.removeActiveItems();
    }

    $("pageNum").value = 1;
    filterRows();
  });

  $("resetBtn").addEventListener("click", ()=>{
    STATE.choices.collab.removeActiveItems();
    STATE.choices.esg.removeActiveItems();
    STATE.choices.sector.removeActiveItems();
    STATE.choices.theme.removeActiveItems();
    STATE.choices.company.removeActiveItems();
    STATE.choices.cluster.removeActiveItems();

    STATE.choices.collab.setChoiceByValue(collab);
    STATE.choices.esg.setChoiceByValue(esg);

    $("kpiFilter").value = "ALL";
    $("searchBox").value = "";
    $("datasetMode").value = "CLEAN (111)";
    STATE.datasetMode = "CLEAN (111)";
    $("pageNum").value = 1;

    filterRows();
    showToast("Filters reset.");
  });

  $("downloadBtn").addEventListener("click", downloadFiltered);

  $("pagePrev").addEventListener("click", ()=>{
    $("pageNum").value = Math.max(1, (Number($("pageNum").value)||1) - 1);
    renderTable();
  });
  $("pageNext").addEventListener("click", ()=>{
    $("pageNum").value = (Number($("pageNum").value)||1) + 1;
    renderTable();
  });
  $("pageNum").addEventListener("change", renderTable);
  $("pageSize").addEventListener("change", ()=>{ $("pageNum").value = 1; renderTable(); });

  $("modalClose").addEventListener("click", ()=> $("examplesModal").classList.add("hidden"));
  $("examplesBackdrop").addEventListener("click", ()=> $("examplesModal").classList.add("hidden"));
}

async function main(){
  setLoading(true);
  try{
    const [
      companyRows,
      clusterAssignRows,
      initCleanRows,
      initFullRows,
      top10Rows,
      mechRows,
      partnerRows,
    ] = await Promise.all([
      parseCSV(DATA.companyMaster),
      parseCSV(DATA.clusterAssign),
      parseCSV(DATA.initiativesClean),
      parseCSV(DATA.initiativesFull),
      parseCSV(DATA.top10),
      parseCSV(DATA.mech),
      parseCSV(DATA.partner),
    ]);

    STATE.companyIndex = buildCompanyIndex(companyRows);
    const clusterAssignMap = buildClusterAssignMap(clusterAssignRows);

    STATE.allClean = normalizeClean(initCleanRows, STATE.companyIndex, clusterAssignMap);
    STATE.allFull = normalizeFull(initFullRows, STATE.companyIndex);

    STATE.top10 = top10Rows;
    STATE.mech = mechRows;
    STATE.partner = partnerRows;

    setupTabs();
    setupFiltersOnce(STATE.allClean, STATE.allFull);

    STATE.datasetMode = "CLEAN (111)";
    $("datasetMode").value = STATE.datasetMode;

    filterRows();
  } catch(e){
    console.error(e);
    $("fatalError").classList.remove("hidden");
    $("fatalErrorText").textContent = String(e);
  } finally {
    setLoading(false);
  }
}

document.addEventListener("DOMContentLoaded", main);
