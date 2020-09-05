angular.module('app.controllers', [])
  
.controller('introCtrl', ['$scope', '$state', '$stateParams', '$ionicHistory', '$ionicLoading', '$window', 'svcUtil',   /*INTRO PAGE*/
function ($scope, $state, $stateParams, $ionicHistory,$ionicLoading,$window, svcUtil) {
  /* PAGE GUARD */
  $scope.$on("$stateChangeStart", function(
    event,
    toState,
    toParams,
    fromState,
    fromParams
  ) {
    svcUtil.guardStateChangeStart(
      $state.current.name,
      event,
      toState,
      fromState
    );
  });
  /* PAGE GUARD END */
  /* USER ACTION */
  $scope.userAction = function(strCmdGrp, strCmd, strRef, objRef) {
    switch (strCmdGrp) {
      case "nav":
        switch (strCmd) {
          case "login":
            /*(disableAnimate, disableBack, historyRoot)*/
            svcUtil.guardSwitchPage("login", true, true, true);
            break;
          case "back":
            $window.history.go(-1);
            break;            
        } /*switch2*/
        break;
    } /*switch1*/
  };
  /* USER ACTION END */
  /* PAGE EVENTS */
  $scope.$on("$ionicView.enter", function() {
    //console.log('loaded')
    $scope.page={showPage:false};
    loadImageLogo();
  });  
  /* PAGE EVENTS END */
  
  
/* CUSTOM FUNCTION */
var loadImageLogo= function(){
    var imgLogo = new Image;
    var imgHeader = new Image;
    $ionicLoading.show();
    
    imgLogo.src="https://s3.amazonaws.com/ionic-io-static/KSEVKPQNTWeGdQ0NunH6_face.jpg";
    imgHeader.src="https://s3.amazonaws.com/ionic-io-static/EHWw1P0QTWvCAXnxQaIG_amalanku-coollogo_com-18655457.png";
    
    
    imgLogo.onload = function(){
            $ionicLoading.hide();
            $scope.page.imgLogo=this.src;
            $scope.page.imgHeader=imgHeader.src;
            $scope.page.showPage=true;
    }
    
    
}

/* end CUSTOM FUNCTION  */
  
  
}
])
   
.controller('loginCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'svcUtil', 'svcCore', /*LOGIN*/
function ($rootScope, $scope, $state, $stateParams, svcUtil, svcCore) {
  /* PAGE GUARD */
  $scope.$on("$stateChangeStart", function(
    event,
    toState,
    toParams,
    fromState,
    fromParams
  ) {
    svcUtil.guardStateChangeStart(
      $state.current.name,
      event,
      toState,
      fromState
    );
  });
  /* PAGE GUARD END */

  /* USER ACTIONS */
  $scope.userAction = function(strCmdGrp, strCmd, strRef, objRef) {
    switch (strCmdGrp) {
      case "nav":
        switch (strCmd) {
          case "intro":
            localStorage.setItem("skipintro", "true");
            /*(disableAnimate, disableBack, historyRoot)*/
            svcUtil.guardSwitchPage("intro", true, true, false);
            break;
        } /*switch2*/
        break;
    } /*switch1*/
  };

  /* end USER ACTIONS */

  /* CUSTOM FUNCTIONS */

  var dummyLoading = function() {};

  /* end CUSTOM FUNCTIONS */

  /*Page events*/
  $scope.$on("$ionicView.loaded", function() {
    //console.log('loaded')
    svcCore.initCoreData();
  });
  $scope.$on("$ionicView.beforeEnter", function() {
    //console.log('beforeEnter')
    if (svcCore.isFirstTimeUse()){
            svcUtil.guardSwitchPage("intro", true, true, false);        
    }else{
      svcUtil.guardSwitchPage("menu.home", true, true, true);        
    }    
    svcUtil.startupLoading();
    if (svcCore.isCoreUserFound()) {
      //console.log("core user found");
      /*(disableAnimate, disableBack, historyRoot)*/
      svcUtil.guardSwitchPage("menu.home", true, true, true);
    } else {
      //console.log("core user not found");
    }
  });
  /*end Page events*/
}
])
   
