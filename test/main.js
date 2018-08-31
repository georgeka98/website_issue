// window.fbAsyncInit = function() {
//   FB.init({
//     appId            : 'your-app-id',
//     autoLogAppEvents : true,
//     xfbml            : true,
//     version          : 'v3.1'
//   });
// };
//
// (function(d, s, id){
//    var js, fjs = d.getElementsByTagName(s)[0];
//    if (d.getElementById(id)) {return;}
//    js = d.createElement(s); js.id = id;
//    js.src = "https://connect.facebook.net/en_US/sdk.js";
//    fjs.parentNode.insertBefore(js, fjs);
//  }(document, 'script', 'facebook-jssdk'));

var fbButton = document.getElementById('fb-share-button');
var url = window.location.href;

fbButton.addEventListener('click', function() {
    window.open('https://www.facebook.com/sharer/sharer.php?u=' + url,
        'facebook-share-dialog',
        'width=800,height=600'
    );
    return false;
});

function toggle_nav(){
  if (document.getElementById("navbar-wrap-toggle") != null){
    var navbar = document.getElementById("navbar-wrap-toggle");
    var navbar_display = window.getComputedStyle(navbar,null).getPropertyValue("display");
    console.log(navbar_display);
    if (navbar_display == "block")
      document.getElementById("navbar-wrap-toggle").style.display = "none";
    else
      document.getElementById("navbar-wrap-toggle").style.display = "block";
  }
}

if (document.getElementById("mobile-nav-btn") != null){
  document.getElementById("mobile-nav-btn").addEventListener('click', toggle_nav, false);
}
// document.body.addEventListener('click', toggle_nav, false);

if (document.getElementById("account") != null){
  document.getElementById('account').addEventListener('click', function(){
  	document.getElementById('js-profile-popup').style.display = "block";
  }, false);
}

window.addEventListener('click', function(event){
  if (document.getElementById("account") != null && document.getElementById("js-profile-popup") != null){
  	if(event.target.id != 'account' && event.target.id != 'js-profile-popup'){
  		document.getElementById('js-profile-popup').style.display = "none";
  	}
  }
}, false)

//youtube videos

function createXmlHttpReuestObject(){
	var xmlHttp;

	if(window.ActiveXObject){ //if user uses internet explorer
		try{
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		catch(e){
			xmlHttp = false;
		}
	}
	else{
		try{
			xmlHttp = new XMLHttpRequest();
		}
		catch(e){
			xmlHttp = false;
		}
	}

	if(xmlHttp === false){
		alert("Cant validate");
	}
	else{
		return xmlHttp;
	}
}

var xmlHttp = createXmlHttpReuestObject();
