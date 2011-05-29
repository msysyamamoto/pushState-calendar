var sliding = false;
var slide_msec = 800;

$(function(){
  if (window.history && window.history.pushState) {
    $("a.slide").live("click", function(e){
      return clickHandler($(this).attr('href'));
    });

    $(window).bind("popstate", function(e){
      popStateHandler(e.originalEvent);
    });
  }
});

function pathFromURL(url) {
  items = url.split('/');
  return "/" + items[3] + "/" + items[4]; 
}

function clickHandler(href) {
  if (sliding == true) {
    return false;
  }

  window.history.pushState("", "" , href);
  slide(href);
  return false;
}

function popStateHandler(e) {
  slide(location.pathname);
  return true;
}

function slide(path) {
console.log(path);

  var dirs      = path.split('/');
  var klass     = dirs[1] + "_" + dirs[2]
  var direction = getSlideDirection(dirs[1], dirs[2]);

  if (direction != '') {
    sliding = true;

    var frame = $("." + klass); 
    if (frame.length == 0) {
          var timer = setTimeout(
            function(){$("#wait").show()},
            350
          );

          $.ajax({
            url:path,
            cache:false,
            success:function(b){
              clearTimeout(timer);
              $("#wait").hide();
              var load = $(b).find(".frame-center").removeClass('frame-center');
              $('.frames').prepend(load.hide());
              slideTo(load, direction);
            }
          });

    } else {
      slideTo(frame, direction);
    }
  }

  return false;
}

function slideTo(frame, direction) {
  if (direction == 'right') {
    slideRight(frame);
  } else if (direction == 'left') {
    slideLeft(frame);
  } else if (direction == 'up') {
    slideUp(frame);
  } else if (direction == 'down') {
    slideDown(frame);
  }
}


function slideLeft(frame) {
  frame.css({marginLeft: "0px", marginTop:"0px"}).show()

  $("#wrap .frame-center").after(frame)
                          .removeClass("frame-center")
                          .animate(
                            {marginLeft:"-1000px"},
                            slide_msec,
                            function(){slideDone();}
                          );

  frame.addClass('frame-center');

  refreshDate(frame.find(".date").text());
}

function refreshDate(text) {
  $('#date span').fadeOut(
      500,
      function() {
          $(this).text(text).fadeIn(300);
      }
  );
}

function slideRight(frame) {
  frame.css({marginLeft:"-1000px", marginTop:"0px", float:'left'})
       .show();

  $("#wrap .frame-center").removeClass("frame-center")
                          .before(frame.addClass('frame'));

  frame.addClass('frame-center')
       .animate(
         {marginLeft:"0px"},
         slide_msec,
         function(){ slideDone(); }
       );
  refreshDate(frame.find(".date").text());
}

function slideUp(frame) {
  frame.css({marginLeft: "0px", marginTop: "0px",clear:"left"}).show();
  $("#wrap .frame-center").css('clear', 'left')
                          .after(frame)
                          .removeClass("frame-center")
                          .animate(
                             {marginTop:"-1000px"},
                             slide_msec,
                             function(){slideDone();}
                          );
  frame.addClass('frame-center');
  refreshDate(frame.find(".date").text());
}

function slideDown(frame) {
  frame.css({marginTop:"-1000px", marginLeft: "0px", clear: "left"}).show();

  $("#wrap .frame-center").css('clear', 'left')
                          .before(frame)
                          .removeClass("frame-center");

  frame.addClass('frame-center')
       .animate(
         {marginTop:"0px"},
         slide_msec,
         function(){;slideDone(); }
       );
  refreshDate(frame.find(".date").text());
}

function getSlideDirection(year, month) {
  var next_year  = parseInt(year);
  var next_month = parseInt(month.replace(/^0/, ''));

  var classes   = $("#wrap .frame-center").attr('class').split(' ');
  var cur_year  = "";
  var cur_month = ""; 

  for (var i = 0; i < classes.length; i ++) {
    var matches = classes[i].match(/^(\d{4})_(\d{2})$/);
    if (matches != null) {
      cur_year  = parseInt(matches[1]);
      cur_month = parseInt(matches[2].replace(/^0/, ''));
      break;
    }
  }

  var direction = '';
  if (next_year == cur_year) {
    if (next_month > cur_month) {
      direction = 'left';
    } else if (next_month < cur_month) {
      direction = 'right';
    }
  } else if (next_year > cur_year) {
    if ((next_year - 1 == cur_year) && (next_month == 1) && (cur_month == 12)) {
      direction = 'left';
    } else {
      direction = 'up';
    }
  } else {
    if ((next_year + 1 == cur_year) && (next_month == 12) && (cur_month == 1)) {
      direction = 'right';
    } else {
      direction = 'down';
    }
  }

  return direction;
}

function slideDone() {
  var frame = $("#wrap .frame-center");
  frame.nextAll(".frame").hide();
  frame.prevAll(".frame").hide();
  frame.css({float: "left", clear :''});

  $('#next_month a').attr('href', frame.find(".next_month").attr('href'));
  $('#prev_month a').attr('href', frame.find(".prev_month").attr('href'));
  $('#prev_year a').attr('href', frame.find(".prev_year").attr('href'));
  $('#next_year a').attr('href', frame.find(".next_year").attr('href'));
  $('#next_year a').attr('href', frame.find(".next_year").attr('href'));

  sliding = false;
}
