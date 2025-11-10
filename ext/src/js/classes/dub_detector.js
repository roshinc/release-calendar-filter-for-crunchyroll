// dubHelper.js
import {trimIfNotNullString} from "../lib/utils.js";

export default class DubDetector {

    static #patterns = {
        mainDub:
            /^(.*) ?(?:\(([A-Z][a-z]+(?:-(?:[A-Z]{2}))?(?: ?[A-Z][a-z]+)?) Dub\)?)$/,
        // This is a special case for English dubs, which are not marked as such in the season title
        regexp_for_english_dub_special_case: /^(.*) ?(?:\(Dub\)?)$/,
        // This is a special case for the Crunchyroll Anime Awards
        regexp_for_cr_anime_awards:
            /^(?!.*Japanese)(.*) (?:\(([A-Z][a-z]+(?:-(?:[A-Z]{2}))?) Audio\)?)$/,
        // This is a special case for the Crunchyroll Anime Awards english dub
        regexp_for_cr_anime_awards_english_dub:
            /^(The \d{4} Crunchyroll Anime Awards)$/,
        // This is a special case for the Crunchyroll fix of Season 1 titles where they replaced it with the actual
        // language name without the Dub
        regexp_for_cr_season_one_dub_fix: /^(.+?)\s*\(([^)]*(?:\([^)]*\))*[^)]*)\)$/,
    };
    static #languageMapping = {
        "Français": "French",
        "Deutsch": "German",
        "English": "English",
        "中文 (普通话)": "Mandarin",
        "हिंदी": "Hindi",
        "Português (Brasil)": "Portuguese",
        "Português": "Portuguese",
        "Español": "Spanish",
        "Español (América Latina)": "Spanish",
        "Español (España)": "Castilian",
        "Italiano": "Italian",
        "العربية": "Arabic",
        "Русский": "Russian",
        "Polski": "Polish",
        "ไทย": "Thai",
        "தமிழ்": "Tamil",
        "తెలుగు": "Telugu",
        "Catalá": "Catalan",
        "English (India)": "English-IN",
        "Português (Portugal)": "European-Portuguese",
        "普通话": "Mandarin",
        "中文": "Mandarin",
        "Bahasa Indonesia": "Indonesian",
    };

    static #typoCorrectionsLanguageMapping = {
        "Portugese": "Portuguese"
    };


    detect(givenTitle) {
        let response = {
            isDub: false,
            dubLanguage: null,
            forceShowInSubOnlyAlso: false,
            title: trimIfNotNullString(givenTitle),
        }

        // dub info
        const found = response.title.match(DubDetector.#patterns.mainDub);
        response.isDub = found != null;


        if (response.isDub) {
            response.dubLanguage = trimIfNotNullString(found[2]);
            // Replace the spaces in the dub language with dashes
            // for handling languages with multiple words e.g. European Portuguese
            response.dubLanguage = trimIfNotNullString(response.dubLanguage.replaceAll(" ", "-"));

            // Check if the dub language is a typo and correct it if needed
            if (DubDetector.#typoCorrectionsLanguageMapping[response.dubLanguage]) {
                response.dubLanguage = DubDetector.#typoCorrectionsLanguageMapping[response.dubLanguage];
                console.log(`Corrected dub language: ${response.dubLanguage} from original: ${found[2]}`);
            }

            response.title = trimIfNotNullString(found[1]);

            console.log(`Dub info detected: ${response.title} - ${response.dubLanguage}`);
            return response;
        }

        // if it was not detected as a dub, check if it is the special case of the Crunchyroll fix to Season 1 titles
        if (!response.isDub) {
            const found = response.title.match(
                DubDetector.#patterns.regexp_for_cr_season_one_dub_fix
            );

            if (found != null) {
                const rawLang = trimIfNotNullString(found[2]);
                const mappedLang = DubDetector.#languageMapping[rawLang];
                console.log(`Raw language: ${rawLang} - Mapped language: ${mappedLang}`);
                if (mappedLang) {
                    console.log(`CR Season 1 fix detected: ${response.title}`);

                    response.isDub = true;

                    response.dubLanguage = mappedLang;
                    // Replace the spaces in the dub language with dashes
                    // for handling languages with multiple words e.g. European Portuguese
                    response.dubLanguage = response.dubLanguage.replaceAll(" ", "-");
                    response.title = trimIfNotNullString(found[1]);

                    console.log(`CR Season 1 fix special case detected: ${response.title}`);
                    console.log(`Dub language: ${(response.dubLanguage)} from original: ${mappedLang}`);

                    return response;
                }
            }
        }

        // if it was not detected as a dub, check if it is the special case of English dub
        if (!response.isDub) {
            const found = response.title.match(
                DubDetector.#patterns.regexp_for_english_dub_special_case
            );
            response.isDub = found != null;
            if (response.isDub) {
                response.dubLanguage = "English";
                response.title = trimIfNotNullString(found[1]);
                console.log(`English dub special case detected: ${response.title}`);

                return response;
            }
        }

        // if it was not detected as a dub, check if it is the special case of the Crunchyroll Anime Awards
        if (!response.isDub) {
            const found = response.title.match(
                DubDetector.#patterns.regexp_for_cr_anime_awards
            );
            response.isDub = found != null;
            if (response.isDub) {
                response.dubLanguage = trimIfNotNullString(found[2]);
                response.title = trimIfNotNullString(found[1]);
                console.log(
                    `CR Anime Awards special case detected: ${response.title} - ${response.dubLanguage
                    }`
                );

                return response;
            }
        }

        // if it was not detected as a dub, check if it is the special case of the Crunchyroll Anime Awards english dub
        if (!response.isDub) {
            const found = response.title.match(
                DubDetector.#patterns.regexp_for_cr_anime_awards_english_dub
            );
            response.isDub = found != null;
            if (response.isDub) {
                response.dubLanguage = "English";
                response.title = trimIfNotNullString(found[1]);
                console.log(
                    `CR Anime Awards english dub special case detected: ${response.title
                    }`
                );
                // this special case also requires it to be shown in sub only mode
                response.forceShowInSubOnlyAlso = true;

                return response;
            }
        }

        // Trim the title, if it is not null or undefined or empty
        console.log(`Episode ${response.title} - Dub info: ${response.isDub} - ${response.dubLanguage}`);
        return response;
    }


}
