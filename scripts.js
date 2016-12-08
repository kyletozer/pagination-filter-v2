'use strict';


var app = {
  selectors: {
    pageHeader: $('.page-header'),
    studentItems: $('.student-item'),
    studentList: $('.student-list'),
  },

  values: {
    studentsPerPage: 10
  },

  // helper function for retrieving the students name from it's DOM element
  getStudentName: function(student){
    return student.find('h3').text();
  },

  init: function(){
    var {selectors} = this;

    // appends the search form to the top of the page
    selectors.pageHeader.append(function(){
      var search = '';

      search += '<div class="student-search">';
      search += '<input placeholder="Search for students...">';
      search += '<button>Search</button>';
      search += '</div>';

      return search;
    });

    app.renderPagination(1);
  },

  // rerenders the pagination and appropriate results each time it is run
  renderPagination: function(page, search){
    var {values, selectors, getStudentName} = this;

    var upperLimit = values.studentsPerPage * page;
    var pageNumber = 1;
    var html = '';
    var listOfNames = [];


    // removes the "no results" message (if it exists in the DOM)
    selectors.studentList.find('.no-results').remove();

    // for advanced searching with pagination, I loop over the student DOM elements and push the student's names to a new array that contains only the students names and not the entire jQuery object
    selectors.studentItems.each(function(){
      var name = getStudentName($(this));

      if(!search || (search && new RegExp(search, 'gi').test(name))){
        listOfNames.push(name);
      }
    });

    // hide all students and then show the appropriate students in the list based on the "search" argument
    selectors.studentItems.each(function(){
      var name = getStudentName($(this));
      var studentIndex = listOfNames.indexOf(name) + 1;
      var index = $(this).index() + 1;


      $(this).hide();

      if(studentIndex > (upperLimit - values.studentsPerPage) && studentIndex <= upperLimit){
        $(this).show();
      }
    });

    // loop through the list of names array containing all of the student's names that match the "search" term regex and use that to determine the page navigation
    listOfNames.forEach(function(student, index){

      if(index % values.studentsPerPage === 0 ||
        (index === selectors.studentItems.length && index % values.studentsPerPage !== 0)){

        html += '<li><a ';
        if(page === pageNumber){html += 'class="active" ';}
        html += 'href="#">' + pageNumber + '</a></li>';

        pageNumber += 1;
      }
    });

    // if the list of names array does not get filled, display the "no results" message to the user
    if(listOfNames.length === 0){
      selectors.studentList.prepend('<div class="no-results">No results were found for "' + search + '".</div>');
    }

    // rendering the pagination to the DOM
    selectors.studentList.find('.pagination').remove();
    selectors.studentList.append('<div class="pagination"><ul>' + html + '</ul></div>');
  }
};


app.init();

// if the search field contains input, pass the input into the function to simulate search-term based pagination
app.selectors.studentList.on('click', 'li', function(){
  var {selectors} = app;
  var page = $(this).index() + 1;
  var search = selectors.pageHeader.find('input').val();

  if(!$(this).hasClass('student-item')){
    app.renderPagination.apply(app, [page, search]);
  }
});

//
app.selectors.pageHeader.on('click', 'button', function(){
  var input = $(this).siblings('input').val();

  app.renderPagination(1, input.toLowerCase());
});
