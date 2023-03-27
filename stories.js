"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteButton = false) {
  // console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();

  const showFavorite = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${showDeleteButton ? getDeleteButtonHTML() : ""}
        ${showFavorite ? getHTMLStar(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** creates the html for delete button that will be used in story elements (li') */
function getDeleteButtonHTML(){
  return `
    <span class="trash-can">
      <i class="fas fa-trash-alt"></i>
    </span>`;
}


/** creates the html for favorite button (star) to be used in story elements (li's) 
 * if favorite => change class to fill in the star, if not do opposite
*/
function getHTMLStar(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}


/** Gets list of stories from server, generates their HTML, and puts on page. */
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}



/** submits new story to api and changes HTML markup*/
async function submitNewStory(evt) {
  console.debug("submitNewStory");
  evt.preventDefault();

  const author = $("#create-author").val();
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const username = currentUser.username;
  const storyData = {title, author, url, username};
  
  //post new story to the api 
  const story = await storyList.addStory(currentUser, storyData);

  //put new story in the html
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  //reset story submission form
  $submitForm.trigger("reset");
  $submitForm.slideUp();
}
$submitForm.on("submit", submitNewStory);


/** show stories posted by user */
async function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");
  $ownStories.empty();

  //if no stories written by user show <h5> message, otherwise fill $ownStories element with stories written by user
  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    for (let story of currentUser.ownStories){
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
}


/** show stories favorited by user*/
async function putFavoritesListOnPage() {
  console.debug("putFavoritesListOnPage");
  $favoriteStoriesList.empty();

  //if no stories favorited by user show <h5>message, otherwise fill $favoriteStoriesList element with stories favorited by user
  if (currentUser.favorites.length === 0){
    $favoriteStoriesList.append("<h5>No Favorites Added!</h5>")
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteStoriesList.append($story);
    }
  }
  $favoriteStoriesList.show();
}


/** toggle favorite when clicking on the favorite buttton (star) */
async function toggleFavorite(evt){
  console.debug("toggleFavorite");
  const $target = $(evt.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // if story element has the filled star(favorited) class when clicked, remove from favorites & switch the class. Vice versa
  if ($target.hasClass("fas")){
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}
$storiesLists.on("click", ".star", toggleFavorite);


/** delete user's story when clicking on the delete button (trash can) */
async function deleteStory(evt) {
  console.debug("deleteStory");
  const $target = $(evt.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");

  //run the remove story function and put the rest of the user's stories back on the page
  await storyList.removeStory(currentUser, storyId);
  await putUserStoriesOnPage();
}
$ownStories.on("click", ".trash-can", deleteStory);