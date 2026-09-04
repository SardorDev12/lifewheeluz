// Monorepo-aware Metro config: watch the workspace root (so edits in
// packages/shared are picked up) and let Metro resolve dependencies
// hoisted to the workspace root's node_modules, per Expo's own
// monorepo guide.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
