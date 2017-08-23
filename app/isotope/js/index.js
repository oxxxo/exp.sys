/* ISOTOPE */
/*var filterValue = $(".dropdown dd ul li:nth-child(1) a").attr('data-filter');
      var text = $(".dropdown dd ul li:nth-child(1) a").html();
      $(".dropdown dt a span").html(text);*/
var $grid = $(".grid").isotope({
  itemSelector: ".grid-item",
  percentPosition: true,
  masonry: {
    columnWidth: ".grid-sizer"
  } /*,
        filter: filterValue*/
});
$grid.imagesLoaded({ background: ".swiper-slide" }, function() {
  //console.log('imagesLoaded');
  $grid.isotope("layout");
  TweenMax.delayedCall(0, setGridCategory);
});
$grid.on("arrangeComplete", function() {
  //console.log('arrangeComplete');
  //TweenMax.delayedCall(1, setGridCategory);
  TweenMax.delayedCall(0.1, updateSwipers);
});
function setGridCategory() {
  //console.log('setGridCategory');
  //swiper.update();
  var filterValue = $(".dropdown dd ul li:nth-child(1) a").attr("data-filter");
  var text = $(".dropdown dd ul li:nth-child(1) a").html();
  $(".dropdown dt a span").html(text);
  $(".grid-item").removeClass("open");
  $(".grid").isotope({ filter: filterValue });
  setSwipers();
}
function updateSwipers() {
  //console.log('updateSwipers');
  $("#produtos .swiper-container").each(function(index) {
    var $el = $(this);
    if ($el.find(".swiper-slide").length > 1) {
      swiper[index].onResize();
      //$(window).trigger('resize');
    }
  });
}

var $quicksearch = $(".quicksearch").keyup(
  debounce(function() {
    //console.log('keyup');
    $(".grid-item").removeClass("open");
    qsRegex = new RegExp($quicksearch.val(), "gi");
    $grid.isotope({
      filter: function() {
        return qsRegex ? $(this).text().match(qsRegex) : true;
      }
    });
    $(".dropdown .btn a span").html("Categorias");
  }, 200)
);

function debounce(fn, threshold) {
  var timeout;
  return function debounced() {
    if (timeout) {
      clearTimeout(timeout);
    }

    function delayed() {
      fn();
      timeout = null;
    }
    timeout = setTimeout(delayed, threshold || 100);
  };
}

$(".dropdown dt a").click(function(e) {
  $(".dropdown dd ul").toggle();
  e.preventDefault();
});
/*$('#top-menu .opt a[href="#produtos"]').click(function(e) {
        $(".dropdown dd ul").show();
        e.preventDefault();
      });*/

$(".dropdown dd ul li a").click(function(e) {
  console.log("filterValue");
  e.preventDefault();
  $(".grid-item").removeClass("open");
  var text = $(this).html();
  $(".dropdown dt a span").html(text);
  $(".dropdown dd ul").hide();
  var filterValue = $(this).attr("data-filter");
  $grid.isotope({
    filter: filterValue
  });
  $(".search input").val("");
});

$(document).bind("click", function(e) {
  var $clicked = $(e.target);
  if (
    !$clicked.parents().hasClass("dropdown") &&
    !$clicked.parents().hasClass("opts")
  )
    $(".dropdown dd ul").hide();
});

/* END ISOTOPE */