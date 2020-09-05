/* !!! IMPORTANT: Rename "mymodule" below and add your module to Angular Modules above. */

angular
  .module("modEzzi", [])

  .service("svcEzzi", [
    "$rootScope",
    "$http",
    "$ionicLoading",
    "$ionicPopup",
    "svcUtil",
    function($rootScope, $http, $ionicLoading, $ionicPopup, svcUtil) {
      var self = this;
      var BASE_URL =
        "https://script.google.com/macros/s/AKfycbwrew_MLmysODXk91jpuDBrnmDcl1XV1M2J6byId2gMPyzx-0o/exec";      
      var data = {};

      this.setInitData = function() {
        data = {
            "role":"",
          "mode": "",
          "syst": {
            "orgn_hid": "jv892781",
            "appl_hid": "jv897kol"
          },
          "mast": {},
          "appl": {wgrp:{},actv:{records:[]}},
          "wgrp": {},
          "directory": { "admn": {}, "cord": {}, "mngr": {}, "modr": {} },
          list: {},
          levels: {
            "100": { level: "100", title: "Peringkat Pusat" },
            "110": { level: "110", title: "Badan2 Pusat" },
            "120": { level: "120", title: "Negeri2" },
            "200": { level: "200", title: "Peringkat Negeri" },
            "210": { level: "210", title: "Badan2 Negeri" },
            "220": { level: "220", title: "Kawasan2 Dalam Negeri" },
            "300": { level: "300", title: "Peringkat Kawasan" },
            "310": { level: "310", title: "Badan2 Kawasan" },
            "320": { level: "320", title: "Cawangan2 Dalam Kawasan" },
            "400": { level: "400", title: "Peringkat Cawangan" },
            "420": { level: "420", title: "Cawangan" }
          }
        };

        return data;
      };
      



      function jsontostring(objData) {
        return Object.keys(objData)
          .map(function(key) {
            return (
              encodeURIComponent(key) + "=" + encodeURIComponent(objData[key])
            );
          })
          .join("&");
      }
      
      this.showAlert = function(title,message) {
      var alertPopup = $ionicPopup.alert({
         title: title,
         template: message,
         okType: 'button-dark'
      });
      alertPopup.then(function(res) {
         // Custom functionality....
      });
   };
      
      
      
      
      this.findUserAddUserToWgrp=function(
      orgn_hid,
      appl_hid,
      wgrp_hid,
      user_role,
      strg_tken){
        var newScope = $rootScope.$new();
        newScope.data = {};
        // Custom popup
        var myPopup = $ionicPopup.show({
          template: '<input type = "text" ng-model = "data.email">',
          title: "Carian",
          subTitle: "Cari Email",
          scope: newScope,
          buttons: [
            { text: "Cancel" },
            {
              text: "<b>OK</b>",
              type: "button-positive",
              onTap: function(e) {
                if (!newScope.data) {
                  //don't allow the user to close unless he enters model...
                  e.preventDefault();
                } else {
                  return newScope.data.email;
                }
              }
            }
          ]
        });
        return myPopup.then(function(res) {
          //console.log('Tapped!', res);
          var strg_email=res;
          var param = {
            cmmd: "findmastuserbyemail",
            orgn: orgn_hid,
            appl: appl_hid,
            email: strg_email,            
            tken: strg_tken
          };
          return self.post(param).then(
          function mySucces(response) {
            $ionicLoading.hide();
            console.log("success:" + JSON.stringify(response));
            if (svcUtil.isEmptyObject(response)){
                console.log('email not found');
                self.showAlert('Not Found','Email not found.')
            }else{
            return self.confirmAddUserToWgrp(
                orgn_hid,
                appl_hid,
                wgrp_hid,
                user_role,
                strg_email,
                strg_tken                
                )
            //return response.data.content;
          }},
          function myError(response) {
            console.log("error:" + response);
            $ionicLoading.hide();
          }    
          
              );
        });          
      }

      this.confirmAddUserToWgrp=function(
      orgn_hid,
      appl_hid,
      wgrp_hid,
      user_role,
      strg_email,
      strg_tken){
        var newScope = $rootScope.$new();
        newScope.data = {email:strg_email};
        // Custom popup
        var myPopup = $ionicPopup.show({
          template: '<p>{{data.email}}</p>',
          title: "Sahkan",
          subTitle: "Tambah Email?",
          scope: newScope,
          buttons: [
            { text: "Cancel" },
            {
              text: "<b>OK</b>",
              type: "button-positive",
              onTap: function(e) {
                if (!newScope.data) {
                  //don't allow the user to close unless he enters model...
                  e.preventDefault();
                } else {
                  return newScope.data.email;
                }
              }
            }
          ]
        });
        return myPopup.then(function(res) {
          //console.log('Tapped!', res);
          var param = {
            cmmd: "findmastuserbyemail",
            orgn: orgn_hid,
            appl: appl_hid,
            email: res,            
            tken: strg_tken
          };
         return  self.post(param).then(
          function mySucces(response) {
            $ionicLoading.hide();
            console.log("success:" + JSON.stringify(response));
            //return response.data.content;
          },
          function myError(response) {
            console.log("error:" + response);
            $ionicLoading.hide();
          }              
              );
        });          
      }


      this.findEmail = function(tken) {
        // When button is clicked, the popup will be shown...

        var newScope = $rootScope.$new();
        newScope.data = {};
        // Custom popup
        var myPopup = $ionicPopup.show({
          template: '<input type = "text" ng-model = "data.email">',
          title: "Carian",
          subTitle: "Cari Email",
          scope: newScope,
          buttons: [
            { text: "Cancel" },
            {
              text: "<b>OK</b>",
              type: "button-positive",
              onTap: function(e) {
                if (!newScope.data) {
                  //don't allow the user to close unless he enters model...
                  e.preventDefault();
                } else {
                  return newScope.data.email;
                }
              }
            }
          ]
        });
        return myPopup.then(function(res) {
          //console.log('Tapped!', res);
          var param = {
            cmmd: "findUserEmail",
            email: res,
            orgn: "jv36nyy2",
            tken: tken
          };
          return self.postData(param);
        });
      };

      this.post = function(objData) {
        $ionicLoading.show({
          template:
            '<ion-spinner icon="ios" class="spinner-balanced"></ion-spinner>'
        });
        return $http({
          method: "POST",
          url: BASE_URL + "?" + jsontostring(objData),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          data: jsontostring(objData)
        }).then(
          function mySucces(response) {
            $ionicLoading.hide();
            //console.log("success:" + JSON.stringify(response));
            return response.data.content;
          },
          function myError(response) {
            console.log("error:" + response);
            $ionicLoading.hide();
          }
        );
      };

      this.silentPost = function(objData) {
        return $http({
          method: "POST",
          url: BASE_URL + "?" + jsontostring(objData),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          data: jsontostring(objData)
        }).then(
          function mySucces(response) {
            //console.log("success:" + JSON.stringify(response));
            return response.data.content;
          },
          function myError(response) {
            console.log("error:" + response);
          }
        );
      };
    }
  ]);
