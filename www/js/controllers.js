var reloadpage = false;
var configreload = {};
angular.module('starter.controllers', ['starter.services', 'ion-gallery', 'ngCordova', 'ngSanitize'])

.controller('AppCtrl', function ($scope, $ionicModal, $ionicPopup, $timeout, MyServices, $ionicLoading, $location, $filter, $ionicLoading, $cordovaNetwork) {
	addanalytics("flexible menu");

	//	$ionicLoading.hide();
    function internetaccess(toState) {
		if (navigator) {
			if (navigator.onLine != true) {
				onoffline = false;
				$location.url("/access/offline");
			} else {
				onoffline = true;
			}
		}
	}


	$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
		internetaccess(toState);
	});
	window.addEventListener("offline", function (e) {
		internetaccess();
	})
	window.addEventListener("online", function (e) {
		internetaccess();
	})

	$scope.menudata = [];

	var loginstatus = false;


	// loader
	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});

		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};
	//	$scope.showloading();

	configreload.onallpage = function () {
		
		var loginstatus = false;

		if (MyServices.getconfigdata()) {

			_.each(MyServices.getconfigdata().config[0], function (n) {
				if (n.value == true) {
					loginstatus = true;
				}
			});
		}
		
		if (loginstatus == true && !MyServices.getuser()) {

			$location.url("/access/login");
		}
	} 

	
	configreload.func = function () {
		$scope.menudata = [];
		var data = MyServices.getconfigdata();
		_.each(data.config[0], function (n) {
			if (n.value == true) {
				loginstatus = true;
			}
		});

		_.each(data.menu, function (n) {
			if (loginstatus == false) {
				if (n.linktypelink != "setting" && n.linktypelink != "contact" && n.linktypelink != "profile") {
					var newmenu = {};
					newmenu.id = n.id;
					newmenu.name = n.name;
					newmenu.order = n.order;
					newmenu.icon = n.icon;
					newmenu.link_type = n.linktypename;
					switch (n.linktype) {
					case '3':
						newmenu.typeid = n.event;
						break;
					case '6':
						newmenu.typeid = n.gallery;
						break;
					case '8':
						newmenu.typeid = n.video;
						break;
					case '10':
						newmenu.typeid = n.blog;
						break;
					case '19':
						newmenu.typeid = n.cafe;
						break;
					case '21':
						newmenu.typeid = n.chat;
						break;
					case '22':
						newmenu.typeid = n.registro;
						break;
					case '2':
						newmenu.typeid = n.article;
						break;
					default:
						newmenu.typeid = 0;

					}
					newmenu.link = n.linktypelink;
					$scope.menudata.push(newmenu);
				}
			} else {
				var newmenu = {};
				newmenu.id = n.id;
				newmenu.name = n.name;
				newmenu.order = n.order;
				newmenu.icon = n.icon;
				newmenu.link_type = n.linktypename;
				switch (n.linktype) {
				case '3':
					newmenu.typeid = n.event;
					break;
				case '6':
					newmenu.typeid = n.gallery;
					break;
				case '8':
					newmenu.typeid = n.video;
					break;
				case '10':
					newmenu.typeid = n.blog;
					break;
				case '19':
					newmenu.typeid = n.cafe;
					break;
				case '21':
					newmenu.typeid = n.chat;
					break;
				case '22':
					newmenu.typeid = n.registro;
					break;
				case '2':
					newmenu.typeid = n.article;
					break;
				default:
					newmenu.typeid = 0;

				}
				newmenu.link = n.linktypelink;
				$scope.menudata.push(newmenu);
			}
		});
		$scope.contact = data.config[5];
		$scope.menu = {};
		$scope.menu.setting = false;
		var blogdata1 = JSON.parse(data.config[0].text);

		// config data
		var blogdata = JSON.parse(data.config[1].text);
		for (var i = 0; i < blogdata.length; i++) {
			if (blogdata[i].value == true) {
				$scope.menudata.blogs = true;
				$.jStorage.set("blogType", blogdata[i]);
				break;
			} else {
				$scope.menudata.blogs = false;
			}
		}
		_.each(blogdata1, function (n) {
			if (n.value == true) {
				loginstatus = true;
			}
		});

		$scope.logso = "";
		if (loginstatus == false) {
			$scope.menu.setting = false;
		} else {
			$scope.menu.setting = true;
			$scope.logso = "has-menu-photo";
		}
	}

	MyServices.getallfrontmenu(function (data) {
		MyServices.setconfigdata(data);
		_.each(data.config[0], function (n) {
			if (n.value == true) {
				loginstatus = true;
			}
		});
		configreload.func();
	}, function (err) {
		$location.url("/access/offline");
	})

	var logoutsuccess = function (data, success) {
		if (data == 'true') {
			$.jStorage.flush();
			reloadpage = true;
			$ionicLoading.hide();
			$location.path("/access/pasaporte");
		}
	}
	
	$scope.logout = function () {
		$ionicLoading.show();
		MyServices.logout(logoutsuccess, function (err) {
			$location.url("/access/offline");
		});
	}

	$scope.miperfil = function () {
		$location.url("/app/profile");
		
	}




	// Form data for the login modal
	$scope.loginData = {};

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/accessView/login.html', {
		scope: $scope
	}).then(function (modal) {
		$scope.modal = modal;
	});

	// Triggered in the login modal to close it
	$scope.closeLogin = function () {
		$scope.modal.hide();
	};

	// Open the login modal
	$scope.login = function () {
		$scope.modal.show();
	};

	// Perform the login action when the user submits the login form
	$scope.doLogin = function () {

		// Simulate a login delay. Remove this and replace with your login
		// code if using a login system
		$timeout(function () {
			$scope.closeLogin();
		}, 1000);
	};

	if ($.jStorage.get("user")) {

		MyServices.getsingleuserdetail(function (data) {
			$scope.userdetails = data;
			$scope.userdetails.myimage = {
				'background-image': "url('" + $filter("profileimg")(data.image) + "')"
			};
		}, function (err) {
			$location.url("/access/offline");
		});

	}



$scope.panicolink = function () {
		$location.url("/app/panico");
		
	}

$scope.showPopupPanico = function () {
		var myPopup = $ionicPopup.show({
			template: '<p class="text-center"><img width="35%" src="../img/appcajita.png"><br>En breve te llamaremos!</p>',
			title: '¡Panico Activado!',
			scope: $scope,

		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);
	};

$scope.showPopupPanicofailure = function () {

		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">Es necesario que estes registrado en la app</p>',
			title: 'Regístrate',
			scope: $scope,
		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);
	};


var createPanicocallback = function (data, status) {
		$ionicLoading.hide();
		if (data == 1) {
			$scope.showPopupPanico();
			$scope.panico = {};
		} else {
			$scope.showPopupPanicofailure();
		}
	}

$scope.panico = {};

$scope.panicos = function (panico) {

		$scope.panico = {};
		

		if($.jStorage.get("user")){


		MyServices.createpanico(panico, createPanicocallback, function (err) {
			$location.url("/access/offline");
			});
		}else{
			$scope.showPopupPanicofailure();

		}

	}	



$scope.puntoslink = function () {

		
		if($.jStorage.get("user")){

			$location.url("/app/profile");
		
		}else{
			$location.url("/access/pasaporte");
		}

	}	























})

.controller('AccessCtrl', function ($scope) {

})


.controller('ChatCtrl', function ($scope) {


})


















