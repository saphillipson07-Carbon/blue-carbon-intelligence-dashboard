import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { countries, projects, markets, methodologies, news } from '../data';

const ALL = 'All';

// Real, publicly verified national/donor roadmap documents. Only countries
// with a document we could actually verify are listed here — no placeholder
// entries for countries without one yet (see roadmapsNote below the list).
const ROADMAPS = [
  {
    country: 'Indonesia',
    title: 'Partnership for Market Readiness (PMR) — Indonesia',
    publisher: 'World Bank / PMR',
    year: '2012–ongoing',
    description:
      'World Bank-administered technical assistance (approved 2012, ~US$5.7M) that helped Indonesia design market-based mitigation instruments — carbon tax, cap-and-trade, MRV systems — laying the groundwork for today’s IDXCarbon exchange.',
    url: 'https://www.thepmr.org/country/indonesia',
  },
  {
    country: 'Indonesia',
    title: 'Indonesia Mangroves for Coastal Resilience Project (M4CR, P178009)',
    publisher: 'World Bank',
    year: '2022',
    description:
      'IBRD loan (US$400M) plus a US$15M grant to rehabilitate and sustainably manage mangrove landscapes across four priority areas, strengthen mangrove policy and institutions, and improve livelihoods for mangrove-dependent communities, implemented with Indonesia’s Peatland and Mangrove Restoration Agency (BRGM).',
    url: 'https://documents1.worldbank.org/curated/en/793041653404341879/pdf/Indonesia-Mangroves-for-Coastal-Resilience-Project.pdf',
  },
  {
    country: 'Viet Nam',
    title: 'Vietnam Partnership for Market Implementation (PMI) — Project Information Document',
    publisher: 'World Bank',
    year: '2022',
    description:
      'Project Information Document outlining World Bank support for Vietnam’s domestic Emissions Trading System and National Crediting Program, including MRV and registry system design.',
    url: 'https://documents1.worldbank.org/curated/en/099715001242241040/pdf/Project0Inform0ementation000P178165.pdf',
  },
  {
    country: 'Viet Nam',
    title: 'Pathways to Low-Carbon Development for Viet Nam',
    publisher: 'Asian Development Bank',
    year: '2016',
    description:
      'ADB study modeling 63 emission-reduction measures across power, industry, transport and households, finding Vietnam could cut emissions by 53% by 2050 relative to a business-as-usual baseline, much of it at low or negative cost.',
    url: 'https://www.adb.org/sites/default/files/publication/389826/pathways-low-carbon-devt-viet-nam.pdf',
  },
];

// Aggregates every real source/citation already present across the app's
// own data files into one deduplicated, searchable list. Nothing here is
// authored separately — it stays in sync with the underlying data by
// construction.
function buildSourceLibrary() {
  const items = [];
  const seen = new Set();
  const add = (category, label, url) => {
    if (!url || !label || seen.has(url)) return;
    seen.add(url);
    items.push({ category, label, url });
  };

  countries.forEach((c) => {
    (c.sources || []).forEach((s) => add('Country records', s.label, s.url));
    const bc = c.blue_carbon || {};
    Object.keys(bc).forEach((k) => {
      if (k.endsWith('_source')) {
        add('Country records', bc[`${k}_label`] || `${c.country} — ${k.replace('_source', '')}`, bc[k]);
      }
    });
  });
  projects.forEach((p) => add('Projects', p.source_label || p.project_id, p.source));
  markets.forEach((m) => add('Carbon markets', m.source_label || m.market_name, m.source));
  methodologies.forEach((m) => add('Methodologies', m.source_label || m.name, m.source));
  news.forEach((n) => add('News', n.headline, n.source));

  return items;
}

