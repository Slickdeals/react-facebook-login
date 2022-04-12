module.exports = {
  core: {
    builder: 'webpack5'
  },
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: ['@storybook/addon-a11y', 'storybook-dark-mode'],
  typescript: {
    reactDocgen: 'none'
  }
};