.controller('PanicoCtrl', function ($scope, MyServices, $ionicPopup, $interval, $location, $window, $ionicLoading, $timeout) {

$scope.logindata = {};



	function internetaccess(toState) {
		if (navigator) {
			if (navigator.onLine != true) {
				onoffline = false;
				$location.url("/access/offline");
			} else {
				onoffline = true;
			}
		}
	}


	// loader
	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-assertive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 3000);
	};

	
	
	


})



.controller('ArticleCtrl', function ($scope, MyServices, $stateParams, $ionicPopup, $interval, $location, $window, $ionicLoading, $timeout) {
	configreload.onallpage();
	$scope.article = {};
	$scope.msg = "";
	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};
	$scope.showloading();
	MyServices.getarticle($stateParams.id, function (data) {
		$scope.article = data;
		if (data == '') {
			$scope.msg = "Pagina en blanco.";
		}
		addanalytics(data.title);
		$ionicLoading.hide();
	}, function (err) {
		$location.url("/access/offline");
	});

})





.controller('PasaporteCtrl', function ($scope, MyServices, $ionicPopup, $interval, $location, $window, $ionicLoading, $timeout) {
addanalytics("flexible login page");

	$scope.logindata = {};

	$.jStorage.flush();

	$scope.forgotpass = function () {
		$location.url("/access/forgotpassword");
	}

//	$scope.config = MyServices.getconfigdata();

	//var loginstatus = false;

	function internetaccess(toState) {
		if (navigator) {
			if (navigator.onLine != true) {
				onoffline = false;
				$location.url("/access/offline");
			} else {
				onoffline = true;
			}
		}
	}


	// loader
	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-assertive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 3000);
	};

	
	var authenticatesuccess = function (data, status) {
		$ionicLoading.hide();
		if (data != "false") {
			$.jStorage.set("user", data);
			user = data;
			reloadpage = true;
			$location.url("/app/profile");
		}
	};
	
	
	$scope.showPopupsignupsuccess = function () {

		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">Acceso Exitoso!</p>',
			title: 'Felicidades!',
			scope: $scope,

		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);
	};
	$scope.showPopupsignupfailure = function () {
		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">Ya existe el Usuario</p>',
			title: 'Oops!',
			scope: $scope,

		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);
	};

	//SIGN UP FORM
	$scope.signup = {};
	var signupsuccess = function (data, status) {
		if (data != "false") {
			$.jStorage.set("user", data);
			user = data;
			var myPopup = $ionicPopup.show({
				template: '<p class="text-center">Registrado correctamente!</p>',
				title: 'Congrats!',
				scope: $scope,

			});
			$timeout(function () {
				myPopup.close(); //close the popup after 3 seconds for some reason
				$location.url("/app/home");
			}, 2000);

		} else {
			$scope.showPopupsignupfailure();
		}
		$ionicLoading.hide();
		$scope.signup = {};
	}

	var msgforall = function (msg) {
		$ionicLoading.hide();
		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">' + msg + '</p>',
			title: 'Login',
			scope: $scope,

		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);

	}

	$scope.signupsubmit = function (signup) {
		$ionicLoading.show();
		$scope.allvalidation = [{
			field: $scope.signup.username,
			validation: ""
        }, {
			field: $scope.signup.email,
			validation: ""
        }, {
			field: $scope.signup.password,
			validation: ""
        }];
		var check = formvalidation($scope.allvalidation);
		if (check) {
			MyServices.signup($scope.signup, signupsuccess, function (err) {
				$location.url("/access/offline");
			});
		} else {
			msgforall("Completa todos los campos");
			$ionicLoading.hide();
		}

	}

	// SIGN IN
	$scope.signin = {};
	
	var signinsuccess = function (data, status) {
		$ionicLoading.hide();
		if (data != 'false') {

			$.jStorage.set("user", data);
			user = data;
			$location.url("/app/profile");
			$scope.signin = {};
		} else {

			var alertPopup = $ionicPopup.alert({
				title: 'Login failed!',
				template: 'Wrong username or password!'
			});
		}
	}
	$scope.signinsubmit = function (signin) {
		$ionicLoading.show();
		$scope.allvalidation = [{
			field: $scope.signin.username,
			validation: ""
        }, {
			field: $scope.signin.password,
			validation: ""
        }];
		var check = formvalidation($scope.allvalidation);
		if (check) {
			MyServices.signin(signin, signinsuccess, function (err) {
				$location.url("/access/offline");
			});
		} else {
			msgforall("Fill all data");
			$ionicLoading.hide();
		}

	}

	//        ***** tabchange ****

	$scope.tab = 'signin';
	$scope.classa = 'active';
	$scope.classb = '';

	$scope.tabchange = function (tab, a) {

		$scope.tab = tab;
		if (a == 1) {
			$scope.classa = "active";
			$scope.classb = '';

		} else {
			$scope.classa = '';
			$scope.classb = "active";

		}
	};

	//    ****** End ******

})

.controller('ResetPasswordCtrl', function ($scope) {
	addanalytics("Reset password");
	// loader
	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-royal"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};

	$scope.showPopup2 = function () {
		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">Your password is updated!</p>',
			title: 'Password updated!',
			scope: $scope,

		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);
	};

	$scope.showPopup3 = function () {

		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">Your passwords do not match!</p>',
			title: 'Sorry!',
			scope: $scope,

		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);
	};

	$scope.showPopup4 = function () {

		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">Something went wrong!</p>',
			title: 'Oops! Try again.',
			scope: $scope,

		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);
	};

	$scope.password = {};
	var changepasswordcallback = function (data, status) {
		if (data == 1) {
			$scope.showPopup2();
			$ionicLoading.hide();
			$scope.password = {};
		} else if (data == 0) {
			$ionicLoading.hide();
			$scope.showPopup4();
		} else if (data == -1) {
			$ionicLoading.hide();
			$scope.showPopup3();
		}
	}

	$scope.changepassword = function (password) {
		$ionicLoading.show();

		$ionicLoading.show();
		$scope.allvalidation = [{
			field: $scope.password.oldpassword,
			validation: ""
        }, {
			field: $scope.password.newpassword,
			validation: ""
        }, {
			field: $scope.password.confirmpassword,
			validation: ""
        }];
		var check = formvalidation($scope.allvalidation);
		if (check) {
			MyServices.changepassword(password, changepasswordcallback, function (err) {
				$location.url("/access/offline");
			});
		} else {
			msgforall("Fill all data");
			$ionicLoading.hide();
		}

	}

})


























