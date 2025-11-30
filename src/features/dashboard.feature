@dashboard
Feature: Dashboard Page UI Validation
  As a user
  I want to validate the Dashboard page UI elements
  So that I can ensure all dashboard features are correctly displayed

  Background:
    Given the user is logged in to the application

  @smoke @regression @ui
  Scenario: Validate Dashboard page is loaded
    Given the user is on the Dashboard page
    Then the URL should be baseUrl
    And the page title should be "Virtual Stain Hub"
    And the "Dashboard" navigation button should be active
    And the "Dashboard" navigation icon should be displayed

  @regression @ui
  Scenario: Validate Slide Overview card under Organization Activity
    Given the user is on the Dashboard page
    Then the "Organization Activity" heading should be displayed
    And the "Slide Overview" card should be displayed
    And the card should have a "Layers icon"
    And the following metrics should be displayed:
      | Metric                      |
      | Total WSI Slides Scanned    |
      | Total VSI Slides Stained    |
      | Total Downloads             |
      | Scanned Slides Quality      |
    And each Slide Overview metric should display a count value
    And the quality metric should show Pass Fail labels
    And a quality progress bar should be displayed

  @regression @ui
  Scenario: Validate Stain Usage Overview card under Organization Activity
    Given the user is on the Dashboard page
    Then the "Organization Activity" heading should be displayed
    And the "Stain Usage Overview" card should be displayed
    And the card should have a "Copy icon"
    And the following stain type cards should be displayed:
      | Stain Type |
      | IHC        |
      | Special    |
      | H&E        |
      | Total      |
    And each stain card should have an icon
    And each stain card should display stain counts for:
      | Status      |
      | Processing  |
      | Completed   |
      | Failed      |
    And a quarter selector dropdown should be displayed
    And a chart area should be displayed

  @regression @ui
  Scenario: Validate Organization Overview section
    Given the user is on the Dashboard page
    Then the "Organization Overview" heading should be displayed
    And the description "All Organization Slides" should be displayed
    And the following tabs should be displayed:
      | Tab Name  |
      | Slides    |
      | Projects  |
    And the "Slides" tab should be selected by default

  @regression @ui
  Scenario: Validate Slides tab fields and controls
    Given the user is on the Dashboard page
    And the user is on the "Slides" tab
    Then a search box should be displayed with placeholder "Search"
    And an "Add Filters" button should be displayed
    And an "Upload Slides" button should be displayed
    And the following action buttons should be displayed:
      | Button Name               | State    |
      | Create / Add to Project   | disabled |
      | Order Stains              | disabled |
      | Override                  | disabled |
    And the slides table should display the following columns:
      | Column Name |
      | Checkbox    |
      | QC          |
      | Slide Name  |
      | Image Type  |
      | Date        |
      | Stains      |
      | Tissue Type |
      | Species     |
    And the following columns should have sort icons:
      | Column Name |
      | Slide Name  |
      | Image Type  |
      | Date        |

  @regression @ui
  Scenario: Validate Add Filters menu options
    Given the user is on the Dashboard page
    And the user is on the "Slides" tab
    When the user clicks on "Add Filters" button
    Then a filter menu should be displayed
    And the following filter options should be available:
      | Filter Option |
      | Tissue Type   |
      | Species       |
      | Image Type    |
      | Stains        |

  @regression @ui
  Scenario: Navigate to Projects tab
    Given the user is on the Dashboard page
    When the user clicks on the "Projects" tab
    Then the "Projects" tab should be selected
    And a search box should be displayed with placeholder "Search"
    Then the projects table should display the following columns:
      | Column Name    |
      | Title          |
      | Creation Date  |
      | Tissue Type    |
      | Stains         |
