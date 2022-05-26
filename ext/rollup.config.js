
import clear from 'rollup-plugin-clear'
import { visualizer } from "rollup-plugin-visualizer";
import copy from 'rollup-plugin-copy'
import strip from '@rollup/plugin-strip';
import prettier from 'rollup-plugin-prettier';

export default {
    input: 'src/js/contentScript.js',
    output: {
        file: 'dist/js/bundle.js',
        format: 'iife'
    },
    plugins: [
        clear({
            // required, point out which directories should be clear.
            targets: ['dist'],
            // optional, whether clear the directores when rollup recompile on --watch mode.
            watch: true, // default: false
        }),
        strip({
            debugger: true
        }),
        prettier({
            tabWidth: 2,
            singleQuote: false,
            parser: 'babel',
        }),
        copy({
            targets: [
                { src: 'src/css', dest: 'dist' },
                { src: 'src/fonts', dest: 'dist' },
                { src: 'src/images', dest: 'dist' },
                { src: 'src/options', dest: 'dist' },
                { src: 'src/manifest.json', dest: 'dist' },
            ]
        }),
        // put it the last one
        visualizer(),
    ],


};