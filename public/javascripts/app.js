function removeCl(el, className){
  function removeClass(el){
    if(el.tagName == "OPTION")
      el = el.parentNode;

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
    if(el.tagName == "OPTION")
      el = el.parentNode;

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
  popUp: {
    el: "#pop-up",
    openBtn: "#show-terms",
    closeBtn: "#close-pop-up"
  },
  form: {
    formEl: document.getElementById("send-form"),
    rules: {
      field: new RegExp(/\S/),
      email: new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
      mobile: new RegExp(/^(\+|\d)\d\d*$/)
    },
    errMsgs: {
      by_default: "This field is required",
      name: "Please enter valid name",
      mobile: "Please enter valid mobile number",
      email: "Please enter valid email address",
      email_confirmation: "Email addresses do not match. Please correct the email address",
      terms: "You need to accept terms and conditions!",
      address: "Please enter your address",
      interests: "Please select at least 1 interest",
      country: "Please select your country",
      city: "Please enter your city"
    }
  },
  testVal: function(str, reg){
    return reg.test(str);
  },
  isInterests: function(){
    var flag = false;
    for( var i=0; i<this.form.interestsItems.length; i++ ){
      if(this.form.interestsItems[i].checked){
        flag = true;
        break;
      }
    }
    this.form.interestsInput.value = flag ? "true" : "";
    console.log(this.form.interestsInput.value);
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
          try{
            reg = new RegExp(this.form.formEl.querySelector( item.getAttribute('data-bind') ).value);
          } catch(e){
            console.error(e);
          }
        } else if (errType=="terms") {
          itemVal = (item.checked) ? item.checked : "error";
          reg = new RegExp(item.checked);
          errEl = errEl.nextElementSibling;
        } else if (errType=="interests"){
          reg = /^true$/;
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

      this.form.interestsInput = document.getElementById("interests-hidden"),
      this.form.interestsItems = this.form.formEl.querySelectorAll(this.form.interestsInput.getAttribute('data-bind'));
      
      for( var i=0; i<this.form.interestsItems.length; i++ ){
        this.form.interestsItems[i].onchange = function(){
          this.isInterests();
        }.bind(this);
      }      
      this.isInterests();
      this.popUpInit();
      this.userLikedCallback();
    }
  }
};

app.popUpInit = function(){
  this.popUp.elNode = document.querySelector(this.popUp.el);
  this.popUp.elNodeInner = this.popUp.elNode.querySelector('.inner');
  this.popUp.openBtnNodes = document.querySelectorAll(this.popUp.openBtn);
  this.popUp.closeBtnNodes = document.querySelectorAll(this.popUp.closeBtn);

  for (var i=0; i<this.popUp.openBtnNodes.length; i++ ){
    this.popUp.openBtnNodes[i].onclick = function(e){
      e.preventDefault();
      this.showPopUp();
    }.bind(this);
  }

  for (var i=0; i<this.popUp.closeBtnNodes.length; i++ ){
    this.popUp.closeBtnNodes[i].onclick = function(e){
      e.preventDefault();
      this.hidePopUp();
    }.bind(this);
  }  
};

app.showPopUp = function(){
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // this.popUp.elNodeInner.style.top = scrollTop+'px';
  this.popUp.elNodeInner.style.height = (window.innerHeight-40)+"px";
  addCl(this.popUp.elNode, 'active');
};

app.hidePopUp = function(){
  removeCl(this.popUp.elNode, 'active');
};

app.init();


var appId = "338703359653019";
window.fbAsyncInit = function() {
  FB.init({
    appId      : appId,
    xfbml      : true,
    version    : 'v2.3'
  });
};

(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 }(document, 'script', 'facebook-jssdk'));