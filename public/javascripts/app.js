function removeCl(el, className){
  function removeClass(el){
    if (el.classList){
      el.classList.remove(className);
    } else
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }

  if(el.length){
    for(var i = 0; i<el.length; i++){
      removeClass(el[i]);
    }
  } else{
    removeClass(el);
  }
};

function addCl(el, className){
  function addClass(el){
    if (el.classList)
      el.classList.add(className);
    else
      el.className += ' ' + className;
  }

  if(el.length){
    for(var i = 0; i<el.length; i++){
      addClass(el[i]);
    }
  } else{
    addClass(el);
  }
};

function toggleCl(el, className){
  function toggleClass(el){
    if (el.classList.toString().match(className)){
      removeCl(el, className)
    } else
      addCl(el, className)
  }

  if(el.length){
    for(var i = 0; i<el.length; i++){
      toggleClass(el[i]);
    }
  } else{
    toggleClass(el);
  }
};


var app = {
  likeEl: document.getElementById("like-wrap"),
  form: {
    formEl: document.getElementById("send-form"),
    rules: {
      field: new RegExp(/\S/),
      email: new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
      mobile: new RegExp(/\S/)
    },
    errMsgs: {
      by_default: "This field is required",
      name: "Please, enter valid name",
      mobile: "Please, enter valid mobile number",
      email: "Please, enter valid email address",
      email_confirmation: "Email addresses do not match. Please, correct emails address",
      terms: "You need accept terms of use!"
    }
  },
  testVal: function(str, reg){
    return reg.test(str);
  },
  validateForm: function(form){
    var isValid = true;

    for( var i=0; i<form.elements.length; i++ ){
      var item = form.elements[i],
          errType = item.getAttribute('data-err-type'),
          validationMsg = ( item.getAttribute('data-validation-msg') ) ? item.getAttribute('data-validation-msg') : "by_default"; 
      
      if(errType!=null){
        var reg,
            itemVal = item.value,
            errEl = item.nextElementSibling;
        if(this.form.rules[errType]){
          reg = this.form.rules[errType];
        } else if (errType=="email_confirmation") {
          reg = new RegExp(this.form.formEl.querySelector( item.getAttribute('data-bind') ).value);
        } else if (errType=="terms") {
          itemVal = (item.checked) ? item.checked : "error";
          reg = new RegExp(item.checked);
          errEl = errEl.nextElementSibling;
        };

        if( this.testVal(itemVal, reg) ){
          removeCl(item, "error");
          errEl.innerHTML = "";
        } else{
          addCl(item, "error");
          isValid = false;
          errEl.innerHTML = this.form.errMsgs[validationMsg];
        }
      }

    }
  
    return isValid;
  },
  userLikedCallback: function (){
    // this.likeEl.style.display = "none";
    this.form.formEl.style.display = "block";
  },
  init: function(){
    if(this.form.formEl){
      this.form.formEl.onsubmit = function(e){
        if( !this.validateForm(this.form.formEl) )
          e.preventDefault();
      }.bind(this);
    }
  }
};

app.init();


var appId = "338703359653019";
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId="+appId+"&version=v2.0";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

window.fbAsyncInit = function() {
  FB.Event.subscribe('edge.create', function(){
    app.userLikedCallback();
  });

  FB.api({
    method: "pages.isFan",
    page_id: appId,
  }, function(res) {
    if (res == true) {
      console.log('user_id likes the Application.');
      app.userLikedCallback();
    } else if(res.error_code) {
      console.error(res);
    } else {
      console.log("user_id doesn't like the Application.");
    }
  });


  FB.getLoginStatus(function(response) {
      // Check login status on load, and if the user is
      // already logged in, go directly to the welcome message.
      if (response.status == 'connected') {
        // onLogin(response);
      } else {
        // Otherwise, show Login dialog first.
        FB.login(function(response) {
          // onLogin(response);
        }, {scope: 'user_friends, email'});
      }
  });

};