.controller('LoginCtrl', function ($scope, MyServices, $ionicPopup, $interval, $location, $window, $ionicLoading, $timeout) {
	addanalytics("flexible login page");
	$scope.logindata = {};
	$.jStorage.flush();

	$scope.forgotpass = function () {
		$location.url("/access/forgotpassword");
	}

	$scope.config = MyServices.getconfigdata();
	var loginstatus = false;

	function internetaccess(toState) {
		if (navigator) {
			if (navigator.onLine != true) {
				onoffline = false;
				$location.url("/access/offline");
			} else {
				onoffline = true;
			}
		}
	}
	$scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
		internetaccess(toState);
	});
	window.addEventListener("offline", function (e) {
		internetaccess();
	})
	window.addEventListener("online", function (e) {
		internetaccess();
	})

	$scope.setup = function () {
		$scope.config = MyServices.getconfigdata();
		_.each(JSON.parse($scope.config.config[0].text), function (n) {
			if (n.name.toLowerCase() == "email" && n.value == true) {
				$scope.logindata.email = true;
				loginstatus = true;
			} else if (n.name.toLowerCase() == "google" && n.value == true) {
				$scope.logindata.google = true;
				loginstatus = true;
			} else if (n.name.toLowerCase() == "twitter" && n.value == true) {
				$scope.logindata.twitter = true;
				loginstatus = true;
			} else if (n.name.toLowerCase() == "instagram" && n.value == true) {
				$scope.logindata.instagram = true;
				loginstatus = true;
			} else if (n.name.toLowerCase() == "facebook" && n.value == true) {
				$scope.logindata.facebook = true;
				loginstatus = true;
			} else {}
		})
		if (loginstatus == false) {
			$location.url("/app/home");
		}
	}

	MyServices.getallfrontmenu(function (data) {
		MyServices.setconfigdata(data);
		$scope.setup();
	}, function (err) {
		$location.url("/access/offline");
	})

	// loader
	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};

	//logins
	var checktwitter = function (data, status) {
		if (data != "false" && data != '') {
			$interval.cancel(stopinterval);
			ref.close();
			MyServices.authenticate().success(authenticatesuccess);
		} else {

		}
	};

	var callAtIntervaltwitter = function () {
		MyServices.authenticate().success(checktwitter);
	};
	var authenticatesuccess = function (data, status) {
		$ionicLoading.hide();
		if (data != "false") {
			$.jStorage.set("user", data);
			user = data;
			reloadpage = true;
			$location.url("/app/home");
		}
	};
	
	$scope.facebooklogin = function () {
		ref = cordova.InAppBrowser.open(adminhauth + 'login/Facebook?returnurl=http://coffeebox.greenfig.com.mx', '_blank', 'location=no');
		stopinterval = $interval(callAtIntervaltwitter, 2000);
		ref.addEventListener('exit', function (event) {
			MyServices.authenticate().success(authenticatesuccess);
			$interval.cancel(stopinterval);
		});
	}
	$scope.twitterlogin = function () {

		ref = cordova.InAppBrowser.open(adminhauth + 'login/Twitter', '_blank', 'location=no');
		stopinterval = $interval(callAtIntervaltwitter, 2000);
		ref.addEventListener('exit', function (event) {
			MyServices.authenticate().success(authenticatesuccess);
			$interval.cancel(stopinterval);
		});
	}

	$scope.instagramlogin = function () {
		ref = cordova.InAppBrowser.open(adminhauth + 'login/Instagram?returnurl=http://coffeebox.greenfig.com.mx', '_blank', 'location=no');
		stopinterval = $interval(callAtIntervaltwitter, 2000);
		ref.addEventListener('exit', function (event) {
			MyServices.authenticate().success(authenticatesuccess);
			$interval.cancel(stopinterval);
		});
	}

	$scope.googlelogin = function () {

			ref = cordova.InAppBrowser.open(adminhauth + 'login/Google?returnurl=http://coffeebox.greenfig.com.mx', '_blank', 'location=no');
			stopinterval = $interval(callAtIntervaltwitter, 2000);
			ref.addEventListener('exit', function (event) {
				MyServices.authenticate().success(authenticatesuccess);
				$interval.cancel(stopinterval);
			});
		}
		// popup
	$scope.showPopupsignupsuccess = function () {

		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">Successfully registered!</p>',
			title: 'Congrats!',
			scope: $scope,

		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);
	};
	$scope.showPopupsignupfailure = function () {
		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">User already exist</p>',
			title: 'Oops!',
			scope: $scope,

		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);
	};

	//SIGN UP FORM
	$scope.signup = {};
	var signupsuccess = function (data, status) {
		if (data != "false") {
			$.jStorage.set("user", data);
			user = data;
			var myPopup = $ionicPopup.show({
				template: '<p class="text-center">Signed up successfully!</p>',
				title: 'Congrats!',
				scope: $scope,

			});
			$timeout(function () {
				myPopup.close(); //close the popup after 3 seconds for some reason
				$location.url("/app/home");
			}, 2000);

		} else {
			$scope.showPopupsignupfailure();
		}
		$ionicLoading.hide();
		$scope.signup = {};
	}

	var msgforall = function (msg) {
		$ionicLoading.hide();
		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">' + msg + '</p>',
			title: 'Login',
			scope: $scope,

		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);

	}

	$scope.signupsubmit = function (signup) {
		$ionicLoading.show();
		$scope.allvalidation = [{
			field: $scope.signup.username,
			validation: ""
        }, {
			field: $scope.signup.email,
			validation: ""
        }, {
			field: $scope.signup.dob,
			validation: ""
        }, {
			field: $scope.signup.password,
			validation: ""
        }];
		var check = formvalidation($scope.allvalidation);
		if (check) {
			MyServices.signup($scope.signup, signupsuccess, function (err) {
				$location.url("/access/offline");
			});
		} else {
			msgforall("Fill all data");
			$ionicLoading.hide();
		}

	}

	// SIGN IN
	$scope.signin = {};
	var signinsuccess = function (data, status) {
		$ionicLoading.hide();
		if (data != 'false') {

			$.jStorage.set("user", data);
			user = data;
			$location.url("/app/home");
			$scope.signin = {};
		} else {

			var alertPopup = $ionicPopup.alert({
				title: 'Login failed!',
				template: 'Wrong username or password!'
			});
		}
	}
	$scope.signinsubmit = function (signin) {
		$ionicLoading.show();
		$scope.allvalidation = [{
			field: $scope.signin.username,
			validation: ""
        }, {
			field: $scope.signin.password,
			validation: ""
        }];
		var check = formvalidation($scope.allvalidation);
		if (check) {
			MyServices.signin(signin, signinsuccess, function (err) {
				$location.url("/access/offline");
			});
		} else {
			msgforall("Fill all data");
			$ionicLoading.hide();
		}

	}

	//        ***** tabchange ****

	$scope.tab = 'signin';
	$scope.classa = 'active';
	$scope.classb = '';

	$scope.tabchange = function (tab, a) {

		$scope.tab = tab;
		if (a == 1) {
			$scope.classa = "active";
			$scope.classb = '';

		} else {
			$scope.classa = '';
			$scope.classb = "active";

		}
	};

	//    ****** End ******

})

.controller('ResetPasswordCtrl', function ($scope) {
	addanalytics("Reset password");
	// loader
	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};

	$scope.showPopup2 = function () {
		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">Your password is updated!</p>',
			title: 'Password updated!',
			scope: $scope,

		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);
	};

	$scope.showPopup3 = function () {

		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">Your passwords do not match!</p>',
			title: 'Sorry!',
			scope: $scope,

		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);
	};

	$scope.showPopup4 = function () {

		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">Something went wrong!</p>',
			title: 'Oops! Try again.',
			scope: $scope,

		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);
	};

	$scope.password = {};
	var changepasswordcallback = function (data, status) {
		if (data == 1) {
			$scope.showPopup2();
			$ionicLoading.hide();
			$scope.password = {};
		} else if (data == 0) {
			$ionicLoading.hide();
			$scope.showPopup4();
		} else if (data == -1) {
			$ionicLoading.hide();
			$scope.showPopup3();
		}
	}

	$scope.changepassword = function (password) {
		$ionicLoading.show();

		$ionicLoading.show();
		$scope.allvalidation = [{
			field: $scope.password.oldpassword,
			validation: ""
        }, {
			field: $scope.password.newpassword,
			validation: ""
        }, {
			field: $scope.password.confirmpassword,
			validation: ""
        }];
		var check = formvalidation($scope.allvalidation);
		if (check) {
			MyServices.changepassword(password, changepasswordcallback, function (err) {
				$location.url("/access/offline");
			});
		} else {
			msgforall("Fill all data");
			$ionicLoading.hide();
		}

	}

})

