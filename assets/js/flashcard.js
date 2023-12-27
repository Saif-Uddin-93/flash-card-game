$(document).ready(function() {

  // Initialize game variables
  let wordsList = [];
  let currentWordIndex = 0;
  let currentWord = "";  
  let currentHint = "";
  let guessedLetters = [];
  let score = 0;  
  let gameStarted = false; // Flag to check if the game has started  
  let incorrectGuessCounter = 0; // Counter for incorrect guesses

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
    incorrectGuessCounter = 0;
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
  // const updateMessageDisplay = (str, color) => {
  //   const msg = $('#flashcard-msg');

  //   $('#flashcard-msg').text(str).css('color', color);
  //   msg.show();

  //   // Hide the message after 1sec
  //   setTimeout(() => {      
  //     msg.hide();
  //     msg.text('').removeAttr('style');
  //   }, 1000);
  // }

  // Function to blink background screen
  const blinkScreen= (classType) => {
    const blink = $('#flashcard-blink');
    blink.addClass(classType);

    // Hide the message after 1sec
    setTimeout(() => {            
      blink.removeClass(classType);
    }, 1000);
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

        // Check if user has made three incorrect guesses
        if (incorrectGuessCounter >= 3) {
          showEndGameScreen(score, false); // End the game with a loss
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
      // User has finished the game
      showEndGameScreen(score, true);
    }
  }

  // Function to show the end game screen
  function showEndGameScreen(totalScore, win) {
    // Display total score and message
    const message = win ? 'Congratulations! You won!' : 'Sorry, you lost. Better luck next time.';
    $('#end-game-message').text(`${message} Total Score: ${totalScore} points`);

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
    const filteredCat = words.filter(word => word[category])[0][category];  
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
  $('#try-again').on('click', function() {
    // Reload the page with cleared leaderboard
    window.location.reload();
  });


});