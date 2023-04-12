
import clear from 'rollup-plugin-clear';
import { visualizer } from 'rollup-plugin-visualizer';
import copy from 'rollup-plugin-copy';
import strip from '@rollup/plugin-strip';
import prettier from 'rollup-plugin-prettier';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import checkManifest from './rollup_plugin/checkManifest.js';

// Determine whether we're in production mode
const isProduction = process.env.NODE_ENV === 'production';

// Use strip plugin for remove logging in production mode
const string_logger = isProduction ? strip({
    debugger: true
}) : undefined;

// Common plugins used in multiple configurations
const commonPlugins = [
    // Resolve Node.js modules for the browser
    nodeResolve({
        browser: true,
    }),
    // Format the output using Prettier
    prettier({
        tabWidth: 2,
        singleQuote: false,
        parser: 'babel',
    }),
    // Conditionally add strip plugin based on the environment
    string_logger,
];

// Function to create clear plugin with specific targets
const commonClearPlugin = (targets) =>
    clear({
        targets,
        watch: true, // Clear directories on --watch mode
    });

// Function to create visualizer plugin with specific filename
const commonVisualizerPlugin = (filename) =>
    visualizer({ filename });

// Common output options for all configurations
const outputOptions = {
    format: 'iife', // Use Immediately Invoked Function Expression format
    sourcemap: !isProduction, // Generate source maps in non-production mode
};

export default [
    {
        input: 'src/js/contentScript.js',
        output: {
            file: 'dist/js/bundle.js',
            ...outputOptions,
        },
        plugins: [
            // Check manifest for localhost text in production mode
            // Pass the path to the manifest.json file
            checkManifest('src/manifest.json'),
            // Use common clear plugin with specific targets
            commonClearPlugin(['dist/']),
            // Add common plugins to the configuration
            ...commonPlugins,
            // Copy static files from the src directory to the dist directory
            copy({
                targets: [
                    { src: 'src/css', dest: 'dist' },
                    { src: 'src/fonts', dest: 'dist' },
                    { src: 'src/images', dest: 'dist' },
                    { src: 'src/manifest.json', dest: 'dist' },
                ]
            }),
            // (put it as the last one) Use common visualizer plugin with specific filename
            commonVisualizerPlugin('stats/chrome-stats.html'),
        ].filter(Boolean), // Filter out any undefined plugins
    },
    {
        input: 'src/options/js/options.js',
        output: {
            file: 'dist/options/js/options.js',
            ...outputOptions,
        },
        plugins: [

            // Use common clear plugin with specific targets
            commonClearPlugin(['dist/options']),
            // Add common plugins to the configuration
            ...commonPlugins,
            copy({
                targets: [
                    // copy the options folder except the js folder
                    { src: ['src/options/*', '!src/options/js/'], dest: 'dist/options/' },
                ]
            }),
            // (put it as the last one) Use common visualizer plugin with specific filename
            commonVisualizerPlugin('stats/chrome-options-stats.html'),
        ].filter(Boolean), // Filter out any undefined plugins
    },

    {
        input: 'src_firefox/js/contentScript.js',
        output: {
            file: 'dist_firefox/js/bundle.js',
            ...outputOptions,
        },
        plugins: [
            // Check manifest for localhost text in production mode
            // Pass the path to the manifest.json file
            checkManifest('src_firefox/manifest.json'),
            // Use common clear plugin with specific targets
            commonClearPlugin(['dist_firefox/']),
            // Add common plugins to the configuration
            ...commonPlugins,
            copy({
                targets: [
                    { src: 'src/css', dest: 'dist_firefox' },
                    { src: 'src/fonts', dest: 'dist_firefox' },
                    { src: 'src/images', dest: 'dist_firefox' },
                    { src: 'src_firefox/js/static', dest: 'dist_firefox/js' },
                    { src: 'src_firefox/manifest.json', dest: 'dist_firefox' },
                ]
            }),
            // (put it as the last one) Use common visualizer plugin with specific filename
            commonVisualizerPlugin('stats/ff-stats.html'),
        ].filter(Boolean), // Filter out any undefined plugins
    },
    {
        input: 'src/options/js/options.js',
        output: {
            file: 'dist_firefox/options/js/options.js',
            ...outputOptions,
        },
        plugins: [
            // Use common clear plugin with specific targets
            commonClearPlugin(['dist_firefox/options']),
            // Add common plugins to the configuration
            ...commonPlugins,
            copy({
                targets: [
                    // copy the options folder except the js folder
                    { src: ['src/options/*', '!src/options/js/'], dest: 'dist_firefox/options/' },
                ]
            }),
            // (put it as the last one) Use common visualizer plugin with specific filename
            commonVisualizerPlugin('stats/ff-options-stats.html'),
        ].filter(Boolean), // Filter out any undefined plugins
    },
];