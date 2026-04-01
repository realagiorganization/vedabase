Feature: Dockerized Nintendo DS ROM compilation
  Scenario: Build the ARM9 hymn ROM with the BlocksDS container toolchain
    Given the generated hymn catalog sources are present
    When the devotee runs the Docker ROM build target
    Then the build should use the BlocksDS slim image
    And the Makefile should compile an ARM9 `.nds` ROM artifact
    And the ROM title should remain Vedabase Hymns