.controller('ForgotPasswordCtrl', function ($scope, $ionicLoading, $timeout, MyServices, $location, $ionicPopup) {
	addanalytics("Forgot password");
	// loader
	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};
	var forgotpasswordcallback = function (data, status) {
		console.log(data);
		$ionicLoading.hide();
		if (data == "true") {
			var myPopup = $ionicPopup.show({
				template: '<p class="text-center">Please check your email, an email has been send to your id.</p>',
				title: 'Email sent!',
				scope: $scope,

			});
			$timeout(function () {
				myPopup.close(); //close the popup after 3 seconds for some reason
				$location.url("/access/login");
			}, 2000);

		} else {
			var myPopup = $ionicPopup.show({
				template: '<p class="text-center">Not a valid email.</p>',
				title: 'Oops! Try again.',
				scope: $scope,

			});
			$timeout(function () {
				myPopup.close(); //close the popup after 3 seconds for some reason
			}, 2000);
		}
	}
	$scope.forgotpassword = function (email) {
		$ionicLoading.show();
		MyServices.forgotpassword(email, forgotpasswordcallback, function (err) {
			$location.url("/access/offline");
		});
	}
})

.controller('SignupCtrl', function ($scope) {

})

.controller('HomeCtrl', function ($scope, $location, $window, MyServices, $ionicLoading, $timeout, $sce, $ionicSlideBoxDelegate) {
	addanalytics("Home page");
	configreload.onallpage();
	var showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 3000);
	};
	showloading();

	var loginstatus = false;
	var menu = {};
	menu.setting = false;

	$scope.content = {};
	MyServices.gethomecontent(function (data) {
		$scope.content = data;
		$scope.content.content = $sce.trustAsHtml($scope.content.content);
		//		$ionicLoading.hide();
	}, function (err) {
		$location.url("/access/offline");
	});
	
	 $scope.setup = function () {
		
		var blogdata = JSON.parse(MyServices.getconfigdata().config[0].text);
		_.each(blogdata, function (n) {
			if (n.value == true) {
				loginstatus = true;
			}
		});


		if (loginstatus == false) {
			menu.setting = true;
			//$.jStorage.deleteKey("user");
		} 

		else {
			if (!MyServices.getuser() && MyServices.getuser() == null) {
				$location.url("/access/profile");
				menu.setting = true;
				//		$ionicLoading.hide();
			} else {
				$ionicLoading.hide();
			}
		}
	}  

	MyServices.getallfrontmenu(function (data) {
		MyServices.setconfigdata(data);
		$scope.setup();
	}, function (err) {
		$location.url("/access/offline");
	})

	MyServices.getallsliders(function (data) {
		$scope.slides = data;
		$ionicSlideBoxDelegate.update();
	}, function (err) {
		$location.url("/access/offline");
	});

})






.controller('TeamCtrl', function ($scope) {

})

.controller('OfflineCtrl', function ($scope, $ionicLoading) {
	addanalytics("Offline page");
	$ionicLoading.hide();
})



.controller('ProfileCtrl', function ($scope, MyServices, $location, $ionicLoading, $ionicPopup, $timeout, $cordovaFileTransfer, $cordovaImagePicker, $filter) {

	configreload.onallpage();
	$scope.edit = false;
	$scope.user = {};
	$scope.user.newimage = "";

	$scope.userpromo = {};

	$scope.password = {};
	//	$scope.user.dob = moment().format("YYYY-MM-DD");

	$scope.changeedit = function (val) {

		if ($.jStorage.get("user") && $.jStorage.get("user").dob)
			$scope.user.dob = new Date($.jStorage.get("user").dob);
		if (!_.isDate($scope.user.dob)) {
			$scope.user.dob = moment($scope.user.dob, "YYYY-MM-DD");
		}
		if (!_.isDate($scope.user.dob)) {
			$scope.user.dob = moment($scope.user.dob);
		}

		$scope.edit = val;
	}

	var showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};
	showloading();
	
	MyServices.getsingleuserdetail(function (data) {
		$ionicLoading.hide();
		$scope.user = data;
		addanalytics(data.name);
		$scope.user.newcoverimage = {
			'background-image': "url('" + $filter("serverimage")($scope.user.coverimage) + "')"
		};
		$scope.user.newimage = {
			'background-image': "url('" + $filter("profileimg")($scope.user.image) + "')"
		};

	}, function (err) {
		$location.url("/access/offline");
	});


    MyServices.getsingleuserPromo(function (data) {
		$ionicLoading.hide();
		$scope.userpromo = data;
		addanalytics(data.name);
		
		/*$scope.userpromo.newcoverimage = {
			'background-image': "url('" + $filter("serverimage")($scope.user.coverimage) + "')"
		};
		$scope.user.newimage = {
			'background-image': "url('" + $filter("profileimg")($scope.user.image) + "')"
		};*/

		$scope.userpromo.cantidad;

	}, function (err) {
		$location.url("/access/offline");
	});



	$scope.showPopup1 = function () {
		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">Your profile is updated!</p>',
			title: 'Thank you!',
			scope: $scope,

		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);
	};

	$scope.saveProfile = function () {
		MyServices.editprofile($scope.user, function (data, status) {
			if (data != 0) {
				$.jStorage.set("user", data);
				$scope.showPopup1();
				$scope.edit = !$scope.edit;
			}
		}, function (err) {
			$location.url("/access/offline");
		})
	}

	$scope.passwordpopup = function (msg) {
		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">' + msg + '</p>',
			title: 'Forgot Password!',
			scope: $scope,

		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);
	};

	$scope.changePassword = function () {
		$scope.password.id = MyServices.getuser().id;


		$scope.allvalidation = [{
			field: $scope.password.oldpassword,
			validation: ""
        }, {
			field: $scope.password.newpassword,
			validation: ""
        }, {
			field: $scope.password.confirmpassword,
			validation: ""
        }];
		var check = formvalidation($scope.allvalidation);
		if (check) {
			MyServices.changepassword($scope.password, function (data) {
				if (data == -1) {
					$scope.passwordpopup("Both the passwords does not match");
				} else if (data == 0) {
					$scope.passwordpopup("Old password does not match");
				} else {
					$scope.passwordpopup("Password changed successfully");
				}
				console.log(data);
			}, function (err) {
				$location.url("/access/offline");
			});
		} else {
			$ionicLoading.hide();
			$scope.passwordpopup("Please enter all the fields.");
		}

	}

	//	pick image from gallery
	var options = {
		maximumImagesCount: 1,
		width: 800,
		height: 800,
		quality: 80,
		allowEdit: true

	};
	$scope.picFromGallery = function () {
		$cordovaImagePicker.getPictures(options).then(function (resultImage) {
			$scope.user.newimage = {
				'background-image': "url('" + resultImage[0] + "')"
			};
			$cordovaFileTransfer.upload(adminurl + "profileimageupload?id=" + MyServices.getuser().id, resultImage[0], {})
				.then(function (result) {
					var data = JSON.parse(result.response);
					$ionicLoading.hide();
				}, function (err) {}, function (progress) {});

		}, function (err) {
			// An error occured. Show a message to the user
		});
	};

	$scope.picImageForCover = function () {
		$cordovaImagePicker.getPictures(options).then(function (resultImage) {
			$scope.user.newcoverimage = {
				'background-image': "url('" + resultImage[0] + "')"
			};
			$cordovaFileTransfer.upload(adminurl + "coverimageupload?id=" + MyServices.getuser().id, resultImage[0], {})
				.then(function (result) {
					var data = JSON.parse(result.response);
					$ionicLoading.hide();
				}, function (err) {}, function (progress) {;
				});
		}, function (err) {
			// An error occured. Show a message to the user
		});

	};
})


