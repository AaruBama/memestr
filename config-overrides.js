module.exports = function override(config) {
    // Exclude source maps for problematic dependencies
    config.ignoreWarnings = [
        warning =>
            warning.message.includes('Failed to parse source map') &&
            warning.message.includes('@scure/bip39'),
    ];
    return config;
};
