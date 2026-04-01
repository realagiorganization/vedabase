# DS Hymn ROM DEVPLAN

## Completed

- [x] Select BlocksDS Docker slim as the DS homebrew toolchain baseline.
- [x] Add a standalone Makefile, Dockerfile, and dedicated GitHub Actions workflow.
- [x] Generate ARM9 hymn catalog sources from JSON mocks of favorite hymn transcriptions and translations.
- [x] Add mocked generator tests and linting that run independently from the parent Vedabase app.

## Next

- [x] Add executable BDD counterparts for the mocked generator scenarios.
- [x] Increase ROM-facing tests around text paging, language switching, and menu-state generation.
- [x] Add a ROM smoke-test path in CI using melonDS under Xvfb with screenshot, GIF, and MP4 capture publication.
- [x] Add BDD coverage for the ROM compilation contract and emulator launch/capture contract.
- [x] Make the smoke script testable with deterministic injected capture tools so launch orchestration can be verified without a host GUI dependency.
- [x] Add UI-navigation emulator tests that drive melonDS, assert frame changes, and publish the resulting media into the README flow.
- [ ] Connect the mocked presentation model more directly to the ARM9 rendering loop so generator and ROM navigation stay in lockstep.
- [ ] Produce and inspect a real `.nds` artifact locally once the BlocksDS Docker image finishes pulling cleanly.
