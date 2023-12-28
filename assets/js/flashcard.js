$(document).ready(function() {

  // Function to get data from the localStorage
  const getLocalStorage = () => {
    // set the localStorage to default
    const setLocalStorage = {
      "theme": "light",
      "sound": "on",
      "categoryDone": [],
      // "categoryDone": ['animals', 'fruits', 'clothing', 'sports', 'countries', 'professions'],
      "maxScore": 0,
    }

    const storage = JSON.parse(localStorage.getItem('flashcard'));
    if(!storage){
      localStorage.setItem('flashcard', JSON.stringify(setLocalStorage));
    }
    return storage === null ? setLocalStorage : storage;
  }
  
  // Initialize game variables
  const categories = words; // categories from the 'assets/js/words.js' file
  let wordsList = [];
  let currentWordIndex = 0;
  let currentWord = "";  
  let currentHint = "";
  let guessedLetters = [];
  let score = 0;  
  let gameStarted = false; // Flag to check if the game has started  
  let incorrectGuessCounter = 0; // Counter for incorrect guesses
  
  // Initialize localStorage 
  const flashcardSettings = getLocalStorage();
  
  // Function to update data in localStorage
  const updateLocalStorage = (prop, change) => {   
    // const settingsObject = flashcardSettings[0];
   
    // Ensure flashcardSettings is an object
    if(flashcardSettings){      
      flashcardSettings[prop] = change;     
      return localStorage.setItem('flashcard', JSON.stringify(flashcardSettings));
    }
  }

  // Helper function to deactive completed categories
  const deactivateCategory = (category) => {
    // target an element by its data-cat 
    $(`.category[data-cat='${category}']`).css({
      'pointer-events': 'none',
      'opacity': '0.5'
    });
  };

  // Helper function to activate the next aviable category 
  const activateNextCategory = () => {  
    // Find the next available category
    /**
     * - find the first elements with a class of 'category' 
     * - and first element that not include style attribute 
     * contains the substring 'pointer-events: none' aka. disabled
     * 
     */
    const nextCategory = $('.category[data-cat]:not([style*="pointer-events: none"]):first');
 
    // Object has properties, it's not empty
    if (Object.keys(nextCategory).length > 0) {
      // Remove the 'cat-active' class from the current active category
      $('.cat-active').removeClass('cat-active');

      // Add the 'cat-active' class to the next available category
      nextCategory.addClass('cat-active');
    }    
  };

  const showFinalMessage = () => {
    console.log('Congtaz you wont all categories!!');
    console.log('Add message to inform user how to reset game');
    console.log('Remove point-event and opacity after game reset');
    console.log('set after wining the category to add categories to local storage');
    console.log(`
    - reset img opacity to 1 after continue game
    - reset opacity of lives to 1
    - move amout of images 1/10 to the corner
    - add total score at the top
    - check measages at the botttom of image to display messages
    - finish settings to save / reset data
    - add bg to pexels icon
    - add functionality to exit icon to go to the total score
    - work on mobile
    - remove hangman letters when user go to the score board
    - add max score at the top where was 1/10 before
    - if user wont choose continue and he has some games cateories won, reset the game also show popup if you want reset the game
    - if user won all categories show popup and ask if he want geset the game and score
    - remove progress bar or add functionality and remove 1/10. Also to progress bar add number number max , last picture and make a bit higher
    - set the variable to reset initial values if user is continuing game, because data is fetched / init from start button and not from init
    - add text above icons
    - check bug with const completedCategories = flashcardSettings[0].categoryDone; as sometimes is object or array
    - remove if(!win){ to be if(win) to pass user who wont the category
    `)
    
  }

  // Check the localStorage if user alredy played any of the games
  const categoryDone = () => {       
    const completedCategories = flashcardSettings.categoryDone;
    // const activeCategory =  $('.cat-active').data('cat');

    // Check if there are completed categories
    if(completedCategories && completedCategories.length > 0) {

      // Deactivate the current category if it's completed
      completedCategories.forEach((category) => {
        deactivateCategory(category);
      });
      
      // Activate the next category
      activateNextCategory();
      
      // Check if all categories are completed      
      if(categories.length === completedCategories.length){
        $('#flashcard-start').css({
          'pointer-events': 'none',
          'opacity': '0.5'
        });
        showFinalMessage();
      }
    }
  }

  // Disable completed categories
  categoryDone();

  // Function to initialize or reset the game
  function initializeGame() {
    
    // Get the current word
    currentWord = wordsList[currentWordIndex].word.toUpperCase();
    
    // Get the current hint
    currentHint = wordsList[currentWordIndex].hint
    
    // Get new image based on the current word
    fetchImage(currentWord)
    .then(data => {          
      // Shufle the fetched response images to give new image with the same word
      const {src, alt} = shuffleArray(data.photos)[0];
      
      // Append image to the flashcard container     
      $('#find-image').attr('src', src.large).attr('alt', alt);  

      // Append hint to the image
      $('#flashcard-back-hint').text(currentHint);  
    })
    .catch(error => console.error('Error fetching image:', error));

    // Reset the flashcard variables for the new image
    guessedLetters = [];
    updateWordDisplay();
    updateScoreDisplay();
    // incorrectGuessCounter = 0;
    // updateMessageDisplay("");
  }

  // Function to update the word display on the screen
  const updateWordDisplay = () => {
    const wordContainer = $('#guess-word');

    // Clear the word container before updating display on the screen
    wordContainer.empty(); 

    // Generate word on the screen
    for (const letter of currentWord) {
      const letterContainer = $('<div>');

      // If the user guessed a letter show on the screen
      if (guessedLetters.includes(letter)) {
        letterContainer.text(letter);
      } else {
        // Otherwise show underscore on the screen
        letterContainer.text('_');
      }
      wordContainer.append(letterContainer);
    }

    // show the generated word on the screen
    $('.guess-word').css('visibility', 'visible');
  }

  // Function to update the score display on the screen
  const updateScoreDisplay = () => {
    $('#flashcard-points').text(`Score: ${score}`);
  }

  // Function to update the message on the screen
  const updateMessageDisplay = (str) => {
    const msg = $('#flashcard-msg');

    $('#flashcard-msg').text(str);
    msg.show();

    // Hide the message after 1sec
    setTimeout(() => {      
      msg.hide();
      msg.text('').removeAttr('style');
    }, 3000);
  }

  // Function to blink background screen
  const blinkScreen= (classType) => {
    const blink = $('#flashcard-blink');
    blink.addClass(classType);

    // Hide the message after 1sec
    setTimeout(() => {            
      blink.removeClass(classType);
    }, 1000);
  }

  // Hearts display
  const heartDisplay = (num) => {
    const heart = $(`#flashcard-heart${num}`);
    heart.css('opacity', 0); 
  }

  // Function to handle key presses
  const handleKeyPress = (e) => {
    const pressedKey = e.key.toUpperCase();
    
    // Check if the pressed key is a letter and hasn't been guessed before
    // If it finds a match, it returns true, otherwise it returns false.
    if (/^[A-Z]$/.test(pressedKey) && !guessedLetters.includes(pressedKey)) {
      guessedLetters.push(pressedKey);

      // Check if the guessed letter is in the word
      if (currentWord.includes(pressedKey)) {        
        updateWordDisplay();

        // Check if all letters were guessed
        if (!currentWord.split('').some(letter => !guessedLetters.includes(letter))) {         
          score += 1; // Update the score

          // Update the localStorage score property
          updateLocalStorage('maxScore', score)

          // Get current image index 
          const totalWords = Number($('#flashcard-number').text().split('/')[0]);
          
          // Display current image number / Total number of words for that category
          $('#flashcard-number').text(`${totalWords + 1}/${wordsList.length}`);

          updateScoreDisplay(); // Update the score display
          handleNextWordClick(); // Move to the next word
        } else {
          // Guessed a correct letter
          // updateMessageDisplay('✔', 'green');                 
        }
      } else {        
        // If letter is not in the currentWord  
        blinkScreen('blink-error');       
                
        // Increment the incorrect guess counter
        incorrectGuessCounter++;

        // Remove heart with each incorrect guess
        heartDisplay(incorrectGuessCounter);
        
        // Check if user has made three incorrect guesses
        if (incorrectGuessCounter >= 3) {

          // Set the image 50% opacity to show the message
          $('#find-image').css('opacity', 0.5);

          // User lost
          updateMessageDisplay('Sorry, you lost. Better luck next time.');

          setTimeout(() => {            
            showEndGameScreen(score, false); // End the game with a loss
          }, 3000)
        }
      }
    }
  }

  // Function to handle the next 'WORD' button click
  const handleNextWordClick = () => {
    currentWordIndex += 1; // Increment the current word index

    // If the current word index is less than the current word length
    // then fetch the next image
    if (currentWordIndex < wordsList.length) {
      initializeGame();
    } else {

      // Set the image 50% opacity to show the message
      $('#find-image').css('opacity', 0.5);

      // User won
      updateMessageDisplay('Congratulations! You won!');

      // Current category
      // const activeCategory =  $('.cat-active').data('cat');
      // console.log(activeCategory);
     
      // User has finished the game
      showEndGameScreen(score, true);
    }
  }

  // Function to show the end game screen
  function showEndGameScreen(totalScore, win) {
    // Display total score and message
    // const message = win ? 'Congratulations! You won!' : 'Sorry, you lost. Better luck next time.';

    if(!win){
      const button = $('<button>');
      button.addClass('btn btn-primary').attr("id", "continue-game").text('continue');
      $('#end-game-buttons').append(button);   
      
      // Event listener to continue the flashcard game on user win      
      $('#continue-game').on('click', function continueGame() {
        
        // Reset the elements state        
        $('#flashcard-outer').show(); // Show flashcard category menu        
        $('#end-game-container').hide(); // Show the end game screen
        // $('#guess-word').css('visibility', 'hidden'); // show the generated word on the screen
        $('#guess-word').empty(); // Remove any existing word
        $('#continue-game').remove(); // Remove
        $('#end-game-message').text('');
        incorrectGuessCounter = 0; // Reset the incorrect guess for the next category

        // Remove event imediately after is called 
        // $(this).off('click', continueGame);
      });
    }

    // $('#end-game-message').text(`${message} Total Score: ${totalScore} points`);
    $('#end-game-message').text(`Total Score: ${totalScore} points`);

    // Disable key press   
    gameStarted = false;

    // Show the end game screen
    $('#end-game-container').show();
  }

  // Function to Sorting words array in random order
  const shuffleArray = (array) => {        
    /**
     * Subtracting 0.5 shifts the range of random numbers from -0.5 to 0.5
     * If the result is negative, the first element is sorted before the second; 
     * if positive, the second element is sorted before the first.      
     */
    return array.sort(() => Math.random() - 0.5);
  }

  // Get category picked by user and resuffle the chooses category
  const getCategory = (category) => {   
    // Get the array of words from the 'assets/js/words.js' file
    const filteredCat = categories.filter(word => word[category])[0][category];  
    const reShuffleCat = shuffleArray(filteredCat); // Reorder the chosen words   
    return reShuffleCat;
  }

  // Fuction to fetch image from Pexels API
  const fetchImage = (word) => {
    const apiKey = '';
    const url = `https://api.pexels.com/v1/search?query=${word}&per_page=40`;
    
    return fetch(url, {
      headers: {
        'Authorization': apiKey, 
      },
    })
    .then(response => response.json())
    .then(data => { 
      console.log(data)      
      return data;
    })
    .catch(error => console.error('Error fetching image:', error))
  }

   // Event listener to flip the card on 'HINT' click
   $('#flashcard-hint').on('click', function(){

    $('.flashcard-inner').addClass('flashcard-flip');
    
    // Remove the 'flashcard-flip' and reverse flashcard back to front
    setTimeout(function(){
      $('.flashcard-inner').removeClass('flashcard-flip');
    }, 2000);

  });

  // Event listener to apply/remove highlighting for icons on the start screen
  $('#categories').on('click', 'svg', function() {
    $('.category').removeClass('cat-active'); // Removes any prev acvtive icon
    const category = $(this).parent();

    // Apply new active icon
    if(!category.hasClass('cat-active')) category.addClass('cat-active');
  });

  // Event listener to hide the start screen and fetch the image
  $('#flashcard-start').on('click', function() {
    
    // Current category
    const activeCategory =  $('.cat-active').data('cat');

    // Hide the start screen
    $('#flashcard-outer').hide();

    // Show the spinner when fetching the image
    $('#loading-container').show(); // display 'block'

    // Assign the list of words to global words list
    wordsList = getCategory(activeCategory);  
    
    //Total number of words
    $('#flashcard-number').text(`1/${wordsList.length}`);

    // Current word
    currentWord = wordsList[currentWordIndex].word.toUpperCase();

    // Current word hint 
    currentHint = wordsList[currentWordIndex].hint

    // Fetch the image
    // fetchImage(currentWord)
    // .then(data => {                 
    //   // Shufle the fetched response images to give new image with the same word
    //   const {src, alt} = shuffleArray(data.photos)[0];

    //   // Show image on the screen in the flashcard      
    //   $('#find-image').attr('src', src.large).attr('alt', alt);  
    //   $('#flashcard-back-hint').text(currentHint);
    // })
    // .catch(error => console.error('Error fetching image:', error))
    // .finally(() => {

    //   // Hide the spinner once the fetch is complete, whether successful or not
    //   $('#loading-container').hide();

    //   gameStarted = true; // Start the game
    
    //   updateWordDisplay(); // Update the display
    //   updateScoreDisplay(); // Update the score
    // });

    //  TEMP code to mimic fetch
    console.log(currentWord)
    console.log(wordsList)

    gameStarted = true; // start the game

    updateWordDisplay();
    updateScoreDisplay();

    // TEMP
    setTimeout(() => {
      $('#loading-container').hide();
    }, 1000)
  

    $('#flashcard-outer').hide();
    
  });

  // Event listener for key presses
  $(document).on('keypress', function(e) {

    // Listen for keyboard press only when game started
    if(gameStarted){
      handleKeyPress(e);
    }
  });

  // $('#flashcard-exit').on('click', function() {
  //   console.log($(this))
  // });

  // Restart the flashcard game 
  $('#reset-game').on('click', function() {
    // Reload the page with cleared leaderboard
    window.location.reload();
  }); 

});