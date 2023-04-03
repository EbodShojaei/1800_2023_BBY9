//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton() {
    console.log($('#searchForm').load('./text/search.html'));
    
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here.
            console.log($('#navbarPlaceholder').load('./text/nav_after_login.html'));
            console.log($('#footerPlaceholder').load('./text/foot_after_login.html'));
        } else {
            // No user is signed in.
            console.log($('#navbarPlaceholder').load('./text/nav_before_login.html'));
            console.log($('#footerPlaceholder').load('./text/footer.html'));
        }
    });
}
loadSkeleton(); //invoke the function

$(function(){
    $('body').fadeIn();
    $('a').click(function(){
        url = $(this).attr('id') + '.html';
        $('body').fadeOut(function(){
            window.location = url;
        });     
    });
});