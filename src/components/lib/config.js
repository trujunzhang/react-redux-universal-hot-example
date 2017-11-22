/**
 * @summary Kick off the global namespace for Telescope.
 * @namespace Telescope
 */

const Telescope = {};

Telescope.VERSION = '0.27.5-nova';

// ------------------------------------- Config -------------------------------- //

// ------------------------------------- Components -------------------------------- //

Telescope.components = {};

Telescope.registerComponent = (name, component) => {
  Telescope.components[name] = component;
};

Telescope.getComponent = (name) => {
  return Telescope.components[name];
};

export default Telescope;