.controller('CafesCtrl', function ($scope, MyServices, $location, $ionicLoading, $ionicPopup, $timeout, $filter, $compile) {
	addanalytics("Cafe page");
	configreload.onallpage();
	$ionicLoading.show();
	$scope.pageno = 1;
	$scope.cafes = [];
	$scope.keepscrolling = true;
	$scope.msg = "Cargando....";


	
	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};

	$scope.loadcafes = function (pageno) {
		MyServices.getallcafes(pageno, function (data) {
			$ionicLoading.hide();
			_.each(data.queryresult, function (n) {
				$scope.cafes.push(n);
			});

			if ($scope.cafes.length == 0) {
				$scope.msg = "No data found.";
			} else {
				$scope.msg = "";
			}

			if (data.queryresult.length == 0) {
				$scope.keepscrolling = false;
			}
		}, function (err) {
			$location.url("/access/offline");
		})
		$scope.$broadcast('scroll.infiniteScrollComplete');
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.loadcafes(1);

	$scope.loadMorePolls = function () {
		$scope.loadcafes(++$scope.pageno);
	}

	$scope.getcafedetails = function (id) {
		$location.url("app/cafedetail/" + id);
	}





})


.controller('CafeDetailCtrl', function ($scope, $http, $stateParams, $location, MyServices, $ionicLoading, $ionicPopup, $timeout, $ionicSlideBoxDelegate, $ionicModal, $compile) {
	/**añadido 9 de octubre */
	configreload.onallpage();
if ($.jStorage.get("user")) {

		MyServices.getsingleuserdetail(function (data) {
			$scope.userdetails = data;
			
		}, function (err) {
			$location.url("/access/offline");
		});

	}
/* 4 de dic 2017
	    MyServices.getsingleuserdetail(function (data) {
			$scope.userdetails = data;
		}, function (err) {
			$location.url("/access/offline");
		});
*/
	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-royal"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};






	$scope.msg = "Cargando...";
	$scope.video = {};
	$scope.image = {};
	$scope.edit = false;
		
	var init = function () {
		return $ionicModal.fromTemplateUrl('templates/appView/modal-video.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modal = modal;

		});
	};

	$ionicModal.fromTemplateUrl('templates/appView/modal-image.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.modal = modal;

	});

	$scope.showVideo = function (url) {
		console.log(url);
		init().then(function () {
			$scope.modal.show();
		});
		$scope.video.url = url + "?autoplay=1";
	};
	$scope.showImage = function (url) {
		$scope.modal.show();
		$scope.image.img = url;
	};

	$scope.closeVideo = function () {
		$scope.modal.remove()
			.then(function () {
				$scope.modal = null;
			});
	};
	
	$scope.closeImage = function () {
		$scope.modal.hide()
	};

	$scope.id = $stateParams.id;

	$scope.ratingsObject = {
        iconOn: 'ion-ios-star',    //Optional
        iconOff: 'ion-ios-star-outline',   //Optional
        iconOnColor: 'rgb(202, 0, 136)',  //Optional
        iconOffColor:  'rgb(202, 0, 136)',    //Optional
        rating:1 , //Optional
        minRating:1,    //Optional
        readOnly: false, //Optional
        callback: function(rating, index) {    //Mandatory
          $scope.ratingscallback(rating, index);
        }
      };
	
	$scope.ratingsObject2 = {
        iconOn: 'ion-ios-star',    //Optional
        iconOff: 'ion-ios-star-outline',   //Optional
        iconOnColor: 'rgb(202, 0, 136)',  //Optional
        iconOffColor:  'rgb(202, 0, 136)',    //Optional
        rating:1 , //Optional
        minRating:1,    //Optional
        readOnly: true, //Optional
        callback: function(rating, index) {    //Mandatory
          //$scope.ratingscallback(rating, index);
        }
      };

	var getsinglecafescallback = function (data, status) {
		if (data == "") {
			$scope.msg = "No data found";
			addanalytics("Cafe detail page");
		} else {
			$scope.msg = "";
			addanalytics(data.title);
		}
		if (data.cafeimages && data.cafeimages.length > 0) {
			data.cafeimages = _.chunk(data.cafeimages, 2);
		}
		if (data.cafevideos && data.cafevideos.length > 0) {
			data.cafevideos = _.chunk(data.cafevideos, 2);
		}
		
   $scope.cafedetail = data;
        $ionicSlideBoxDelegate.update
		$scope.ratingsObject2.rating=data.rating;		

	}

	MyServices.getsinglecafes($stateParams.id, getsinglecafescallback, function (err) {
		$location.url("/access/offline");
	})

    $scope.rating = {};

    $scope.showPopup1 = function () {
        var myPopup = $ionicPopup.show({
			template: '<p class="text-center">Gracias por tu Valoración!</p>',
			title: 'Gracias!',
			scope: $scope,
		});
        $timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 1000);
	};

  
    $scope.ratingscallback = function(rating, index) {
        console.log('Selected rating is : ', rating, ' and the index is : ', index, "user_id", JSON.stringify($scope.userdetails));
        $ionicLoading.hide();
        $scope.showPopup1();
        $scope.id;
        MyServices.editrating({id:$scope.id, rating:rating, user_id:$scope.userdetails.id}, function (data){
        console.log(data);
        });
        //MyServices.editrating($scope.id, )
	};





	$scope.comentario = {};
	

	var createcomentariocallback = function (data, status) {
		$ionicLoading.hide();
		if (data == 1) {
			$scope.showPopupcomentario();

			$scope.comentario = {};
		} else {
			$scope.showPopupcomentariofailure();
		}
	}

	$scope.showPopupcomentario = function () {
		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">Enviado con éxito!</p>',
			title: 'Gracias!',
			scope: $scope,
		});


		$timeout(function () {
				myPopup.close(); //close the popup after 3 seconds for some reason

		}, 2000);

		 $scope.refresh = function(){
        $state.reload(true);
    };

		
	};
	$scope.showPopupcomentariofailure = function () {

		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">Intenta de Nuevo!</p>',
			title: 'Sorry!',
			scope: $scope,
		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);
	};



//{id:$scope.id, rating:rating, user_id:$scope.userdetails.id}
	$scope.comentariosubmit = function(comentario) {
		$scope.allvalidation = [{
			field: $scope.comentario.opinion,
			validation: ""
        }];


		$scope.comentario.cafeid = $scope.cafedetail.id;
        $scope.comentario.cafenombre = $scope.cafedetail.nombre;


		var check = formvalidation($scope.allvalidation);
		if (check) {
			MyServices.createcomentario(comentario, createcomentariocallback, function (err) {
				$location.url("/app/cafes");
			});
		} else {
			msgforall('Completa el Campo');
			$ionicLoading.hide();
		}

	}

//OBTENER COMENTARIOS POR CAFE


 $http.get('http://coffeebox.greenfig.com.mx/index.php/json/getSingleComentario/'+$scope.id+'/').then(function(response) {
    $scope.json = response.data;
  });  



$scope.getsinglecomentariosubmit = function(comentario) {
		$scope.allvalidation = [{
			field: $scope.comentario.opinion,
			validation: ""
        }];


		$scope.comentario.cafeid = $scope.cafedetail.id;
        $scope.comentario.cafenombre = $scope.cafedetail.nombre;


		var check = formvalidation($scope.allvalidation);
		if (check) {
			MyServices.createcomentario(comentario, createcomentariocallback, function (err) {
				$location.url("/app/cafes");
			});
		} else {
			msgforall('Completa el Campo');
			$ionicLoading.hide();
		}

	}






})

/* fin cafe*/

