@dashboard @smoke
Feature: Dashboard
  As a logged in user
  I want to access the dashboard
  So that I can view my Organization Activity

  Background:
    Given I am logged in to the application

  @positive
  Scenario: View dashboard after login
    When I navigate to the dashboard
    Then I should see the dashboard page
    And I should see my user information

  @positive
  Scenario: Navigate through menu items
    Given I am on the dashboard
    When I click on a menu item "Projects"
    Then I should see the "Projects" page

  @positive
  Scenario: Logout from dashboard
    Given I am on the dashboard
    When I click on the user profile menu
    And I click the logout button
    Then I should be redirected to the login page
    And I should not be able to access the dashboard