.controller('homeCtrl', ['$rootScope', '$scope', '$stateParams', 'svcUtil', 'svcDiary', function ($rootScope,$scope, $stateParams,svcUtil,svcDiary) {
  /* USER ACTIONS */
  $scope.userAction = function(strCmdGrp, strCmd, strRef, objRef) {
    switch (strCmdGrp) {
      case "":
        switch (strCmd) {
          case "":
            break;
        } /*switch2*/        
        break;
    } /*switch1*/
  };
  /* end USER ACTIONS */       


  /*Page events*/
  $scope.$on("$ionicView.loaded", function() {
    $rootScope.EzziDiary={
        diary:[],
        selectedTid:""
    }      
      $scope.recordTemp={};
      $scope.initDiary();
  });
  
  $scope.$on("$ionicView.enter", function() {
      console.log($stateParams.data)
      if($rootScope.EzziDiary.selectedTid==""){
          $scope.setDate(new Date());
      }else{
          $scope.setDate(new Date(Number($rootScope.EzziDiary.selectedTid)));          
      }
  });
  /*end Page events*/


/* CUSTOM FUNCTIONS */

$scope.initDiary=function(){
    $scope.diary=svcDiary.initDiary();
    console.log('diary:',$scope.diary);    
}


$scope.setDate=function(date){
    var today = moment(date).toDate();  // This will return a copy of the Date that the moment uses
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    //console.log(today)
    var ym=moment(today).format("YYYYMM");
    var tid = today.getTime();
    //console.log(tid)    
    $scope.recordTemp={dateValue:date,tid:tid,ym:ym}          
    //console.log($scope.recordTemp);
    $scope.loadRecords($scope.recordTemp.tid.toString())
}

$scope.loadRecords=function(strgTid){
    //console.log($scope.recordTemp)
    var templateDaily=svcDiary.getTemplateDaily();
    //console.log('templateDaily:',templateDaily);
    var templateDeeds=svcDiary.getTemplateDeeds();
    //console.log('templateDeeds:',templateDeeds);
    var templateDeedsKeys =Object.keys(templateDeeds);
    templateDeedsKeys.sort();
    //console.log('templateDeedsKeys:',templateDeedsKeys);
    
    $scope.recordDaily=svcDiary.getDailyRecord(strgTid)||{};
    //console.log('$scope.recordDaily1:',$scope.recordDaily)
    
    if(svcUtil.isEmptyObject($scope.recordDaily)){
        templateDaily.ym=$scope.recordTemp.ym.toString();
        templateDaily.tid=$scope.recordTemp.tid.toString();
        $scope.recordDaily=templateDaily;
    }
    //console.log('$scope.recordDaily2:',$scope.recordDaily);    
    
    var tempDeeds=$scope.recordDaily.deeds||{}; 
    //console.log('tempDeeds:',tempDeeds);
    
    $scope.recordDeeds=[];
    if(Object.keys(tempDeeds).length>0){
        //console.log('objt tempDeeds contain props')
        for (i in templateDeedsKeys){
            //console.log(i);
            //console.log(templateDeedsKeys[i]);
            templateDeeds[templateDeedsKeys[i]]=tempDeeds[templateDeedsKeys[i]]
            //console.log('tempDeeds[templateDeedsKeys[i]]:',tempDeeds[templateDeedsKeys[i]])
            //console.log('templateDeeds[templateDeedsKeys[i]]:',templateDeeds[templateDeedsKeys[i]])
            if(templateDeeds[templateDeedsKeys[i]]!==undefined){
                $scope.recordDeeds.push(templateDeeds[templateDeedsKeys[i].toString()])                
            }

        }
        
    }else{
        for (i in templateDeeds){
            $scope.recordDeeds.push(templateDeeds[i]);
        }
        $scope.recordDaily.deeds=templateDeeds;
    }
    //console.log('$scope.recordDeeds:',$scope.recordDeeds);
    //console.log('$scope.recordDaily3:',$scope.recordDaily)
}

$scope.updateRecords=function(objtItem,indx){
    //console.log($scope.recordDeeds);
    //console.log($scope.recordDeeds[indx]);
    //console.log($scope.recordDaily);
    //console.log(objtItem)
    //console.log(indx)
    
    var score = Number($scope.recordDaily.score)
    console.log(score)
    console.log($scope.recordDeeds[indx].done);
    if ($scope.recordDeeds[indx].done===true ){score++}
    if ($scope.recordDeeds[indx].done===false ){score--}
    //console.log(score)    
    $scope.recordDaily.score=score;
    
    var tempDeeds={}
    for (i in $scope.recordDeeds){
        tempDeeds[$scope.recordDeeds[i].id]=$scope.recordDeeds[i]
    }
    
    $scope.recordDaily.deeds=tempDeeds;
    //console.log($scope.recordDaily);
    //console.log($scope.recordDaily.tid);
    svcDiary.saveDailyRecord($scope.recordDaily,$scope.recordDaily.tid.toString())
}


/* CUSTOM FUNCTIONS */

}])
   