.controller('EventsCtrl', function ($scope, MyServices, $location, $ionicLoading, $filter) {
	addanalytics("Event page");
	configreload.onallpage();
	$ionicLoading.show();
	$scope.pageno = 1;
	$scope.events = [];
	$scope.keepscrolling = true;
	$scope.msg = "Loading....";
	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};

	$scope.share = function (item) {
		var data = {};
		data.startdate = $filter('date')(item.startdate, 'dd MMM, yyyy');
		data.starttime = $filter('convertto12')(item.starttime);
		data.image = $filter('serverimage')(item.image);
		window.plugins.socialsharing.share('Checkout "' + item.title + '" starting on ' + data.startdate + ', ' + data.starttime, null, data.image + 'At ' + item.venue);
	}

	$scope.loadevents = function (pageno) {
		MyServices.getallevents(pageno, function (data) {
			$ionicLoading.hide();
			_.each(data.queryresult, function (n) {
				$scope.events.push(n);
			});

			if ($scope.events.length == 0) {
				$scope.msg = "No data found.";
			} else {
				$scope.msg = "";
			}

			if (data.queryresult.length == 0) {
				$scope.keepscrolling = false;
			}
		}, function (err) {
			$location.url("/access/offline");
		})
		$scope.$broadcast('scroll.infiniteScrollComplete');
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.loadevents(1);

	$scope.loadMorePolls = function () {
		$scope.loadevents(++$scope.pageno);
	}

	$scope.geteventdetails = function (id) {
		$location.url("app/eventdetail/" + id);
	}

})

.controller('EventDetailCtrl', function ($scope, $stateParams, MyServices, $ionicLoading, $ionicSlideBoxDelegate, $ionicModal) {
	configreload.onallpage();
	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};

	$scope.msg = "Loading...";
	$scope.video = {};
	$scope.image = {};


	var init = function () {
		return $ionicModal.fromTemplateUrl('templates/appView/modal-video.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modal = modal;

		});
	};

	$ionicModal.fromTemplateUrl('templates/appView/modal-image.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.modal = modal;

	});

	$scope.showVideo = function (url) {
		console.log(url);
		init().then(function () {
			$scope.modal.show();
		});
		$scope.video.url = url + "?autoplay=1";
	};
	$scope.showImage = function (url) {
		$scope.modal.show();
		$scope.image.img = url;
	};

	$scope.closeVideo = function () {
		$scope.modal.remove()
			.then(function () {
				$scope.modal = null;
			});
	};
	$scope.closeImage = function () {
		$scope.modal.hide()
	};

	$scope.id = $stateParams.id;
	var getsingleeventscallback = function (data, status) {
		if (data == "") {
			$scope.msg = "No data found";
			addanalytics("Event detail page");
		} else {
			$scope.msg = "";
			addanalytics(data.title);
		}
		if (data.eventimages && data.eventimages.length > 0) {
			data.eventimages = _.chunk(data.eventimages, 2);
		}
		if (data.eventvideos && data.eventvideos.length > 0) {
			data.eventvideos = _.chunk(data.eventvideos, 2);
		}
		$scope.eventdetail = data;
		$ionicSlideBoxDelegate.update();
	}
	MyServices.getsingleevents($stateParams.id, getsingleeventscallback, function (err) {
		$location.url("/access/offline");
	})
})

.controller('BlogsCtrl', function ($scope, MyServices, $location, $ionicLoading) {
	configreload.onallpage();
	$scope.blogs = [];
	$ionicLoading.show();
	$scope.pageno = 1;
	$scope.keepscrolling = true;
	$scope.msg = "Loading...";
	// loader

	$scope.getblogdetailscms = function (id) {
		$location.path('/app/blogdetail/' + id);
	}
	showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};

	$scope.blogDetail = function (blog, name) {
		$ionicLoading.show();
		blog.provider = name;
		$.jStorage.set('postdetail', blog);
		if (name == "cms") {
			$location.path('/app/blogdetail/' + blog.id);
		} else {
			$location.path('/app/blogdetail/0');
		}
	}

	$scope.reloadblog = function (page) {
		MyServices.getallblog(page, function (data, status) {
//			console.log(data);
			$ionicLoading.hide();
			_.each(data.queryresult, function (n) {
				$scope.blogs.push(n);
			});

			if (data.queryresult.length == 0) {
				$scope.keepscrolling = false;
			}
			if ($scope.blogs.length != 0) {
				$scope.msg = "";
			} else {
				$scope.msg = "No data found";
			}
		}, function (err) {
			$location.url("/access/offline");
		});
		$scope.$broadcast('scroll.infiniteScrollComplete');
		$scope.$broadcast('scroll.refreshComplete');
	}


	if ($.jStorage.get("blogType") && $.jStorage.get("blogType").name.toLowerCase() == "wordpress") {
		addanalytics("Wordpress blog");
		$scope.showWordpress = true;
		$scope.keepscrolling = false;
		Wordpress_UserName = $.jStorage.get("blogType").appid;
		MyServices.getWordpressPosts($.jStorage.get("blogType").appid, function (data, status) {
			$ionicLoading.hide();
			$scope.blogs = data.posts;
		});
	} else if ($.jStorage.get("blogType") && $.jStorage.get("blogType").name.toLowerCase() == "tumblr") {
		addanalytics("Tumblr Blog");
		$scope.showTumblr = true;
		$scope.keepscrolling = false;
		Tumblr_UserName = $.jStorage.get("blogType").appid;
		MyServices.getTumblrPosts($.jStorage.get("blogType").appid, function (data, status) {

			$ionicLoading.hide();
			if (data) {
				$scope.msg = "";
				$scope.blogs = data.response.posts;
			} else {
				$scope.msg = "No blog data or Invalid blog";
			}
		});
	} else if ($.jStorage.get("blogType") && $.jStorage.get("blogType").name.toLowerCase() == "cms") {
		addanalytics("Custom blog");
		$scope.showCustomblog = true;
		$scope.reloadblog(1);
	} else if ($.jStorage.get("blogType") && $.jStorage.get("blogType").name.toLowerCase() == "wordpressself") {
		addanalytics("Wordpress self blog");
		$scope.showWordpressSelf = true;
		$scope.keepscrolling = false;
		Wordpress_UserName = $.jStorage.get("blogType").appid;
		MyServices.getWordpressSelfPosts($.jStorage.get("blogType").appid, function (data, status) {
			$ionicLoading.hide();
			console.log(data);
			$scope.blogs = data;
			_.each($scope.blogs, function(n){
				n.content = n.content.rendered;
			});
		});
	}

	$scope.loadMorePolls = function () {
		$scope.reloadblog(++$scope.pageno);
	}

})

.controller('BlogDetailCtrl', function ($scope, MyServices, $ionicLoading, $stateParams, $timeout) {

	configreload.onallpage();
	$ionicLoading.hide();
	$scope.msg = "Loading....";
	var getsingleblogsuccess = function (data, status) {
		console.log(data);
		$ionicLoading.hide();
		$scope.showcmsdetail = true;
		$scope.details = data;
		addanalytics(data.title);
		if (data == '') {
			$scope.msg = "No such blog";
		} else {
			$scope.msg = "";
		}
	}

	$scope.id = $stateParams.id;

	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};
	$scope.showloading();

	// tumblr and wordpress
	if ($stateParams.id == 0) {
		$scope.msg = "";
		$ionicLoading.hide();
		$scope.details = $.jStorage.get('postdetail');
		addanalytics("tumblr wordpress blog" + $scope.details.album);
		if ($scope.details.provider == 'tumblr') {
			var newdt = $scope.details.date.split('T');
			$scope.details.date = newdt[0];
		}
	} else {
		MyServices.getsingleblog($scope.id, getsingleblogsuccess, function (err) {
			$location.url("/access/offline");
		});
	}
})

