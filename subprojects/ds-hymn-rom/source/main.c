#include <nds.h>
#include <stdio.h>

#include "generated/hymn_catalog.h"

static int current_hymn = 0;
static int current_language = 0;

static void draw_screen(void) {
    iprintf("\x1b[2J");
    iprintf("\x1b[1;1HVedabase Favorites");
    iprintf("\x1b[3;1HUse Left/Right for hymn");
    iprintf("\x1b[4;1HUse Up/Down for language");

    const VedabaseHymnEntry *entry = &vedabase_hymns[current_hymn];

    iprintf("\x1b[6;1H%02d/%02d %s", current_hymn + 1, VEDABASE_HYMN_COUNT, entry->title);
    iprintf("\x1b[7;1HSource: %s", entry->source);
    iprintf("\x1b[8;1HLang: %s", vedabase_languages[current_language]);
    iprintf("\x1b[10;1HTranscription:");
    iprintf("\x1b[11;1H%s", entry->transcription);
    iprintf("\x1b[15;1HTranslation:");
    iprintf("\x1b[16;1H%s", entry->translations[current_language]);
    iprintf("\x1b[21;1HStatic catalog generated from JSON mocks");
    iprintf("\x1b[22;1HBlocksDS ARM9 ROM build");
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
