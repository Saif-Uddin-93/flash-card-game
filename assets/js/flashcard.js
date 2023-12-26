// Flip the card on HINT click
$('#flashcard-hint').on('click', function(){

  $('.flashcard-inner').addClass('flashcard-flip');
  
  setTimeout(function(){
    $('.flashcard-inner').removeClass('flashcard-flip');
  }, 2000);

});

// Function to shuffle the array of words
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
}

// Get category picked by user and resuffle the 'words.js' array
const getCategory = (category) => {   
  const filteredCat = words.filter(word => word[category])[0][category];  
  const reShuffleCat = shuffleArray(filteredCat);    
  return reShuffleCat;
}

// Apply/Remove highlighting to icons
$('#categories').on('click', 'svg', function() {
  $('.category').removeClass('cat-active'); //removes any prev avtive icon
  const category = $(this).parent();

  // apply new active icon
  if(!category.hasClass('cat-active')) category.addClass('cat-active');
});

// Hide the start screen and fetch the image
$('#flashcard-start').on('click', function() {
  
  const activeCategory =  $('.cat-active').data('cat');

  // get the first word and hint 
  const {word, hint} = getCategory(activeCategory)[0];  
  console.log(word, hint)
  // BECASUE OF FETCH LIMIT API KEY WILL BE ADDED ONCE I GET ALL WORKING
  // const apiKey = '';
  // const url = `https://api.pexels.com/v1/search?query=${word}&per_page=1`;
  

  // fetch(url, {
  //   headers: {
  //     'Authorization': apiKey, 
  //   },
  // })
  // .then(response => response.json())
  // .then(data => {
  //   const {src, alt} = data.photos[0];

  //   // Show image on the screen in the flashcard      
  //   $('#find-image').attr('src', src.large).attr('alt', alt);  
  //   $('#flashcard-back-hint').text(hint);
  
  // })
  // .catch(error => console.error('Error fetching image:', error));

  $('#flashcard-outer').hide();
  
});

