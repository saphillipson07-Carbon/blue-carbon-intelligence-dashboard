import countries from './countries.json';
import bilateral from './bilateral_agreements.json';
import projects from './projects.json';
import news from './news.json';
import markets from './markets.json';
import methodologies from './methodologies.json';

export const STATUS_COLS = {
  'DNA appointed': 'dna_appointed',
  'Article 6 framework': 'article6_framework',
  'Domestic carbon market': 'domestic_carbon_market',
  'Bilateral agreements': 'bilateral_agreements',
  'Blue carbon in NDCs': 'blue_carbon_ndc',
  'Article 6 authorizations': 'article6_authorization',
  'ITMOs issued': 'itmos_issued',
  'Active blue carbon projects': 'active_blue_carbon_projects',
};

export { countries, bilateral, projects, news, markets, methodologies };

export function findCountry(name) {
  return countries.find((c) => c.country === name);
}

export function projectsForCountry(name) {
  return projects.filter((p) => p.country === name);
}

export function findProject(id) {
  return projects.find((p) => p.project_id === id);
}
