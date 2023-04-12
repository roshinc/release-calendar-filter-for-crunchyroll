/**
 * @fileoverview Check if the manifest.json contains "localhost" in the production build,
 *  and also check if the manifest.json is a valid JSON.
 */
import fs from 'fs';
import path from 'path';
import { createFilter } from '@rollup/pluginutils';

export default function checkManifest(options = {}) {
    const filter = createFilter(options.include, options.exclude);

    return {
        name: 'check-manifest',
        async buildStart() {
            const manifestPath = options.manifestPath || 'src/manifest.json';
            const absoluteManifestPath = path.resolve(process.cwd(), manifestPath);

            // Read manifest.json content
            const manifestContent = await fs.promises.readFile(absoluteManifestPath, 'utf-8');

            let parsedManifest;

            // Check if the manifest content is valid JSON
            try {
                parsedManifest = JSON.parse(manifestContent);
            } catch (error) {
                this.error('Manifest.json is not a valid JSON.');
            }

            // Check if 'localhost' is present in the manifestContent
            if (manifestContent.includes('localhost')) {
                this.error('Manifest.json contains "localhost" in the production build.');
            }
        },
    };
}