.controller('PhotoGalleryCategoryCtrl', function ($scope, MyServices, $location, $ionicLoading) {
	addanalytics("Photo gallery");
	configreload.onallpage();
	$ionicLoading.show();
	$scope.msg = "Loading....";
	$scope.pageno = 1;
	$scope.photos = [];
	$scope.keepscrolling = true;
	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};

	$scope.sendphotoid = function (id) {
		$location.url("app/photogallery/" + id);
	}

	$scope.loadgallery = function (pageno) {
		MyServices.getallgallery(pageno, function (data, status) {
			$ionicLoading.hide();

			_.each(data.queryresult, function (n) {
				$scope.photos.push(n);
			});

			if (data.queryresult == '') {
				$scope.keepscrolling = false;
			}

			if ($scope.photos.length == 0) {
				$scope.msg = "The gallery is empty.";
			} else {
				$scope.msg = "";
			}
		}, function (err) {
			$location.url("/access/offline");
		});

		$scope.$broadcast('scroll.infiniteScrollComplete');
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.loadgallery(1);

	$scope.loadMorePolls = function () {
		$scope.loadgallery(++$scope.pageno);
	}

})

.controller('PhotoGalleryCtrl', function ($scope, MyServices, $stateParams, $ionicLoading, $timeout) {
	addanalytics("Photo gallery Details");
	configreload.onallpage();
	$ionicLoading.show();
	$scope.msg = "Loading....";
	$scope.keepscrolling = true;
	$scope.photos = [];
	$scope.pageno = 1;
	// loader

	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};

	$scope.showloading();

	$scope.photoid = $stateParams.id;

	$scope.loadphoto = function (pageno) {
		MyServices.getallgalleryimage($stateParams.id, pageno, function (data, status) {
			$ionicLoading.hide();
			_.each(data.queryresult, function (n) {
				$scope.photoObj = {};
				$scope.photoObj.src = adminimage + n.src;
				$scope.photos.push($scope.photoObj);
			});
			if (data.queryresult == '') {
				$scope.keepscrolling = false;
			}

			if ($scope.photos.length == 0) {
				$scope.msg = "The gallery is empty.";
			} else {
				$scope.msg = "";
			}
		}, function (err) {
			$location.url("/access/offline");
		});
		$scope.$broadcast('scroll.infiniteScrollComplete');
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.loadphoto(1);

	$scope.loadMorePolls = function () {
		$scope.loadphoto(++$scope.pageno);
	}

})

.controller('VideoGalleryCategoryCtrl', function ($scope, MyServices, $ionicLoading) {
	addanalytics("Video Gallery Page");
	configreload.onallpage();
	$ionicLoading.show();
	$scope.videos = [];
	$scope.keepscrolling = true;
	$scope.pageno = 1;
	$scope.msg = "Loading....";
	// loader
	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};
	$scope.loadphoto = function (pageno) {
		MyServices.getallvideogallery(pageno, function (data, status) {
			$ionicLoading.hide();

			_.each(data.queryresult, function (n) {
				$scope.videos.push(n);
			});

			if (data.queryresult == '') {
				$scope.keepscrolling = false;
			}

			if ($scope.videos.length == 0) {
				$scope.msg = "The gallery is empty.";
			} else {
				$scope.msg = "";
			}

		}, function (err) {
			$location.url("/access/offline");
		});

		$scope.$broadcast('scroll.infiniteScrollComplete');
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.loadphoto(1);

	$scope.loadMorePolls = function () {
		$scope.loadphoto(++$scope.pageno);
	}
})

.controller('VideoGalleryCtrl', function ($scope, MyServices, $location, $ionicModal, $stateParams, $ionicLoading, $ionicPopup, $timeout, $ionicPlatform) {
	addanalytics("Video gallery detail page");
	configreload.onallpage();
	$ionicLoading.show();
	$scope.pageno = 1;
	$scope.videos = [];
	$scope.keepscrolling = true;
	$scope.msg = "Loading....";

	$scope.share = function (item) {
		console.log(item);
		window.plugins.socialsharing.share(item.alt, null, 'http://img.youtube.com/vi/' + item.url + '/default.jpg', 'https://www.youtube.com/watch?v=' + item.url);
	}

	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};
	$scope.showloading();
	$scope.videoid = $stateParams.id;

	$scope.loadphoto = function (pageno) {
		MyServices.getallvideogalleryvideo($scope.videoid, pageno, function (data, status) {
			$ionicLoading.hide();
			_.each(data.queryresult, function (n) {
				$scope.videos.push(n);
			});


			if (data.queryresult == '') {
				$scope.keepscrolling = false;
			}

			if ($scope.videos.length == 0) {
				$scope.msg = "The gallery is empty.";
			} else {
				$scope.msg = "";
			}
		}, function (err) {
			$location.url("/access/offline");
		});

		$scope.$broadcast('scroll.infiniteScrollComplete');
		$scope.$broadcast('scroll.refreshComplete');
	}


	$scope.loadphoto(1);

	$scope.loadMorePolls = function () {
		$scope.loadphoto(++$scope.pageno);
	}



	var init = function () {
		return $ionicModal.fromTemplateUrl('templates/appView/modal-video.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.modal = modal;

		});
	};


	$scope.showVideo = function (url) {
		init().then(function () {
			$scope.modal.show();
		});
		$scope.video = [];
		$scope.video.url = url + "?autoplay=1";
	};

	$scope.closeVideo = function () {
		$scope.modal.remove()
			.then(function () {
				$scope.modal = null;
			});
	};

	document.addEventListener('backbutton', function (event) {
		console.log("on back button");
		event.preventDefault(); // EDIT
		$scope.closeVideo();
		//		navigator.app.exitApp(); // exit the app
	});


	$ionicPlatform.onHardwareBackButton(function () {
		console.log("hardwarebutton");
		//		alert("back back");
		$scope.closeVideo();
		//		console.log("Back Button");
	});

	$scope.$on('modal.remove', function () {
		// Execute action
		console.log("on removed");
		$scope.currentURL = {};
	});

})

.controller('AccountCtrl', function ($scope, MyServices, $location, $ionicLoading, $ionicPopup, $timeout) {
	addanalytics("Account page");
	configreload.onallpage();
	if ($.jStorage.get("user")) {
		$scope.userdetails = {};
		$scope.userdetails.username = $.jStorage.get("user").username;
		if ($scope.userdetails.username == "") {
			$scope.userdetails.username = $.jStorage.get("user").name;
		}
		$scope.userdetails.userimage = $.jStorage.get("user").image;
		$scope.userdetails.useremail = $.jStorage.get("user").email;
	}

	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};
	$scope.profile = {};
	$scope.showPopup1 = function () {

		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">Tu Perfil ha sido Creado!</p>',
			title: 'Gracias!',
			scope: $scope,
		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);
	};

	var profilesubmitcallback = function (data, status) {
		$ionicLoading.hide();
		if (data == 1) {
			$scope.showPopup1();
			$scope.profile = {};
		}
	}

	$scope.profilesubmit = function (profile) {
		$ionicLoading.show();
		MyServices.profilesubmit(profile, profilesubmitcallback, function (err) {
			$location.url("/access/offline");
		})
	}
})

