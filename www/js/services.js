    angular
      .module("app.services", [])
      .factory("BlankFactory", [function() {}])
      .service("BlankService", [function() {}])
      .service("User", [
        "$rootScope",
        "$timeout",
        "$q",
        "$http",
        "$ionicPopup",
        "$ionicLoading",
        "$firebaseAuth",
        "$firebaseObject",
        "$firebaseArray",
        "Defaults",
        function(
          $rootScope,
          $timeout,
          $q,
          $http,
          $ionicPopup,
          $ionicLoading,
          $firebaseAuth,
          $firebaseObject,
          $firebaseArray,
          Defaults
        ) {
          var self = this; /*use self var to avoid internal conflict*/
          this.userTemplate = {
            uid: '',
            pid: '',
            rid:'',
            mobileNo:'',
            email: '',
            displayName: '',
            imageData: '',
            isAdmin: false,
            organizations: [],
            branches: [],
            departments: [],
            units: [],
            families: [],
            teams: [],
          }
          this.data = {
            userStatus: {
              isSignedOut: true,
              isSignedIn: false
            },
            userInfo: {}
          }
          var hideIonicLoadingIfItIsShowing = function() {
            $ionicLoading._getLoader().then(function(state) {
              if (state.isShown == true) {
                $ionicLoading.hide();
              }
            });
          };
          /*setLocalUserInfo*/
          this.setLocalUserInfo = function(objNewUserInfo) {
            if (objNewUserInfo != null) {
              window.localStorage.setItem('userinfo', angular.toJson(objNewUserInfo));
            } else {
              window.localStorage.removeItem('userinfo');
            }
          }
          /*setLocalUserInfo end*/
          /*getLocalUserInfo*/
          this.getLocalUserInfo = function() {
            var objLocalUserInfo = angular.fromJson(window.localStorage.getItem('userinfo'))
            console.log('getLocalUserInfo', objLocalUserInfo);
            return objLocalUserInfo;
          }
          /*getLocalUserInfo end*/
          this.updateLocalUserStatus = function(isSignedIn) {
            if (isSignedIn == true) {
              self.data.userStatus.isSignedIn = true;
              self.data.userStatus.isSignedOut = false;
            } else {
              self.data.userStatus.isSignedIn = false;
              self.data.userStatus.isSignedOut = true;
            }
          }
          this.updateLocalUserInfo = function(objLocalUser) {
            console.log(objLocalUser)
            if (objLocalUser != null) {
              self.setLocalUserInfo(objLocalUser)
              self.data.userInfo = objLocalUser;
              self.updateLocalUserStatus(true)
            } else {
              self.setLocalUserInfo(null)
              self.data.userInfo = {};
              self.updateLocalUserStatus(false)
            }
          }
          this.reloadUserInfo = function() {
            console.log('reloadUserInfo');
            var objCurrentUser = firebase.auth().currentUser;
            firebase.database().ref('/UserInfo/' + objCurrentUser.uid).once('value').then(function(snapshot) {
              self.updateLocalUserInfo(snapshot.val());
              $rootScope.$apply();
            })
          }
          this.resetUserInfo = function() {
            console.log('resetUserInfo');
            self.data.userInfo = {};
            self.setLocalUserInfo(null);
            self.data.userStatus.isSignedIn = false;
            self.data.userStatus.isSignedOut = true;
          }
          /*initLocalUserInfo*/
          this.initLocalUserInfo = function() {
            console.log('initLocalUserInfo')
            self.updateLocalUserInfo(self.getLocalUserInfo());
          }
          /*initLocalUserInfo end*/
          /*getUserInfo*/
          this.getUserInfo = function() {
            var defer = $q.defer();
            var objCurrentUser = firebase.auth().currentUser;
            //console.log(objCurrentUser.uid);
            if (objCurrentUser) {
              var dbref = firebase.database().ref("UserInfo/" + objCurrentUser.uid);
              var objUserInfo = $firebaseObject(dbref);
              objUserInfo.$loaded().then(function() {
                console.log(objUserInfo)
                if (objUserInfo.uid === undefined) {
                  angular.forEach(self.userTemplate, function(value, key) {
                    objUserInfo[key] = objCurrentUser[key] || ''
                  });
                  objUserInfo.$save();
                } else {
                  objUserInfo.timeLastLogged = new Date().getTime();
                  objUserInfo.$save();
                }
                //console.log(objUserInfo)
                defer.resolve(objUserInfo);
              });
            } else {
              defer.reject(null);
            }
            return defer.promise;
          }
          /*getUserInfo*/
          /*setUserInfo*/
          this.setUserInfo = function(objUser) {
            var objCurrentUser = firebase.auth().currentUser;
            //console.log(objCurrentUser.uid);
            if (objCurrentUser) {
              var dbref = firebase.database().ref("UserInfo/" + objCurrentUser.uid);
              var objUserInfo = $firebaseObject(dbref);
              objUserInfo.$loaded().then(function() {
                console.log(objUserInfo)
                if (objUserInfo.uid === undefined) {
                  angular.forEach(self.userTemplate, function(value, key) {
                    objUserInfo[key] = objCurrentUser[key] || ''
                  });
                  objUserInfo.$save();
                } else {
                    if(objUser!=null){
                if (objUserInfo.uid === undefined) {
                  angular.forEach(self.userTemplate, function(value, key) {
                    objUserInfo[key] = objCurrentUser[key] || ''
                  });
                  objUserInfo.timeLastLogged = new Date().getTime();
                  objUserInfo.$save();
                    }
                }
                }
                //console.log(objUserInfo)
                defer.resolve(objUserInfo);
              });
            } else {

            }

          }
          /*setUserInfo*/          
          /* viewUserInfo */
          this.popupView = function() {
            var defaults = Defaults.data;
            self.getUserInfo().then(function(objUserInfo) {
              var newScope = $rootScope.$new();
              newScope.temp = objUserInfo;
              newScope.temp.imageData = newScope.temp.imageData || defaults.images.imgPerson;
              newScope.changePhoto = function() {
                document.getElementsByClassName("inputFile")[0].click();
                var inputFile = document.getElementsByClassName("inputFile")[0];
                inputFile.addEventListener("change", onInputFileChanged);

                function onInputFileChanged(elm) {
                  var file = elm.target.files[0];
                  var reader = new FileReader();
                  var preview = document.querySelector("img");
                  reader.addEventListener(
                    "load",
                    function() {
                      //preview.src = reader.result;
                      newScope.temp.imageData = reader.result;
                      newScope.$apply();
                      console.log(newScope.temp.imageData);
                    },
                    false
                  );
                  if (file) {
                    reader.readAsDataURL(file);
                  }
                }
              };
              // Custom popup
              var myPopup = $ionicPopup.show({
                template: '<center><img width="100px" ng-src="{{temp.imageData}}" width="100px" ng-click="changePhoto()" /></center>' +
                  '<p style="text-align:center;">{{temp.email}}</p>' +
                  '<input type="file" class="inputFile" style="display:none"/>' +
                  "<br/>" +
                  '<input type = "text" ng-model = "temp.displayName" placeholder="Nama Paparan">'+
                  '<input type = "text" ng-model = "temp.rid" placeholder="No KP">' +
                  '<input type = "text" ng-model = "temp.mobileNo" placeholder="No Mobile">'                
                ,
                title: "Pengguna",
                subTitle: "Info Ringkas",
                scope: newScope,
                buttons: [{
                    text: "Cancel"
                  },
                  {
                    text: "<b>Save</b>",
                    type: "button-positive",
                    onTap: function(e) {
                      console.log(newScope)
                      if (!newScope.temp.displayName) {
                        //don't allow the user to close unless he enters model...
                        e.preventDefault();
                      } else {
                        return newScope.temp;
                      }
                    }
                  }
                ]
              });
              myPopup.then(function(res) {
                console.log("Tapped!", res);
                if (res != undefined) {
                  objUserInfo.$save();
                  self.reloadUserInfo();
                }
              });
            }); /*getUserPublic if exist*/
          }; /*viewUserInfo*/
          /*DO SIGN UP*/
          this.doSignUp = function(objUser) {
            $ionicLoading.show({
              template: "Signing In ...",
              delay: 100
            });
            return firebase
              .auth()
              .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
              .then(function() {
                return firebase.auth().createUserWithEmailAndPassword(objUser.email, objUser.password)
                  .then(function(firebaseUser) {
                    // Success 
                    console.log('success')
                    
                     self.setUserInfo() ;
                    return firebaseUser
                  })
                  .catch(function(error) {
                    // Error Handling
                    console.log('error')
                    $ionicPopup.alert({
                      title: "<span class='assertive'>" + error.code + "</span>",
                      template: error.message
                    }); /*alert*/
                  }).finally(function(final) {
                    $ionicLoading.hide()
                  });
              }) /*setpersistence.then*/
              .catch(function(error) {
                // Handle Errors here.
                $ionicLoading.hide();
                $ionicPopup.alert({
                  title: "<span class='assertive'>" + error.code + "</span>",
                  template: error.message
                }); /*alert*/
              }); /*setpersistence.then.catch*/
          };
          /*doSignUp*/
          /*DO SIGN IN*/
          this.doSignIn = function(objUser) {
            $ionicLoading.show({
              template: "Signing In ...",
              delay: 100
            });
            return firebase
              .auth()
              .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
              .then(function() {
                return firebase.auth().signInWithEmailAndPassword(objUser.email, objUser.password)
                  .then(function(firebaseUser) {
                    // Success 
                    console.log('success')
                    return firebaseUser
                  })
                  .catch(function(error) {
                    // Error Handling
                    console.log('error')
                    $ionicPopup.alert({
                      title: "<span class='assertive'>" + error.code + "</span>",
                      template: error.message
                    }); /*alert*/
                  }).finally(function(final) {
                    $ionicLoading.hide()
                  });
              }) /*setpersistence.then*/
              .catch(function(error) {
                // Handle Errors here.
                $ionicLoading.hide();
                $ionicPopup.alert({
                  title: "<span class='assertive'>" + error.code + "</span>",
                  template: error.message
                }); /*alert*/
              }); /*setpersistence.then.catch*/
          };
          /*doSignIn*/
          /*DO SIGN OUT*/
          this.doSignOut = function(scope) {
            var confirmPopup = $ionicPopup.confirm({
              title: "Sign Out",
              template: "Are you sure?",
              cssClass: "popupCustom"
            });
            confirmPopup.then(function(res) {
              if (res) {
                //console.log("Confirmed Sign Out");
                self.resetUserInfo();
                $firebaseAuth().$signOut();
              } else {
                //console.log("Cancel sign Out");
              }
            });
          };
          /*doSignOut*/
          /*VERIFY ID TOKEN*/
          this.verifyIdToken = function() {
            //console.log('verifyIdToken')
            var verifiedToken = false;
            try {
              /*try getIdToken*/
              firebase
                .auth()
                .currentUser.getIdToken( /* forceRefresh */ true)
                .then(function(idToken) {
                  //console.log('getIdToken:')
                  //console.log(idToken)
                  // Send token to backend via HTTPS
                  // manual decode at jwt.io is also possible:
                  // 1.get cert at https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com
                  // 2.check verified at jwt.io
                  var url =
                    "https://script.google.com/macros/s/AKfycbwGgYhJhIpQQi8wfyhdUHm5eupTxMRmsaq1aQlGs8kl4T1nKGEi/exec";
                  var param = "?cmd=vfyidtoken&idtoken=" + idToken;
                  //$ionicLoading.show();
                  $http
                    .get(url + param)
                    .then(function(response) {
                      if (response) {
                        //console.log(response);
                        if (response) {
                          if (response.data) {
                            verifiedToken = angular.fromJson(response.data.content);
                          }
                        }
                      }
                      console.log("Firebase Token Check:" + verifiedToken);
                    })
                    .catch(function(e) {
                      console.log("Firebase Token Check:" + e);
                    });
                })
                .catch(function(error) {
                  // Handle error
                }); /*idToken*/
            } catch (error) {
              console.log(error);
            } /*try getIdToken*/
          };
          /*verifyidToken*/
          /*PREP USER SIGN UP*/
          this.prepUserSignUp = function() {
            var newScope = $rootScope.$new();
            newScope.popupData = {};
            var strPopup =
              '<form class="list" name="formSignUp"><input type="email" placeholder="Your Email" ng-model="popupData.email" ng-required="true" name="email"><div ng-hide="formSignUp.email.$valid" class="show-list-numbers-and-dots assertive">Enter valid email</div><br/><input type="password" placeholder="Your Password (min 6 chars)" ng-model="popupData.password" name="password" ng-required="true"><br/><input type="password" placeholder="Re-enter Password" ng-model="popupData.password1" name="password1" ng-required="true"><div ng-show="userNew.password!=userNew.password1" class="show-list-numbers-and-dots assertive"><p>Passwords must match one another</p></div><p name="formvalidity" style="display:none">{{formSignUp.$valid && (userNew.password==userNew.password1)}}</p></form>';
            var strPopupTitle =
              '<div style="text-align:center;"><i class="icon positive ion-planet" style="font-size:100pt;"></i></div>Sign Up';
            var strPopupSubTitle = "Enter Email and Password for Registration";
            return $ionicPopup.show({
              template: strPopup,
              title: strPopupTitle,
              subTitle: strPopupSubTitle,
              cssClass: "popupCustom",
              scope: newScope,
              buttons: [{
                  text: "Cancel",
                  type: "button-assertive"
                },
                {
                  text: "Sign Up",
                  type: "button-calm",
                  onTap: function(e) {
                    var elem1 = document.querySelectorAll('[name="formvalidity"]')[0];
                    if (elem1.innerHTML === "true") {
                      self.doSignUp(newScope.popupData);
                      //scope.popupData={};
                    } else {
                      $ionicPopup.alert({
                        title: "<span class='assertive'>" + error.code + "</span>",
                        template: "Please complete the form"
                      }); /*alert*/
                      e.preventDefault();
                    } /*if*/
                  } /*onTap*/
                } /*button*/
              ] /*buttons*/
            }); /*show*/
            newScope.$destroy();
          };
          /*prepUserSignUp*/
          /*PREP USER SIGN IN*/
          this.prepUserSignIn = function() {
            var newScope = $rootScope.$new();
            newScope.popupData = {};
            var strPopup =
              '<form class="list" name="formSignIn"><input type="email" placeholder="Your Email" ng-model="popupData.email" ng-required="true" name="email"><div ng-hide="formSignIn.email.$valid" class="show-list-numbers-and-dots assertive">Enter valid email</div><br/><input type="password" placeholder="Your Password (min 6 chars)" ng-model="popupData.password" name="password" ng-required="true"><br/><p name="formvalidity" style="display:none">{{formSignIn.$valid}}</p></form>';
            var strPopupTitle =
              '<div style="text-align:center;"><i class="icon positive ion-planet" style="font-size:100pt;"></i></div>Sign In';
            var strPopupSubTitle = "Enter Email and Password";
            return $ionicPopup.show({
              template: strPopup,
              title: strPopupTitle,
              subTitle: strPopupSubTitle,
              cssClass: "popupCustom",
              scope: newScope,
              buttons: [{
                  text: "Cancel",
                  type: "button-assertive"
                },
                {
                  text: "Sign In",
                  type: "button-balanced",
                  onTap: function(e) {
                    var elem1 = document.querySelectorAll('[name="formvalidity"]')[0];
                    if (elem1.innerHTML === "true") {
                      //console.log(newScope.popupData)
                      return self.doSignIn(newScope.popupData);
                    } else {
                      $ionicPopup.alert({
                        title: "<span class='assertive'>" + error.code + "</span>",
                        template: "Please complete the form"
                      }); /*alert*/
                      e.preventDefault();
                    } /*if*/
                  } /*onTap*/
                } /*button*/
              ] /*buttons*/
            }); /*show*/
            newScope.$destroy();
          };
          /*prepUserSignIn*/
          /*PREP USER SIGN OUT*/
          this.prepUserSignOut = function(scope) {
            self.doSignOut();
          };
          /*prepUserSignOut*/
          this.userAction = function(strCmd, strRef, objRef) {
            //console.log(strCmd, strRef, objRef)
            switch (strCmd) {
              case "signIn":
                self.prepUserSignIn();
                break;
              case "signUp":
                self.prepUserSignUp();
                break;
              case "signOut":
                self.prepUserSignOut();
                break;
              case "verifyIdToken":
                self.verifyIdToken();
                break;
              case "popupView":
                self.popupView();
                break;
            } /*switch*/
          }
        }
      ])


    /*end of services*/
    ;