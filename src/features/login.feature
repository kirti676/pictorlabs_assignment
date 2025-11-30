@login
Feature: User Login
  As a user
  I want to login to the application
  So that I can access the dashboard

  Background:
    Given I am on the login page

  @smoke @regression @positive @ui
  Scenario: Successful login with valid credentials
    When I enter valid credentials
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see the header component

  @regression @negative @ui
  Scenario: Failed login with invalid credentials
    When I enter invalid credentials
    And I click the login button
    Then I should see an error message
    And I should remain on the login page

  @regression @negative @ui
  Scenario Outline: Failed login with missing credentials
    When I enter username "<username>"
    And I enter password "<password>"
    And I click the login button
    Then I should see an error message "<errorMessage>"

    Examples:
      | username                           | password        | errorMessage                                                 |
      | pictor.newqa.guest@pictorlabs.ai   |                 | Password is required                                         |
      |                                    | MUT!RHrc6a!@4Fp | Please enter an email address                                |
      |                                    |                 | Please enter an email address, Password is required          |