export default function DocumentLibrary() {
  const navigate = useNavigate();
  const { t } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(ALL);

  const library = useMemo(buildSourceLibrary, []);
  const categories = useMemo(() => [...new Set(library.map((i) => i.category))], [library]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return library.filter((i) => {
      if (categoryFilter !== ALL && i.category !== categoryFilter) return false;
      if (q && !i.label.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [library, search, categoryFilter]);

  return (
    <>
      <button className="btn" onClick={() => navigate('/')}>{t('common.back')}</button>

      <div className="section">{t('docLibrary.section')}</div>
      <div className="card pad">
        <div className="title">{t('docLibrary.title')}</div>
        <div className="sub">{t('docLibrary.sub')}</div>
      </div>

      <div className="section">{t('docLibrary.primerSection')}</div>
      <div className="card pad">
        <div className="title">What is Article 6?</div>
        <div className="sub" style={{ marginTop: 6, lineHeight: 1.6 }}>
          Article 6 of the Paris Agreement lets countries voluntarily cooperate to reduce greenhouse gas
          emissions in pursuit of their Nationally Determined Contributions (NDCs). It allows one country
          to help finance or host emission-reduction activity in another and count some of the resulting
          reduction toward its own climate target — provided both countries agree and the same reduction
          isn't counted twice.
        </div>

        <div className="title" style={{ marginTop: 18 }}>Article 6.2 vs Article 6.4</div>
        <div className="sub" style={{ marginTop: 6, lineHeight: 1.6 }}>
          Article 6.2 covers direct, bilateral or multilateral cooperation: two governments agree on their
          own terms to transfer "Internationally Transferred Mitigation Outcomes" (ITMOs), reported under
          UN accounting guidance but without a central UN-run approval process. Article 6.4 replaces the
          older Clean Development Mechanism (CDM) with a centralized, UN-supervised crediting mechanism —
          projects are approved and credits ("A6.4ERs") are issued through a single international registry,
          with tighter rules on additionality and permanence than the CDM had.
        </div>

        <div className="title" style={{ marginTop: 18 }}>What is a carbon market?</div>
        <div className="sub" style={{ marginTop: 6, lineHeight: 1.6 }}>
          A carbon market is a system for buying and selling the right to emit greenhouse gases, or credits
          representing a verified emissions reduction or removal. Compliance markets are created by
          regulation — a national or regional emissions trading system, or the Article 6 mechanisms above —
          and legally obligate covered entities to hold enough allowances or credits to cover their
          emissions. Voluntary markets let any buyer purchase credits, verified by independent standards
          bodies such as Verra or Gold Standard, with no regulatory obligation to do so.
        </div>

        <div className="title" style={{ marginTop: 18 }}>What is blue carbon?</div>
        <div className="sub" style={{ marginTop: 6, lineHeight: 1.6 }}>
          Blue carbon is the carbon captured and stored by coastal and marine ecosystems — principally
          mangroves, seagrass meadows and tidal salt marshes. These ecosystems sequester carbon at a much
          higher rate per hectare than most terrestrial forests and store most of it in waterlogged soils,
          where it can stay locked away for centuries if the ecosystem is left undisturbed. Restoring or
          protecting them can generate carbon credits under standards with an approved blue carbon
          methodology, such as Verra's VM0033.
        </div>

        <div className="title" style={{ marginTop: 18 }}>How they connect</div>
        <div className="sub" style={{ marginTop: 6, lineHeight: 1.6 }}>
          A blue carbon project — a mangrove restoration effort, for instance — generates verified emission
          reductions or removals under a crediting standard. Those credits can be sold on the voluntary
          market to any buyer, or, where the host country has an operational Article 6 framework and has
          authorized the transfer, converted into ITMOs counted toward another country's NDC under Article
          6.2, or issued as A6.4ERs through the centralized Article 6.4 mechanism. Whether a given blue
          carbon credit can move through Article 6 depends entirely on the host country's own domestic
          authorization status — which is why Country Explorer tracks each country's Article 6 framework
          and authorization status separately from its project activity.
        </div>
      </div>

      <div className="section">{t('docLibrary.roadmapsSection')}</div>
      <div className="sub" style={{ marginBottom: 8 }}>{t('docLibrary.roadmapsSub')}</div>
      {ROADMAPS.map((r) => (
        <a
          key={r.url}
          className="list-row"
          href={r.url}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none', alignItems: 'flex-start' }}
        >
          <div className="list-row-main">
            <div className="list-row-title">{r.title}</div>
            <div className="list-row-sub">{r.country} · {r.publisher} · {r.year}</div>
            <div className="sub" style={{ marginTop: 4 }}>{r.description}</div>
          </div>
          <div style={{ fontSize: '.62rem', color: 'var(--blue)', fontWeight: 700, whiteSpace: 'nowrap' }}>
            {t('docLibrary.viewSource')}
          </div>
        </a>
      ))}
      <div className="sub" style={{ marginTop: 4 }}>{t('docLibrary.roadmapsNote')}</div>

      <div className="section">{t('docLibrary.sourcesSection')}</div>
      <div className="sub" style={{ marginBottom: 8 }}>{t('docLibrary.sourcesSub')}</div>

      <div className="search-row">
        <input
          className="search-input"
          placeholder={t('docLibrary.searchPlaceholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select-input"
          style={{ flex: 1, marginBottom: 0 }}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value={ALL}>{t('docLibrary.allCategories')}</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="sub" style={{ marginBottom: 8 }}>
        {t('docLibrary.matchingSection', { n: filtered.length, total: library.length })}
      </div>

      {filtered.length === 0 && (
        <div className="card pad"><div className="sub">{t('docLibrary.noResults')}</div></div>
      )}

      {filtered.map((i) => (
        <a
          key={i.url}
          className="list-row"
          href={i.url}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <div className="list-row-main">
            <div className="list-row-title">{i.label}</div>
            <div className="list-row-sub">{i.category}</div>
          </div>
          <div style={{ fontSize: '.62rem', color: 'var(--blue)', fontWeight: 700, whiteSpace: 'nowrap' }}>
            {t('docLibrary.viewSource')}
          </div>
        </a>
      ))}
    </>
  );
}
