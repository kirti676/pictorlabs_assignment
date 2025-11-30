@reports
Feature: Reports Page UI Validation
  As a user
  I want to validate the Reports page UI elements
  So that I can ensure reporting features are correctly displayed

  Background:
    Given the user is logged in to the application
    And the user is on the Dashboard page

  @smoke @ui-validation
  Scenario: Validate Reports page navigation
    When the user clicks on the Reports navigation button
    Then the URL should contain "/reports"
    And the "Reports" navigation button should be active
    And the "Reports" navigation icon should be displayed
    And the page should display the heading "Organization Reports"
    And the page should display the description "Entire organization's Detailed Documents"

  @ui-validation
  Scenario: Validate STAINS tab
    When the user clicks on the Reports navigation button
    Then the following tabs should be displayed:
      | Tab Name |
      | STAINS   |
      | USERS    |
    And the "STAINS" tab should be selected by default
    And the page should display "Number of stains Organization completed over the past 365 days"
    And the Year dropdown should be displayed
    And the Year dropdown should show the current year
    And the "Download Usage Report" button should be displayed

  @ui-validation
  Scenario: Validate STAINS tab stain type details section
    When the user clicks on the Reports navigation button
    Then the "Stain Type Details" heading should be displayed
    And the following stain type sections should be displayed:
      | Stain Type              |
      | Immunohistochemistry    |
      | Hematoxylin and Eosin   |
      | Special Stain           |
    And each stain type should have an expandable section
    And each stain type should display a collapse/expand icon
    And each stain type should show "Quarter" label

  @ui-validation
  Scenario: Validate USERS tab
    When the user clicks on the Reports navigation button
    And the user clicks on the "USERS" tab
    Then the "USERS" tab should be selected
    And the search box should be displayed
    And the search box should have placeholder "Search by name or email"
    And a list of users should be displayed
    And each user entry should display:
      | Field         |
      | Avatar/Initial|
      | Name          |
      | Email address |
    And the pagination controls should be displayed
    And the current page number should be highlighted

  @ui-validation
  Scenario: Validate user details view
    When the user clicks on the Reports navigation button
    And the user clicks on the "USERS" tab
    And the user clicks on "View User" for the first user
    Then the user details section should expand
    And the Quarter selector should be displayed
    And the "Monthly Stain Distribution" chart section should be displayed
    And the "QC Results" section should be displayed
    And the "Activity Summary" section should be displayed
    And the Activity Summary should display:
      | Metric        |
      | Total Stains  |
      | QC Slides     |
    And the "Stain Types" heading should be displayed
