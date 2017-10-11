$( "#nav-toggle" ).on('click', function() {
  $( "#nav-menu" ).slideToggle( "slow" );
  $(this).toggleClass( 'is-active' );
});
