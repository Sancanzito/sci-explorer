// utils/articleRoutes.js
import ChemistryModelsPage from '../../Articles/UseofChemModels/ChemistryModelsPage';
import ParticleModelDashboard from '../../Articles/ParticleModelOfMatter/ParticleModelDashboard';
import InvestigationPage from '../../Articles/Investigation/InvestigationPage';

// Map of custom dashboard components for specific article IDs
export const CUSTOM_DASHBOARDS = {
  'chem-models': ChemistryModelsPage,
  'particle-model-matter': ParticleModelDashboard,
  'ScienceSkills': InvestigationPage
};

// Check if an article ID should use a custom dashboard
export const hasCustomDashboard = (articleId) => {
  return !!CUSTOM_DASHBOARDS[articleId];
};

// Get the custom dashboard component for an article ID
export const getCustomDashboard = (articleId) => {
  return CUSTOM_DASHBOARDS[articleId];
};

// List of all valid article IDs (both custom and database)
export const getAllValidArticleIds = (databaseArticles) => {
  const customIds = Object.keys(CUSTOM_DASHBOARDS);
  const databaseIds = databaseArticles?.map(a => a.id) || [];
  return [...new Set([...customIds, ...databaseIds])];
};