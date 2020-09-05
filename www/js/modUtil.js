angular
  .module("modUtil", [])

  .service("svcUtil", [
    "$ionicHistory",
    "$state",
    "$ionicLoading",
    "$timeout",
    function($ionicHistory, $state, $ionicLoading, $timeout) {
      var self = this;
      this.isEmptyObject = function(objt) {
        var isEmpty = true;
        if (Object.getOwnPropertyNames(objt).length === 0) {
          //console.log('empty object')
        } else {
          //console.log('non-empty object')
          isEmpty = false;
        }
        return isEmpty;
      };
      this.guardAllowSwitchPage = function(newNextPage) {
        nextPage = newNextPage;
      }; /*allowSwitchPage*/
      this.guardSwitchPage = function(
        newNextPage,
        disableAnimate,
        disableBack,
        historyRoot
      ) {
        nextPage = newNextPage;
        console.log("switchPage nextPage:", nextPage);
        $ionicHistory.nextViewOptions({
          disableAnimate: disableAnimate,
          disableBack: disableBack,
          historyRoot: historyRoot
        });
        $state.go(newNextPage);
      }; /*switchPage*/
      this.guardStateChangeStart = function(
        currentPage,
        event,
        toState,
        fromState
      ) {
        /*
            console.log('stateChangeStart')
            console.log('currentPage:',currentPage);
            console.log('event:',currentPage);
            console.log('toState:',toState);
            console.log('fromState:',fromState);
            */
        console.log("stateChangeStart nextPage:", nextPage);
        if (nextPage == "") {
          console.log("prevent hardware back button");
          event.preventDefault();
        } else {
          if (toState.name != nextPage) {
            console.log("prevent default back button");
            event.preventDefault();
          }
        }
        nextPage = "";
      }; /*stateChangeStart*/

      this.startupLoading = function() {
        $ionicLoading.show();
        function loadingEnd() {
          $ionicLoading.hide();
        }

        $timeout(loadingEnd, 1000);
      };
    }
  ]);
