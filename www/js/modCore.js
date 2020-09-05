angular
  .module("modCore", [])

  .service("svcCore", [
    "$rootScope","svcUtil",
    function($rootScope,svcUtil) {
      var self = this;

      this.initCoreData = function() {
        $rootScope.core = {
          user: {},
          fbsuser: {uid:1},
          status: {
            isSignedIn: true,
            isSignedOut: false
          }
        };
      }; /*initCoreData*/
      this.isFirstTimeUse = function() {
          console.log('isFirstTimeUse?');
          var ret=true;
          
          if (localStorage.getItem("installdate") !== null) {
              //...
              ret=false;
            }else{
              console.log('installdate not found');
              localStorage.setItem("installdate",(new Date().getTime()).toString());
              ret=true;                
            }
          return ret;
      }; /*initCoreData*/      

      this.isCoreUserFound = function() {
        var ret = false;
        if (svcUtil.isEmptyObject($rootScope.core.fbsuser)) {
          console.log("empty user object");
        } else {
          console.log("user object found");
          ret = true;
        }
        return ret;
      };
    }
  ]);
