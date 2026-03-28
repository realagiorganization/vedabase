Feature: Mocked Nintendo DS hymn navigation
  Scenario: Switch to a selected hymn and translation language
    Given the generated Vedabase hymn catalog
    When the devotee selects the next hymn and the Spanish translation
    Then the display model should expose the chosen hymn title
    And the translation pages should include the Spanish text
    And the generated lines should fit DS-sized pages
