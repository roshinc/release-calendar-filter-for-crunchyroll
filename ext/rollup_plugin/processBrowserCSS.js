
import fs from 'fs';
import path from 'path';

export default function processBrowserCSS() {
    return {
        name: 'process-browser-css',
        writeBundle(options, bundle) {
            // Determine browser type based on output directory
            const isFirefox = options.file && options.file.includes('dist_firefox');
            const outputDir = isFirefox ? 'dist_firefox' : 'dist';

            console.log(`Processing CSS for ${isFirefox ? 'Firefox' : 'Chrome'}`);

            // Ensure the css directory exists
            const cssDir = path.join(outputDir, 'css');
            if (!fs.existsSync(cssDir)) {
                fs.mkdirSync(cssDir, { recursive: true });
            }

            // Process fontello.css
            processFontelloCSS(cssDir, isFirefox);

            // Process index.css
            processIndexCSS(cssDir, isFirefox);
        }
    };
}

function processFontelloCSS(cssDir, isFirefox) {
    const cssPath = path.resolve('src/css/fontello.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    let processedCSS;

    if (isFirefox) {
        // Keep only moz-extension URLs for Firefox
        processedCSS = cssContent.replace(
            /src:\s*url\('chrome-extension:\/\/__MSG_@@extension_id__\/fonts\/fontello\.woff2\?40184825'\)\s*format\('woff2'\),\s*/g,
            ''
        );
    } else {
        // Keep only chrome-extension URLs for Chrome
        processedCSS = cssContent.replace(
            /,\s*url\('moz-extension:\/\/__MSG_@@extension_id__\/fonts\/fontello\.woff2\?40184825'\)\s*format\('woff2'\)/g,
            ''
        );
    }

    const outputPath = path.join(cssDir, 'fontello.css');
    fs.writeFileSync(outputPath, processedCSS);
    console.log(`Written processed fontello.css to: ${outputPath}`);
}

function processIndexCSS(cssDir, isFirefox) {
    const cssPath = path.resolve('src/css/index.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    let processedCSS;

    if (isFirefox) {
        // For Firefox: Remove the Chrome-specific CSS variable and keep the Firefox-specific block
        processedCSS = cssContent.replace(
            /--cr-rc-checkmark-svg:\s*url\('chrome-extension:\/\/__MSG_@@extension_id__\/images\/checkmark\.svg'\);/g,
            ''
        );
    } else {
        // For Chrome: Keep the Chrome-specific CSS variable and remove the Firefox-specific block
        processedCSS = cssContent.replace(
            /--cr-rc-checkmark-svg:\s*url\('moz-extension:\/\/__MSG_@@extension_id__\/images\/checkmark\.svg'\);/g,
            ''
        );
    }

    const outputPath = path.join(cssDir, 'index.css');
    fs.writeFileSync(outputPath, processedCSS);
    console.log(`Written processed index.css to: ${outputPath}`);
}