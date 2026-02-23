let initiatives = [];
let companies = [];
let currentLang = "EN";

let collabChart, esgChart, mechChart;

const translations = {
  EN: {
    title: "ESG Collaboration Mapping",
    subtitle: "Chinese Companies • BRICS+ Focus",
    initiatives: "Initiatives",
    companies: "Companies",
    collabDist: "Collaboration Distribution",
    esgDist: "ESG Block Distribution",
    mechDist: "Top Mechanism Signals"
  },
  RU: {
    title: "Карта ESG Сотрудничества",
    subtitle: "Китайские компании • Фокус BRICS+",
    initiatives: "Инициативы",
    companies: "Компании",
    collabDist: "Распределение типов сотрудничества",
    esgDist: "Распределение ESG блоков",
    mechDist: "Основные механизмы"
  }
};

function loadCSV(path) {
  return new Promise((resolve) => {
    Papa.parse(path, {
      download: true,
      header: true,
      complete: (results) => resolve(results.data)
    });
  });
}

async function init() {
  initiatives = await loadCSV("data/initiatives.csv");
  companies = await loadCSV("data/company_master_clean.csv");

  populateSectorFilter();
  attachEvents();
  updateDashboard();
}

function populateSectorFilter() {
  const sectorSelect = document.getElementById("sectorFilter");
  const sectors = [...new Set(companies.map(c => c.sector).filter(Boolean))];

  sectorSelect.innerHTML = `<option value="ALL">All</option>`;
  sectors.forEach(sec => {
    sectorSelect.innerHTML += `<option value="${sec}">${sec}</option>`;
  });
}

function attachEvents() {
  document.getElementById("collabFilter").addEventListener("change", updateDashboard);
  document.getElementById("esgFilter").addEventListener("change", updateDashboard);
  document.getElementById("sectorFilter").addEventListener("change", updateDashboard);
  document.getElementById("resetBtn").addEventListener("click", resetFilters);
  document.getElementById("darkToggle").addEventListener("click", toggleDark);
  document.getElementById("langToggle").addEventListener("click", toggleLanguage);
}

function resetFilters() {
  document.getElementById("collabFilter").value = "ALL";
  document.getElementById("esgFilter").value = "ALL";
  document.getElementById("sectorFilter").value = "ALL";
  updateDashboard();
}

function toggleDark() {
  document.body.classList.toggle("dark");
}

function toggleLanguage() {
  currentLang = currentLang === "EN" ? "RU" : "EN";
  applyTranslations();
}

function applyTranslations() {
  const t = translations[currentLang];
  document.getElementById("title").innerText = t.title;
  document.getElementById("subtitle").innerText = t.subtitle;
  document.querySelector(".kpi-card:nth-child(1) label").innerText = t.initiatives;
  document.querySelector(".kpi-card:nth-child(2) label").innerText = t.companies;
  document.querySelector("#collabChart").parentElement.querySelector("h3").innerText = t.collabDist;
  document.querySelector("#esgChart").parentElement.querySelector("h3").innerText = t.esgDist;
  document.querySelector("#mechChart").parentElement.querySelector("h3").innerText = t.mechDist;
}

function getFilteredData() {
  const collab = document.getElementById("collabFilter").value;
  const esg = document.getElementById("esgFilter").value;
  const sector = document.getElementById("sectorFilter").value;

  let filtered = initiatives.filter(row => row.report_id);

  if (collab !== "ALL") {
    filtered = filtered.filter(r => r.collaboration_type === collab);
  }

  if (esg !== "ALL") {
    filtered = filtered.filter(r => r.esg_block === esg);
  }

  if (sector !== "ALL") {
    const sectorCompanies = companies
      .filter(c => c.sector === sector)
      .map(c => c.report_id);

    filtered = filtered.filter(r => sectorCompanies.includes(r.report_id));
  }

  return filtered;
}

function updateKPIs(data) {
  document.getElementById("kpiInitiatives").innerText = data.length;

  const uniqueCompanies = new Set(data.map(d => d.report_id));
  document.getElementById("kpiCompanies").innerText = uniqueCompanies.size;

  const bn = data.filter(d => d.collaboration_type === "BN").length;
  const bg = data.filter(d => d.collaboration_type === "BG").length;
  const bs = data.filter(d => d.collaboration_type === "BS").length;

  document.getElementById("kpiBN").innerText = bn;
  document.getElementById("kpiBG").innerText = bg;
  document.getElementById("kpiBS").innerText = bs;
}

function renderChart(chartRef, ctx, type, labels, values) {
  if (chartRef) chartRef.destroy();

  return new Chart(ctx, {
    type: type,
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: "#2563eb"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: type !== "pie" ? { y: { beginAtZero: true } } : {}
    }
  });
}

function updateCharts(data) {
  const collabCounts = {
    BN: data.filter(d => d.collaboration_type === "BN").length,
    BG: data.filter(d => d.collaboration_type === "BG").length,
    BS: data.filter(d => d.collaboration_type === "BS").length
  };

  const esgCounts = {
    E: data.filter(d => d.esg_block === "E").length,
    S: data.filter(d => d.esg_block === "S").length,
    G: data.filter(d => d.esg_block === "G").length,
    X: data.filter(d => d.esg_block === "X").length
  };

  collabChart = renderChart(collabChart,
    document.getElementById("collabChart"),
    "bar",
    Object.keys(collabCounts),
    Object.values(collabCounts)
  );

  esgChart = renderChart(esgChart,
    document.getElementById("esgChart"),
    "bar",
    Object.keys(esgCounts),
    Object.values(esgCounts)
  );

  const mechCounts = {};
  data.forEach(d => {
    if (d.mechanism_tag) {
      mechCounts[d.mechanism_tag] = (mechCounts[d.mechanism_tag] || 0) + 1;
    }
  });

  const sorted = Object.entries(mechCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  mechChart = renderChart(mechChart,
    document.getElementById("mechChart"),
    "bar",
    sorted.map(s => s[0]),
    sorted.map(s => s[1])
  );
}

function updateDashboard() {
  const filtered = getFilteredData();
  updateKPIs(filtered);
  updateCharts(filtered);
}

init();
