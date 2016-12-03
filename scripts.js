
var students = $('.student-item');
var pageDiv = $('.page');
var studentList = $('.student-list');
var pageHeader = $('.page-header');

// results displayed per page
var studentsVisible = 10;


// outputs the pagination buttons to the page
function renderPagination(arrayOfStudents, denomination){
  var html = '<div class="pagination"><ul>';
  var pageNumber = 1;

  // adds a page index marker if the index of the denominator divides cleanly into the index of the current student or the denominator does not divide cleanly into the index of the last student in the array
  arrayOfStudents.each(function(index){
    var studentIndex = index + 1;

    if(studentIndex % denomination === 0 ||
      (studentIndex === arrayOfStudents.length && studentIndex % denomination !== 0)){
      html += '<li><a class="active" href="#">' + pageNumber + '</a></li>';
      pageNumber++;
    }
  });

  html += '</ul></div>';
  pageDiv.append(html);

  filterStudents(students, studentsVisible, 1);
}

// loops through student array and shows the only the students that lie between the page boundaries
function filterStudents(arrayOfStudents, denomination, page){
  var upperLimit = denomination * page;

  studentList.find('.no-results').remove();

  arrayOfStudents.each(function(){
    var studentIndex = $(this).index();

    $(this).attr('style', 'display:none');

    if(studentIndex >= upperLimit - denomination && studentIndex < upperLimit){
      $(this).attr('style', 'display:block');
    }
  });
}

// runs the filterStudents function with the index of the click passed in as an additional parameter for sorting through the list of students
pageDiv.on('click', 'li', function(){
  var page = $(this).index() + 1;

  // checks that the clicked li's parent does not have the 'student-list' class
  if(!$(this).parent().hasClass('student-list')){
    filterStudents(students, studentsVisible, page);
  }
});


// appends the search form to the ".page-header" div
pageHeader.append(function(){
  var html = '';

  html += '<div class="student-search">';
  html += '<input placeholder="Search for students...">';
  html += '<button>Search</button>';
  html += '</div>';

  return html;
});


// triggers the click search button function on "enter" keypress
pageHeader.on('keypress', 'input', function(event){
  if(event.which === 13){
    pageHeader.find('button').trigger('click');
  }
});


// does a text-based search through the list of students
$('.student-search').on('click', 'button', function(){
  var searchInput = $(this).siblings('input').val();

  // do nothing if the user tries to submit an empty search
  if(searchInput === ''){return;}

  var searchTerm = new RegExp(searchInput, 'gi');
  var noResults = true;

  studentList.find('.no-results').remove();

  students.each(function(){
    var studentName = $(this).find('h3').text();

    $(this).attr('style', 'display:none');

    if(searchTerm.test(studentName)){
      noResults = false;
      $(this).attr('style', 'display:block');
    }
    // console.log(studentName, searchTerm, searchTerm.test(studentName));
  });

  // appends the "No Results" message if noResults remains truthy and the ".no-results" div does not already exist within the studentList
  if(noResults && studentList.find('.no-results').length < 1){
    studentList.append('<div class="no-results"><h4>No Results</h4></div>');
  }
});


renderPagination(students, studentsVisible);
