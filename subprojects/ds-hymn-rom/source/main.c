#include <nds.h>
#include <nds/arm9/console.h>
#include <stdio.h>

#include "generated/hymn_catalog.h"

static int current_hymn = 0;
static int current_language = 0;

static void draw_screen(void) {
    printf("\x1b[2J");
    printf("\x1b[1;1HVedabase Favorites");
    printf("\x1b[3;1HUse Left/Right for hymn");
    printf("\x1b[4;1HUse Up/Down for language");

    const VedabaseHymnEntry *entry = &vedabase_hymns[current_hymn];

    printf("\x1b[6;1H%02d/%02d %s", current_hymn + 1, VEDABASE_HYMN_COUNT, entry->title);
    printf("\x1b[7;1HSource: %s", entry->source);
    printf("\x1b[8;1HLang: %s", vedabase_languages[current_language]);
    printf("\x1b[10;1HTranscription:");
    printf("\x1b[11;1H%s", entry->transcription);
    printf("\x1b[15;1HTranslation:");
    printf("\x1b[16;1H%s", entry->translations[current_language]);
    printf("\x1b[21;1HStatic catalog generated from JSON mocks");
    printf("\x1b[22;1HBlocksDS ARM9 ROM build");
}

int main(void) {
    consoleDemoInit();
    defaultExceptionHandler();

    draw_screen();

    while (1) {
        swiWaitForVBlank();
        scanKeys();

        int pressed = keysDown();

        if (pressed & KEY_RIGHT) {
            current_hymn = (current_hymn + 1) % VEDABASE_HYMN_COUNT;
            draw_screen();
        }

        if (pressed & KEY_LEFT) {
            current_hymn = (current_hymn + VEDABASE_HYMN_COUNT - 1) % VEDABASE_HYMN_COUNT;
            draw_screen();
        }

        if (pressed & KEY_DOWN) {
            current_language = (current_language + 1) % VEDABASE_LANGUAGE_COUNT;
            draw_screen();
        }

        if (pressed & KEY_UP) {
            current_language = (current_language + VEDABASE_LANGUAGE_COUNT - 1) % VEDABASE_LANGUAGE_COUNT;
            draw_screen();
        }
    }
}
