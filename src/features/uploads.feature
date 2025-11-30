@uploads
Feature: Uploads Page UI Validation
  As a user
  I want to validate the Uploads page UI elements
  So that I can ensure slide upload features are correctly displayed

  Background:
    Given the user is logged in to the application
    And the user is on the Dashboard page

  @smoke @ui-validation
  Scenario: Validate Uploads page navigation
    When the user clicks on the Uploads navigation button
    Then the URL should contain "/uploads"
    And the "Uploads" navigation button should be active
    And the "Uploads" navigation icon should be displayed
    And the page should display the heading "Slide Upload Dashboard"
    And the page should display the description "Slide Management Dashboard"

  @ui-validation
  Scenario: Validate UPLOAD tab
    When the user clicks on the Uploads navigation button
    Then the following tabs should be displayed:
      | Tab Name     |
      | UPLOAD       |
      | IN PROGRESS  |
      | COMPLETED    |
    And the "UPLOAD" tab should be selected by default
    And the page should display the heading "Upload Slides"
    And the page should display upload instructions
    And the upload guidelines section should be displayed
    And the following guidelines should be displayed:
      | Guideline                                                                       |
      | Ensure slides are properly labeled before upload                                |
      | Uploaded slides may be auto-processed based on your organization's staining rules |
      | For large batches, please allow a few minutes for processing to begin          |

  @ui-validation
  Scenario: Validate drag and drop upload area
    When the user clicks on the Uploads navigation button
    Then the "UPLOAD" tab should be selected by default
    And the drag and drop area should be displayed
    And an upload icon should be displayed in the drag and drop area
    And the area should display "Choose files or drag and drop files here"
    And the supported formats should be displayed: "czi, tif, tiff, svs, qptiff, mtiff.tar, ome.tiff, ome.tif, ndpi, mar"
    And the maximum file size should be displayed: "40 GB per file"
    And the "Upload" button should be displayed in the upload area

  @ui-validation
  Scenario: Navigate to In Progress tab
    When the user clicks on the Uploads navigation button
    And the user clicks on the "IN PROGRESS" tab
    Then the "IN PROGRESS" tab should be selected
    And the page should display the heading "Slide Upload(s) In Progress"
    And the description should state "Your files are uploading in the background. You may continue using the dashboard while this completes. Fully uploaded slides will automatically appear in your workspace."

  @ui-validation
  Scenario: Navigate to Completed tab
    When the user clicks on the Uploads navigation button
    And the user clicks on the "COMPLETED" tab
    Then the "COMPLETED" tab should be selected
    And the page should display the heading "Slide Upload History"
    And the page should display the description "View slide(s) upload history, either batch upload or individual."

  @ui-validation
  Scenario: Validate tab switching functionality
    When the user clicks on the Uploads navigation button
    And the user switches between tabs
    Then the selected tab should be highlighted
    And the appropriate content for the selected tab should be displayed
    And the URL should remain "/uploads"
