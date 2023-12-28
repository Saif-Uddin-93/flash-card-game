$(document).ready(function() {

  // Function to get data from the localStorage
  const getLocalStorage = () => {
    // set the localStorage to default
    const setLocalStorage = {
      "theme": "light",
      "sound": true,
      "categoryDone": [],           
      "notification": true,
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
  let showMessages = true; // Flag to show messages
  let incorrectGuessCounter = 0; // Counter for incorrect guesses
  
  // Initialize localStorage 
  const flashcardSettings = getLocalStorage();
  
  // Function to update data in localStorage
  const updateLocalStorage = (prop, change) => {   
    // const settingsObject = flashcardSettings[0];  
    
    // If category is updated
    if(prop === 'categoryDone'){
      flashcardSettings[prop].push(change);      
    }

    // Ensure flashcardSettings is an object
    if(flashcardSettings && prop !== 'categoryDone'){      
      flashcardSettings[prop] = change;           
    }

    return localStorage.setItem('flashcard', JSON.stringify(flashcardSettings));
  }

  const setSettings = () => {
    const sound = flashcardSettings['sound'];
    
    const notification = flashcardSettings['notification'];
    showMessages = notification;
    
    const theme = flashcardSettings['theme'];    
    document.documentElement.setAttribute('data-theme', theme);
  }
  
  // Refresh the flashcard settings
  setSettings();

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
    console.log(`

    - add function to setTimet content
    
    - add notitification on/off
    - grey out the settings and exit btn
    - block exit on the main window, unblock on others
    - rewrite middle part and move absolute to one div for middle part and bottom
    
    
    - finish settings to save / reset data
    
    - work on mobile
    - fade out text on the image at the bottom
    
    
    - if user wont choose continue and he has some games cateories won, reset the game also show popup if you want reset the game
    - if user won all categories show popup and ask if he want geset the game and score
    - remove progress bar or add functionality and remove 1/10. Also to progress bar add number number max , last picture and make a bit higher
    
    - add text above icons    
    
    - create favicon for the app
    - switch to div istead of svg when user highlight the category, bc right now sometimes it needs to click in the middle of the svg
    `)
    
  }

  // Check the localStorage if user alredy played any of the games
  const categoryDone = () => {       
    // console.log(flashcardSettings)
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
    
    // Reset the image before loading the new one
    $('#find-image').attr('src', '');

    // Show the spinner when fetching the image
    $('#loading-container').show(); // display 'block'

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
    .catch(error => console.error('Error fetching image:', error))
    .finally(() => {

      // Hide the spinner once the fetch is complete, whether successful or not
      $('#loading-container').hide();
    
      // Reset the flashcard variables for the new image
      guessedLetters = [];         
      updateWordDisplay(); // Update the display
      updateScoreDisplay(); // Update the score
    });
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

  // Function to show the message on the center of the screen
  const messageDisplay = (str, id, time, color) => {
    const msg = $(`#${id}`);

    msg.css('color', color).text(str);
    msg.show();

    // Hide the message after 1sec
    setTimeout(() => {      
      msg.hide();
      msg.text('').removeAttr('style');
    }, time);
  }

  if(showMessages) {
    messageDisplay('🏆 Your Highest Score', 'flashcard-msg-bottom', 3000, 'green');
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
  const heartDisplay = (num, opacity) => {
    const heart = $(`#flashcard-heart${num}`);
    heart.css('opacity', opacity); 
  }

  // Hearts display
  const imageDisplay = (opacity) => {
    $('#find-image').css('opacity', opacity);
  }

  // Update the Max Score
  const maxScoreDisplay = () => {
    if(flashcardSettings.maxScore > 0) {
      $('#flashcard-trophy-num').text(flashcardSettings.maxScore);
    }
  }

  maxScoreDisplay();
 
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
          if(score > flashcardSettings.maxScore){
            updateLocalStorage('maxScore', score);
          }

          // Get current image index 
          const totalWords = Number($('#flashcard-number').text().split('/')[0]);
        
          // Display current image number / Total number of words for that category
          if(totalWords < wordsList.length){            
            $('#flashcard-number').text(`${totalWords + 1}/${wordsList.length}`);
          }

          updateScoreDisplay(); // Update the score display          
          maxScoreDisplay();  // Update the score max user score
          handleNextWordClick(); // Move to the next word
        } else {
          // Guessed a correct letter
          // messageDisplay('✔', 'green');                 
        }
      } else {        
        // If letter is not in the currentWord  
        blinkScreen('blink-error');       
                
        // Increment the incorrect guess counter
        incorrectGuessCounter++;

        // Remove heart with each incorrect guess
        heartDisplay(incorrectGuessCounter, 0);

        if(showMessages && incorrectGuessCounter === 2) {
          messageDisplay('❤️ One live left!', 'flashcard-msg-bottom', 5000, 'green');
        }
        
        // Check if user has made three incorrect guesses
        if (incorrectGuessCounter >= 3) {

          // Set the image 50% opacity to show the message
          // $('#find-image').css('opacity', 0.5);
          imageDisplay(0.5);

          // User lost
          messageDisplay('Sorry, you lost. Better luck next time.', 'flashcard-msg', 3000, 'green');

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
      // $('#find-image').css('opacity', 0.5);
      imageDisplay(0.5);

      // User won
      messageDisplay('Congratulations! You won!', 'flashcard-msg', 3000, 'green');

      // Current category
      // const activeCategory =  $('.cat-active').data('cat');
      // console.log(activeCategory);
     
      // User has finished the game
      setTimeout(()=>{
        showEndGameScreen(score, true);
      },3000)
    }
  }

  // Function to show the end game screen
  function showEndGameScreen(totalScore, win) {
    // Display total score and message
    // const message = win ? 'Congratulations! You won!' : 'Sorry, you lost. Better luck next time.';

    if(win){
      const button = $('<button>');
      button.addClass('btn btn-primary').attr("id", "continue-game").text('continue');
      $('#end-game-buttons').append(button);   
      
      // Event listener to continue the flashcard game on user win      
      $('#continue-game').on('click', function continueGame() {

        // Find active category
        const activeCategory =  $('.cat-active').data('cat');
        
        // Update localStore with completed categories
        updateLocalStorage('categoryDone', activeCategory);

        // Update hearts opacity
        const totalHearts = $('.flashcard-hears').length;
        $('.flashcard-hears').each(function(index, _) {
          let reversedIndex = totalHearts - index;          
          heartDisplay(reversedIndex, 1);
        });

        // Update image opacity
        imageDisplay(1);

        // Disable completed categories
        categoryDone();

        // Reset the elements state        
        $('#flashcard-outer').show(); // Show flashcard category menu        
        $('#end-game-container').hide(); // Show the end game screen
        // $('#guess-word').css('visibility', 'hidden'); // show the generated word on the screen
        $('#guess-word').empty(); // Remove any existing word
        $('#continue-game').remove(); // Remove
        $('#end-game-message').text('');
        incorrectGuessCounter = 0; // Reset the incorrect guess for the next category
        score = 0;  
        
        if(showMessages) {
          messageDisplay('Reset category in ⚙️ settings', 'flashcard-msg-bottom', 4000, 'green');
        }
        // Remove event imediately after is called 
        // $(this).off('click', continueGame);
      });
    }

    // $('#end-game-message').text(`${message} Total Score: ${totalScore} points`);
    $('#end-game-message').text(`Total Score: ${totalScore} points`);

    $('#guess-word').css('visibility', 'hidden');

    // Disable key press   
    gameStarted = false;

    if(showMessages) {
      messageDisplay('✖ to Exit the Game', 'flashcard-msg-bottom', 4000, 'green');
    }

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
      // console.log(data)      
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
    
    if(showMessages) {
      messageDisplay('❤️ Start with 3 lives', 'flashcard-msg-bottom', 5000, 'green');
    }

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
    
    // initializeGame();
   
    gameStarted = true; // Start the game

    // Get the current word
    currentWord = wordsList[currentWordIndex].word.toUpperCase();
    //  TEMP code to mimic fetch
    console.log(currentWord)
    console.log(wordsList)

    guessedLetters = [];
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
 
  // Restart the flashcard game 
  $('#reset-game').on('click', function() {
    // Reload the page with cleared leaderboard
    window.location.reload();
  }); 

  // Event listeners for exit the game
  $('#flashcard-exit').on('click', function() {    
    // showEndGameScreen(score, false);
    $('#flashcard-outer').show();
    $('#end-game-container').hide();
    $('#guess-word').css('visibility', 'hidden');
  });

  // Event listener for user settings
  $('#settings-save').on('click', function(){
    // Check the state of Apperance    
    const appearanceDark = $('#setting-appearance-dark').prop('checked');
    
    // Check the state of the switches
    const soundOn = $('#setting-sound').prop('checked');
    const noteOn = $('#setting-note').prop('checked');
    
    const changes = {
      "theme": appearanceDark ? "dark" : "light",
      "sound": soundOn,
      "notification": noteOn     
    };

    // Save to local storage
    for(let prop in changes) {      
      updateLocalStorage(prop, changes[prop]);
    }    

    // Refresh the flashcard settings
    setSettings();   
        
  });

});