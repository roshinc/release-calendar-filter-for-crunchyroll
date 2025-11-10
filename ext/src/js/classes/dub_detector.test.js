import {beforeEach, describe, expect, it} from 'vitest';
import DubDetector from './dub_detector.js';
import {ALL_DUB_LANGUAGES} from "../lib/constants.js";

describe('DubDetector', () => {
    let detector;

    beforeEach(() => {
        detector = new DubDetector();
    });

    describe('Standard Dub Pattern', () => {
        it('should detect English dub', () => {
            const result = detector.detect('Attack on Titan (English Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('English');
            expect(result.title).toBe('Attack on Titan');
            expect(result.forceShowInSubOnlyAlso).toBe(false);
        });

        it('should detect Spanish dub', () => {
            const result = detector.detect('My Hero Academia (Spanish Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Spanish');
            expect(result.title).toBe('My Hero Academia');
        });

        it('should detect French dub', () => {
            const result = detector.detect('Demon Slayer (French Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('French');
            expect(result.title).toBe('Demon Slayer');
        });

        it('should detect German dub', () => {
            const result = detector.detect('One Piece (German Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('German');
            expect(result.title).toBe('One Piece');
        });

        it('should handle multi-word dub languages', () => {
            const result = detector.detect('Naruto (European Portuguese Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('European-Portuguese');
            expect(result.title).toBe('Naruto');
        });
        it('should detect dubs with season numbers', () => {
            const result = detector.detect('Rent-a-Girlfriend: Season 4 (English Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('English');
            expect(result.title).toBe('Rent-a-Girlfriend: Season 4');
        });
        it('should handle Season2 without space', () => {
            const result = detector.detect('A Couple of Cuckoos Season2 (French Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('French');
            expect(result.title).toBe('A Couple of Cuckoos Season2');
        });
        it('should handle Castilian dub', () => {
            const result = detector.detect('The Rising of the Shield Hero Season 4 (Castilian Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Castilian');
            expect(result.title).toBe('The Rising of the Shield Hero Season 4');
        });
        it('should handle Russian dub', () => {
            const result = detector.detect('The Rising of the Shield Hero Season 4 (Russian Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Russian');
            expect(result.title).toBe('The Rising of the Shield Hero Season 4');
        });
        it('should handle Italian dub', () => {
            const result = detector.detect('DAN DA DAN Season 2 (Italian Dub)');

            expect(result.isDub).toBe(true);
            expect(result.dubLanguage).toBe('Italian');
            expect(result.title).toBe('DAN DA DAN Season 2');
        });
        it('should handle Indonesian dub', () => {
            const result = detector.detect('Campfire Cooking in Another World with My Absurd Skill Season 2 (Bahasa Indonesia)');

            expect(result.isDub).toBe(true);
            expect(result.dubLanguage).toBe('Indonesian');
            expect(result.title).toBe('Campfire Cooking in Another World with My Absurd Skill Season 2');
        });
        it('should handle titles with ordinal season numbers', () => {
            const result = detector.detect('Reborn as a Vending Machine, I Now Wander the Dungeon 2nd Season (German Dub)');

            expect(result.isDub).toBe(true);
            expect(result.dubLanguage).toBe('German');
            expect(result.title).toBe('Reborn as a Vending Machine, I Now Wander the Dungeon 2nd Season');
        });
        it('should handle long titles with multiple clauses', () => {
            const result = detector.detect('I Was Reincarnated as the 7th Prince so I Can Take My Time Perfecting My Magical Ability 2nd Season (French Dub)');

            expect(result.isDub).toBe(true);
            expect(result.dubLanguage).toBe('French');
            expect(result.title).toBe('I Was Reincarnated as the 7th Prince so I Can Take My Time Perfecting My Magical Ability 2nd Season');
        });
    });

    describe('English Dub Special Case', () => {
        it('should detect (Dub) as English', () => {
            const result = detector.detect('Jujutsu Kaisen (Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('English');
            expect(result.title).toBe('Jujutsu Kaisen');
        });

        it('should handle (Dub) without parentheses in title', () => {
            const result = detector.detect('Tokyo Revengers (Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('English');
            expect(result.title).toBe('Tokyo Revengers');
        });
    });

    describe('CR Anime Awards Special Cases', () => {
        it('should detect Audio format for non-Japanese languages', () => {
            const result = detector.detect('The 2024 Crunchyroll Anime Awards (English Audio)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('English');
            expect(result.title).toBe('The 2024 Crunchyroll Anime Awards');
        });

        it('should detect bare Anime Awards title as English dub', () => {
            const result = detector.detect('The 2024 Crunchyroll Anime Awards');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('English');
            expect(result.title).toBe('The 2024 Crunchyroll Anime Awards');
            expect(result.forceShowInSubOnlyAlso).toBe(true);
        });
    });

    describe('Season 1 Fix - Language Name Mapping', () => {
        it('should map Français to French', () => {
            const result = detector.detect('Sword Art Online (Français)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('French');
            expect(result.title).toBe('Sword Art Online');
        });

        it('should map Deutsch to German', () => {
            const result = detector.detect('Bleach (Deutsch)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('German');
            expect(result.title).toBe('Bleach');
        });

        it('should map Español to Spanish', () => {
            const result = detector.detect('Dragon Ball Z (Español)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Spanish');
            expect(result.title).toBe('Dragon Ball Z');
        });

        it('should map Español (América Latina) to Spanish', () => {
            const result = detector.detect('One Punch Man (Español (América Latina))');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Spanish');
            expect(result.title).toBe('One Punch Man');
        });

        it('should map Español (España) to Castilian', () => {
            const result = detector.detect('Fullmetal Alchemist (Español (España))');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Castilian');
            expect(result.title).toBe('Fullmetal Alchemist');
        });

        it('should map Italiano to Italian', () => {
            const result = detector.detect('Hunter x Hunter (Italiano)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Italian');
            expect(result.title).toBe('Hunter x Hunter');
        });

        it('should map Português (Brasil) to Portuguese', () => {
            const result = detector.detect('Steins;Gate (Português (Brasil))');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Portuguese');
            expect(result.title).toBe('Steins;Gate');
        });

        it('should map Português to Portuguese', () => {
            const result = detector.detect('Code Geass (Português)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Portuguese');
            expect(result.title).toBe('Code Geass');
        });

        it('should map Português (Portugal) to European-Portuguese', () => {
            const result = detector.detect('Death Note (Português (Portugal))');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('European-Portuguese');
            expect(result.title).toBe('Death Note');
        });

        it('should map 中文 (普通话) to Mandarin', () => {
            const result = detector.detect('Mob Psycho 100 (中文 (普通话))');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Mandarin');
            expect(result.title).toBe('Mob Psycho 100');
        });

        it('should map हिंदी to Hindi', () => {
            const result = detector.detect('Chainsaw Man (हिंदी)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Hindi');
            expect(result.title).toBe('Chainsaw Man');
        });

        it('should map العربية to Arabic', () => {
            const result = detector.detect('Spy x Family (العربية)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Arabic');
            expect(result.title).toBe('Spy x Family');
        });

        it('should map Русский to Russian', () => {
            const result = detector.detect('Vinland Saga (Русский)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Russian');
            expect(result.title).toBe('Vinland Saga');
        });

        it('should map Polski to Polish', () => {
            const result = detector.detect('Tokyo Ghoul (Polski)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Polish');
            expect(result.title).toBe('Tokyo Ghoul');
        });

        it('should map ไทย to Thai', () => {
            const result = detector.detect('Fire Force (ไทย)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Thai');
            expect(result.title).toBe('Fire Force');
        });

        it('should map தமிழ் to Tamil', () => {
            const result = detector.detect('Dr. Stone (தமிழ்)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Tamil');
            expect(result.title).toBe('Dr. Stone');
        });

        it('should map Catalá to Catalan', () => {
            const result = detector.detect('The Promised Neverland (Catalá)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Catalan');
            expect(result.title).toBe('The Promised Neverland');
        });

        it('should map English (India) to English-IN', () => {
            const result = detector.detect('Horimiya (English (India))');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('English-IN');
            expect(result.title).toBe('Horimiya');
        });
    });

    describe('Season 1 Fix - Language Name Mapping (Real Titles)', () => {
        it('should map Français in Season 1 titles', () => {
            const result = detector.detect('May I Ask for One Final Thing? Season 1 (Français)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('French');
            expect(result.title).toBe('May I Ask for One Final Thing? Season 1');
        });

        it('should map Deutsch in Season 1 titles', () => {
            const result = detector.detect('May I Ask for One Final Thing? Season 1 (Deutsch)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('German');
            expect(result.title).toBe('May I Ask for One Final Thing? Season 1');
        });

        it('should map (Español (América Latina))', () => {
            const result = detector.detect('May I Ask for One Final Thing? Season 1 (Español (América Latina))');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Spanish');
            expect(result.title).toBe('May I Ask for One Final Thing? Season 1');
        });

        it('should map िंदी (Telugu)', () => {
            const result = detector.detect('Mechanical Marie Season 1 (తెలుగు)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Telugu');
            expect(result.title).toBe('Mechanical Marie Season 1');
        });

        it('should map తెలుగు (Hindi)', () => {
            const result = detector.detect('May I Ask for One Final Thing? Season 1 (हिंदी)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Hindi');
            expect(result.title).toBe('May I Ask for One Final Thing? Season 1');
        });

        it('should map (Português (Brasil))', () => {
            const result = detector.detect('May I Ask for One Final Thing? Season 1 (Português (Brasil))');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Portuguese');
            expect(result.title).toBe('May I Ask for One Final Thing? Season 1');
        });

        it('should map English in Season 1 format', () => {
            const result = detector.detect('May I Ask for One Final Thing? Season 1 (English)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('English');
            expect(result.title).toBe('May I Ask for One Final Thing? Season 1');
        });

        it('should map (中文 (普通话)) (Mandarin)', () => {
            const result = detector.detect('Dragon Raja -The Blazing Dawn- Dragon Raja II -The Mourner\'s Eyes- (中文 (普通话))');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Mandarin');
            expect(result.title).toBe('Dragon Raja -The Blazing Dawn- Dragon Raja II -The Mourner\'s Eyes-');
        });

        it('should map (中文 (普通话)) in simpler format', () => {
            const result = detector.detect('The Fated Magical Princess: Who Made Me a Princess Season 1 (中文 (普通话))');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Mandarin');
            expect(result.title).toBe('The Fated Magical Princess: Who Made Me a Princess Season 1');
        });
    });

    describe('Complex Title Formats', () => {
        it('should handle titles with multiple parentheses and language tag', () => {
            const result = detector.detect('Rascal Does Not Dream of Bunny Girl Senpai Rascal Does Not Dream of Santa Claus (English Dub) (English)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('English');
            expect(result.title).toBe('Rascal Does Not Dream of Bunny Girl Senpai Rascal Does Not Dream of Santa Claus (English Dub)');
        });

        it('should handle titles with multiple parentheses and French', () => {
            const result = detector.detect('Rascal Does Not Dream of Bunny Girl Senpai Rascal Does Not Dream of Santa Claus (French Dub) (Français)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('French');
            expect(result.title).toBe('Rascal Does Not Dream of Bunny Girl Senpai Rascal Does Not Dream of Santa Claus (French Dub)');
        });

        it('should handle titles with colons and dashes', () => {
            const result = detector.detect('Kaguya-sama: Love is War (English Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('English');
            expect(result.title).toBe('Kaguya-sama: Love is War');
        });

        it('should handle titles with episode ranges', () => {
            const result = detector.detect('SPY x FAMILY (Eps 38+)');

            expect(result.isDub).toBe(false);
            expect(result.title).toBe('SPY x FAMILY (Eps 38+)');
        });

        it('should handle titles with exclamation marks', () => {
            const result = detector.detect('My Friend\'s Little Sister Has It In for Me! Season 1');

            expect(result.isDub).toBe(false);
            expect(result.title).toBe('My Friend\'s Little Sister Has It In for Me! Season 1');
        });

        it('should handle titles with asterisks', () => {
            const result = detector.detect('Watari-kun\'s ****** Is about to Collapse');

            expect(result.isDub).toBe(false);
            expect(result.title).toBe('Watari-kun\'s ****** Is about to Collapse');
        });

        it('should handle titles with asterisks and dub', () => {
            const result = detector.detect('Watari-kun\'s ****** Is about to Collapse (English Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('English');
            expect(result.title).toBe('Watari-kun\'s ****** Is about to Collapse');
        });
    });

    describe('Special Character Titles', () => {
        it('should handle titles with special Unicode characters', () => {
            const result = detector.detect('You and Idol Precure ♪');

            expect(result.isDub).toBe(false);
            expect(result.title).toBe('You and Idol Precure ♪');
        });

        it('should handle titles with multiple dashes and special formatting', () => {
            const result = detector.detect('Dragon Raja -The Blazing Dawn- Dragon Raja II -The Mourner\'s Eyes- (中文 (普通话))');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Mandarin');
            expect(result.title).toBe('Dragon Raja -The Blazing Dawn- Dragon Raja II -The Mourner\'s Eyes-');
        });
    });

    describe('Typo Handling', () => {
        it('should handle Portugese typo in dub format', () => {
            const result = detector.detect('My Dress-Up Darling Season 2 (Portugese Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Portuguese');
            expect(result.title).toBe('My Dress-Up Darling Season 2');
        });

        it('should handle Portugese in language mapping format', () => {
            const result = detector.detect('Nyaight of the Living Cat (Portugese Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Portuguese');
            expect(result.title).toBe('Nyaight of the Living Cat');
        });
    });

    describe('Non-Dub Content', () => {
        it('should not detect regular subbed content as dub', () => {
            const result = detector.detect('A Gatherer\'s Adventure in Isekai Season 1');

            expect(result.isDub).toBe(false);
            expect(result.dubLanguage).toBeNull();
            expect(result.title).toBe('A Gatherer\'s Adventure in Isekai Season 1');
        });

        it('should preserve original title for non-dub content', () => {
            const result = detector.detect('Kaguya-sama: Love is War');

            expect(result.isDub).toBe(false);
            expect(result.title).toBe('Kaguya-sama: Love is War');
        });

        it('should handle titles with parentheses that are not dubs', () => {
            const result = detector.detect('Re:Zero (Starting Life in Another World)');

            // This should NOT match because "Starting Life in Another World" is not in the language mapping
            expect(result.isDub).toBe(false);
            expect(result.title).toBe('Re:Zero (Starting Life in Another World)');
        });

        it('should handle titles with numbers', () => {
            const result = detector.detect('Kingdom Season 6');

            expect(result.isDub).toBe(false);
            expect(result.title).toBe('Kingdom Season 6');
        });

        it('should handle One Piece with episode range', () => {
            const result = detector.detect('One Piece: Egghead Island (1123-Current)');

            expect(result.isDub).toBe(false);
            expect(result.title).toBe('One Piece: Egghead Island (1123-Current)');
        });
    });

    describe('Edge Cases', () => {
        it('should trim whitespace from titles', () => {
            const result = detector.detect('  My Hero Academia (English Dub)  ');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('English');
            expect(result.title).toBe('My Hero Academia');
        });

        it('should trim leading and trailing whitespace', () => {
            const result = detector.detect('  DAN DA DAN Season 2 (English Dub)  ');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('English');
            expect(result.title).toBe('DAN DA DAN Season 2');
        });

        it('should handle empty strings', () => {
            const result = detector.detect('');

            expect(result.isDub).toBe(false);
            expect(result.title).toBe('');
        });

        it('should replace spaces with dashes in dub language', () => {
            const result = detector.detect('Anime Title (European Portuguese Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('European-Portuguese');
        });
        it('should handle TOUGEN ANKI with Portuguese dub', () => {
            const result = detector.detect('TOUGEN ANKI (Portuguese Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Portuguese');
            expect(result.title).toBe('TOUGEN ANKI');
        });
        it('should handle TOUGEN ANKI without dub', () => {
            const result = detector.detect('TOUGEN ANKI');

            expect(result.isDub).toBe(false);
            expect(result.title).toBe('TOUGEN ANKI');
        });
        it('should handle Crunchyroll Presents titles', () => {
            const result = detector.detect('Crunchyroll Presents: The Anime Effect Season 2');

            expect(result.isDub).toBe(false);
            expect(result.title).toBe('Crunchyroll Presents: The Anime Effect Season 2');
        });
        it('should handle WITCH WATCH with dub', () => {
            const result = detector.detect('WITCH WATCH (English Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('English');
            expect(result.title).toBe('WITCH WATCH');
        });

        it('should handle WITCH WATCH without dub', () => {
            const result = detector.detect('WITCH WATCH');

            expect(result.isDub).toBe(false);
            expect(result.title).toBe('WITCH WATCH');
        });
        it('should handle titles with exclamation marks and parentheses', () => {
            const result = detector.detect('I Left my A-Rank Party to Help My Former Students Reach the Dungeon Depths! (Hindi Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Hindi');
            expect(result.title).toBe('I Left my A-Rank Party to Help My Former Students Reach the Dungeon Depths!');
        });
        it('should handle titles with extra spaces before dub marker', () => {
            const result = detector.detect('Solo Camping for Two (Portuguese Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Portuguese');
            expect(result.title).toBe('Solo Camping for Two');
        });

        it('should handle titles with extra spaces before parentheses', () => {
            const result = detector.detect('Lord of Mysteries  (English Dub)');
            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('English');
            expect(result.title).toBe('Lord of Mysteries');
        });
    });

    describe('Priority and Pattern Matching Order', () => {
        it('should prioritize main dub pattern over special cases', () => {
            // If a title has both formats, main pattern should win
            const result = detector.detect('Show Name (Spanish Dub)');

            expect(result.isDub).toBe(true);
            expect(ALL_DUB_LANGUAGES.includes(result.dubLanguage)).toBe(true);
            expect(result.dubLanguage).toBe('Spanish');
            expect(result.title).toBe('Show Name');
        });
    });
});
