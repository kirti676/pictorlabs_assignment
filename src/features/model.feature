@model
Feature: Model Page UI Validation
  As a user
  I want to validate the Model page UI elements
  So that I can ensure all model features are correctly displayed

  Background:
    Given the user is logged in to the application
    And the user is on the Dashboard page

  @smoke @ui-validation
  Scenario: Validate Model page navigation
    When the user clicks on the Model navigation button
    Then the URL should contain "/models"
    And the "Model" navigation button should be active
    And the "Model" navigation icon should be displayed
    And the page should display the heading "Organization Models"
    And the page should display the description "Organization Stain Management"

  @ui-validation
  Scenario: Validate total stainers available metric
    When the user clicks on the Model navigation button
    Then the "Stain Management" tab should be displayed
    And the "Stain Management" tab should be selected by default
    And the "Total Stainers Available" metric should be displayed
    And the total stainers count should be displayed

  @ui-validation
  Scenario: Validate Auto Deep Stainer section
    When the user clicks on the Model navigation button
    Then the "Model" navigation button should be active
    And the "Auto Deep Stainer" section should be displayed
    And the following stains should be displayed:
      | Stain Name | Stain Type                    | Version |
      | H&E        | Hematoxylin and Eosin         | v0.1.0  |
      | H&E        | Hematoxylin and Eosin         | v1.0.0  |
      | CD45       | Immunohistochemistry          | v1.0.0  |
    And each stain should have an associated toggle switch
    And the "H&E v0.1.0" toggle switch should be checked

  @ui-validation
  Scenario: Validate Auto Restainer section
    When the user clicks on the Model navigation button
    Then the "Model" navigation button should be active
    And the "Auto Restainer" section should be displayed
    And the following stains should be displayed:
      | Stain Name    | Stain Type              | Version |
      | PanCK-MG-TRT  | Immunohistochemistry    | v1.0.0  |
      | Trichrome     | Special Stain           | v1.0.0  |
    And each stain should have an associated toggle switch
    And the "PanCK-MG-TRT v1.0.0" toggle switch should be checked
