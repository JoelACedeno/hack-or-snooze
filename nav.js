"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}
$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */
function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}
$navLogin.on("click", navLoginClick);


/** When a user first logins in, update the navbar to reflect that. */
function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}


/** when user clicks submit in nav bar, provide form to submit story */
function navSubmitStoryClick(evt) {
  console.debug("navSubmitStoryClick", evt);
  hidePageComponents();
  $submitForm.show();
  $allStoriesList.show();
}
$navSubmitStory.on("click", navSubmitStoryClick);


/** when user clicks on favorites in nav bar show stories in user favorites array */
function navFavoritesClick(evt){
  console.debug("navFavoritesClick", evt);
  hidePageComponents();
  $favoriteStoriesList.show();
  putFavoritesListOnPage();
}
$navFavorites.on("click", navFavoritesClick);


/** when user clicks on my stories in nav bar show stories in user own stories array */
function navMyStoriesClick(evt){
  console.debug("navMyStoriesClick", evt);
  hidePageComponents();
  $ownStories.show();
  putUserStoriesOnPage();
}
$navMyStories.on("click", navMyStoriesClick);