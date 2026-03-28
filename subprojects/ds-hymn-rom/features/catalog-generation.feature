Feature: Static hymn catalog generation
  Scenario: Build ARM9 catalog sources from hymn JSON mocks
    Given a selected Vedabase hymn catalog mock
    When static source files are generated
    Then the ARM9 header should expose hymn and language counts
    And the snapshot should list each selected hymn title
