Feature: Emulator smoke launch and capture
  Scenario: Launch the compiled hymn ROM under melonDS and record media
    Given a compiled Vedabase hymn ROM
    When the emulator smoke script starts under Xvfb
    Then boot and steady frames should be captured
    And a smoke MP4 and GIF should be produced
    And the ARM9 screen text should instruct hymn and language navigation
