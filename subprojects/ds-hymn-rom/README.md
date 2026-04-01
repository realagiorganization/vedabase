# DS Hymn ROM

`subprojects/ds-hymn-rom` is a self-contained Nintendo DS homebrew workspace for
Vedabase hymn favorites.

It uses the BlocksDS ARM9-only ROM template model and a Dockerized build flow
based on the recommended `skylyrac/blocksds:slim-latest` toolchain image. The
ROM content is statically generated from JSON mocks that describe selected hymn
transcriptions plus translations in multiple languages.

## Commands

```bash
cd subprojects/ds-hymn-rom
make install
make verify
make docker-build-rom
make emulator-smoke EMULATOR_BIN=/path/to/melonDS
```

## Layout

- `data/hymn-catalog.mock.json`: mock hymn selections and translations.
- `scripts/`: static catalog generator and validation logic.
- `source/`: Nintendo DS ARM9 source, including generated catalog code.
- `tests/`: generator, catalog contract, and BDD counterpart tests.

## CI Scope

The repository root workflow [`.github/workflows/ds-hymn-rom.yml`](/home/standart/vedabase/.github/workflows/ds-hymn-rom.yml)
is dedicated to this subproject. It runs linting, mocked tests, the Docker ROM
build, and a `melonDS` smoke lane that records screenshots plus a short GIF/MP4
capture under `Xvfb`.

## Published Emulator Media

The emulator lane uploads an artifact on every run and publishes stable media on
`main` to the dedicated `ds-hymn-rom-media` branch so this README can point at
fixed URLs without storing binaries in the main source branch.

![Latest emulator boot frame](https://raw.githubusercontent.com/realagiorganization/vedabase/ds-hymn-rom-media/subprojects/ds-hymn-rom/media/latest/boot-frame.png)

![Latest emulator steady frame](https://raw.githubusercontent.com/realagiorganization/vedabase/ds-hymn-rom-media/subprojects/ds-hymn-rom/media/latest/steady-frame.png)

![Latest emulator smoke GIF](https://raw.githubusercontent.com/realagiorganization/vedabase/ds-hymn-rom-media/subprojects/ds-hymn-rom/media/latest/smoke.gif)

Latest smoke video: [smoke.mp4](https://raw.githubusercontent.com/realagiorganization/vedabase/ds-hymn-rom-media/subprojects/ds-hymn-rom/media/latest/smoke.mp4)

## Published UI Navigation Test Media

The UI interaction lane sends deterministic input to melonDS, captures the UI
before and after navigation, and records a short clip for README review.

![UI initial frame](https://raw.githubusercontent.com/realagiorganization/vedabase/ds-hymn-rom-media/subprojects/ds-hymn-rom/media/latest/ui-initial.png)

![UI after hymn navigation](https://raw.githubusercontent.com/realagiorganization/vedabase/ds-hymn-rom-media/subprojects/ds-hymn-rom/media/latest/ui-after-right.png)

![UI after language navigation](https://raw.githubusercontent.com/realagiorganization/vedabase/ds-hymn-rom-media/subprojects/ds-hymn-rom/media/latest/ui-after-down.png)

![UI navigation GIF](https://raw.githubusercontent.com/realagiorganization/vedabase/ds-hymn-rom-media/subprojects/ds-hymn-rom/media/latest/ui-navigation.gif)

Latest UI navigation video: [ui-navigation.mp4](https://raw.githubusercontent.com/realagiorganization/vedabase/ds-hymn-rom-media/subprojects/ds-hymn-rom/media/latest/ui-navigation.mp4)