.controller('SettingCtrl', function ($scope, MyServices, $ionicLoading, $timeout, $location) {
	addanalytics("Setting page");
	configreload.onallpage();
	$ionicLoading.show({
		template: '<ion-spinner class="spinner-positive"></ion-spinner>'
	});
	$timeout(function () {
		$ionicLoading.hide();
	}, 5000);
	$scope.setting = {};
	MyServices.getsingleuserdetail(function (data) {
		$ionicLoading.hide();
		$scope.user = data;
		$scope.setting.videonotification = $scope.user.videonotification;
		$scope.setting.eventnotification = $scope.user.eventnotification;
		$scope.setting.blognotification = $scope.user.blognotification;
		$scope.setting.photonotification = $scope.user.photonotification;
		$scope.id = $scope.user.id;
	}, function (err) {
		$location.url("/access/offline");
	});

	$scope.changeSetting = function (setting) {
		setting.id = $scope.user.id;
		MyServices.changesetting(setting, function (data) {
			console.log(data);
		}, function (err) {
			$location.url("/access/offline");
		});
	}

})

.controller('SocialCtrl', function ($scope, MyServices) {
	addanalytics("Social page");
	configreload.onallpage();
	$scope.tab = 'fb';
	$scope.social = {};
	$scope.showsocial = {};

	$scope.go = function () {
		console.log("demo demo");
	}

	console.log(MyServices.getconfigdata());
	$scope.config = MyServices.getconfigdata().config;
	if ($scope.config[6]) {
		$scope.social = JSON.parse($scope.config[6].text);
		$scope.social = _.filter($scope.social, function (n) {
			return n.value != ""
		});
	}
	$scope.social = _.chunk($scope.social, 2);
	console.log($scope.social);

	$scope.goSocial = function (link) {
		console.log(link);
		console.log("dfasdf");
		if (typeof cordova != 'undefined') {
			cordova.InAppBrowser.open(link, '_blank', 'location=yes');
		} else {
			window.open(link,"_blank");
		}
	}

})

.controller('NotificationCtrl', function ($scope, MyServices, $ionicLoading, $filter, $location) {
	addanalytics("Notification page");
	configreload.onallpage();
	$scope.notification = {};
	$scope.notify = [];
	$scope.pageno = 1;
	$scope.user = MyServices.getuser();
	$scope.msg = "Loading...";






	$scope.share = function (item) {
		console.log(item);
		item.image = $filter('serverimage')(item.image);
		if (item.linktype == 17) {
			item.link = item.link;
		} else {
			item.link = null;
		}
		window.plugins.socialsharing.share(item.content, null, item.image, item.link);
	}

	//	console.log(
	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};
	$scope.loadnotification = function (pageno) {
		console.log($scope.notification);
		MyServices.getNotification(pageno, function (data) {
			console.log(data);
			console.log(data.queryresult);
			_.each(data.queryresult, function (n) {
				switch (n.linktype) {
				case '3':
					n.tolink = n.event;
					break;
				case '6':
					n.tolink = n.gallery;
					break;
				case '8':
					n.tolink = n.video;
					break;
				case '10':
					n.tolink = n.blog;
					break;
				case '2':
					n.tolink = n.article;
					break;
				case '17':
					n.tolink = n.article;
					break;
				default:
					n.tolink = 0;

				}
				n.tolinkpath = n.linktypelink;

				$scope.notify.push(n);
			});

			if ($scope.notify.length == 0) {
				$scope.msg = "No hay notificaciones.";
			} else {
				$scope.msg = "";
			}
			$ionicLoading.hide();
		}, function (err) {
			$location.url("/access/offline");
		});
		$scope.$broadcast('scroll.infiniteScrollComplete');
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.loadnotification(1);

	$scope.loadMoreNotification = function () {
		$scope.loadnotification(++$scope.pageno);
	}

	$scope.notifyclick = function (item) {
		if (item.linktype == 17) {
			window.open(item.link, '_blank', 'location=no');
		} else {
			$location.url("/app/" + item.tolinkpath + "/" + item.tolink);
		}
	}

})

.controller('ContactCtrl', function ($scope, MyServices, $location, $ionicLoading, $ionicPopup, $timeout, $compile) {
	addanalytics("Contact page");
	configreload.onallpage();
	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};
	$scope.showloading();
	

	$scope.enquiry = {};
	

	var msgforall = function (msg) {
		$ionicLoading.hide();
		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">' + msg + '</p>',
			title: 'Contact Us',
			scope: $scope,

		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);

	}
	var createenquirycallback = function (data, status) {
		$ionicLoading.hide();
		if (data == 1) {
			$scope.showPopupcontact();
			$scope.enquiry = {};
		} else {
			$scope.showPopupcontactfailure();
		}
	}

	$scope.showPopupcontact = function () {
		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">Enviado con éxito!</p>',
			title: 'Gracias!',
			scope: $scope,
		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);
	};
	$scope.showPopupcontactfailure = function () {

		var myPopup = $ionicPopup.show({
			template: '<p class="text-center">Try again!</p>',
			title: 'Sorry!',
			scope: $scope,
		});
		$timeout(function () {
			myPopup.close(); //close the popup after 3 seconds for some reason
		}, 2000);
	};

	$scope.enquiryform = function (enquiry) {
		$scope.allvalidation = [{
			field: $scope.enquiry.name,
			validation: ""
        }, {
			field: $scope.enquiry.email,
			validation: ""
        }, {
			field: $scope.enquiry.title,
			validation: ""
        }, {
			field: $scope.enquiry.content,
			validation: ""
        }];
		var check = formvalidation($scope.allvalidation);
		if (check) {
			MyServices.createenquiry(enquiry, createenquirycallback, function (err) {
				$location.url("/access/offline");
			});
		} else {
			msgforall('Fill all data');
			$ionicLoading.hide();
		}

	}

	//        ***** tabchange ****

	$scope.tab = 'contactus';
	$scope.classa = 'active';
	$scope.classb = '';

	$scope.tabchange = function (tab, a) {

		$scope.tab = tab;
		if (a == 1) {
			$scope.classa = "active";
			$scope.classb = '';

		} else {
			$scope.classa = '';
			$scope.classb = "active";

		}
	};

	//    ****** End ******

})

.controller('SearchCtrl', function ($scope, MyServices, $location, $ionicLoading, $ionicPopup, $timeout) {
	addanalytics("Search page");
	// loader
	$scope.search = {};
	$scope.search.text = "";
	configreload.onallpage();

	$scope.showloading = function () {
		$ionicLoading.show({
			template: '<ion-spinner class="spinner-positive"></ion-spinner>'
		});
		$timeout(function () {
			$ionicLoading.hide();
		}, 5000);
	};
	$scope.searchresults = [];

	var searchelementcallback = function (data, status) {
		console.log(data);
		$scope.searchresults.searchevent = data.events;
		$scope.searchresults.searchgallery = data.gallery;
		$scope.searchresults.searchvideogallery = data.videogallery;
		$scope.searchresults.blog = data.blog;
		$scope.searchresults.article = data.article;
	}
	$scope.getsearchelement = function (searchelement) {
		$timeout(function () {
			MyServices.searchelement(searchelement, searchelementcallback, function (err) {
				$location.url("/access/offline");
			});
		}, 2000)

	}

	// Go to Events page
	$scope.openevents = function (id) {
		$location.url("/app/eventdetail/" + id);
	}
	$scope.openvideogallery = function (id) {
		$location.url("/app/videogallery/" + id);
	}
	$scope.opengallery = function (id) {
		$location.url("/app/photogallery/" + id);
	}
	$scope.openblog = function (id) {
		console.log(id);
		$location.url("/app/blogdetail/" + id);
	}
	$scope.openarticle = function (id) {
		$location.url("/app/article/" + id);
	}
	$scope.clear = function () {
		$scope.search.text = "";
		$scope.searchresults = [];
	}

});