.controller('othersCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$ionicPopup', 'PageGuard', '$http', '$ionicLoading', 'svcDirektori', '$firebaseAuth', 'svcEzzi', function (
  $rootScope,
  $scope,
  $state,
  $stateParams,
  $ionicPopup,
  PageGuard,
  $http,
  $ionicLoading,
  svcDirektori,
  $firebaseAuth,
  svcEzzi
) {
    
    
      // Custom popup
      var myPopup = $ionicPopup.show({
         template: 
        '<div class="item item-icon-left" ion-datetime-picker datetime ng-model="recordTemp.datetimeValue">'+
        '<i class="icon ion-ios-calendar positive"></i>'+
        '<strong>{{recordTemp.datetimeValue| date: "yyyy-MM-dd H:mm"}}</strong>'+
        '</div>'+
        '<label class="item item-input">'+
        '<input type="text" placeholder="keterangan" ng-model="recordTemp.desc">'+
        '</label>',
         title: 'Tarikh',
         subTitle: 'masukkan info aktiviti',
         scope: $scope,
			
         buttons: [
            { text: 'Cancel', 
               onTap: function(e) {
                   console.log('cancel tapped.');
					return $scope.recordTemp={};	
               }                
            }, {
               text: '<b>OK</b>',
               type: 'button-positive',
               onTap: function(e) {
						
                  if (!$scope.recordTemp.datetimeValue) {
                     //don't allow the user to close unless he enters model...
                     e.preventDefault();
                  } else {
                     return $scope.recordTemp;
                  }
               }
            }
         ]
      });

      myPopup.then(function(res) {
        if (svcUtil.isEmptyObject(res)){
            console.log('empty temp data. edit aborted.')
            return;
        }  
        var tid =$scope.recordTemp.datetimeValue.getTime().toString() || "";
            var objtData={tid:tid,"desc":$scope.recordTemp.desc,"atnd":""}
            var objtSystVar={
                orgn: $rootScope.Ezzi.syst.orgn_hid,
                appl: $rootScope.Ezzi.syst.appl_hid,
                wgrp: $rootScope.Ezzi.appl.wgrp.hid
            }
         reqsApplActv(objtSystVar,strgOprn,objtData);            
        });    
    
 
}
])
   
.controller('menuCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'svcUtil', /*MENU*/
function ($rootScope,$scope, $state, $stateParams, svcUtil) {
  /* USER ACTIONS */
  $scope.userAction = function(strCmdGrp, strCmd, strRef, objRef) {
    switch (strCmdGrp) {
      case "user":
        switch (strCmd) {
          case "signOut":
            /*(disableAnimate, disableBack, historyRoot)*/
            $rootScope.core.fbsuser={}
            console.log($rootScope.core)
            svcUtil.guardSwitchPage("login", true, true, true);
            break;
        } /*switch2*/
        break;
    } /*switch1*/
  };

  /* end USER ACTIONS */
}
])
   
.controller('diariCtrl', ['$rootScope', '$scope', '$state', '$stateParams', 'svcDiary', 'svcUtil', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($rootScope,$scope, $state, $stateParams, svcDiary, svcUtil) {

  /* USER ACTIONS */
  $scope.userAction = function(strCmdGrp, strCmd, strRef, objRef) {
    switch (strCmdGrp) {
      case "rec":
        switch (strCmd) {
          case "view":
              /*(disableAnimate, disableBack, historyRoot)*/
              $rootScope.EzziDiary.selectedTid=strRef.toString();
              svcUtil.guardSwitchPage("menu.home", true, true,true);        
              
            break;
        } /*switch2*/        
                
        break;
    } /*switch1*/
  };
  /* end USER ACTIONS */       



  /*Page events*/
  $scope.$on("$ionicView.loaded", function() {
  });
  
  $scope.$on("$ionicView.enter", function() {
      $scope.records=svcDiary.getLocalDiary();
      $scope.records = $scope.records.sort(function (a, b) {  return a.tid - b.tid;  });
  });
  /*end Page events*/



/* CUSTOM FUNCTIONS */
$scope.formatDate=function(strgTid) {
  return new Date(Number(strgTid));
}
$scope.totalDeeds=function(objtDeeds){
    return Object.keys(objtDeeds).length
}
/* CUSTOM FUNCTIONS */

}])
 