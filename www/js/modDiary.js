/* !!! IMPORTANT: Rename "mymodule" below and add your module to Angular Modules above. */

angular.module("modDiary", []).service("svcDiary", [
  "$rootScope",
  "svcUtil",
  function($rootScope, svcUtil) {
    var self = this;
    var data = {};
    data.templateDeeds = {
      11:{ id:"11", title: "sahur", done: "false" },
      12:{ id:"12", title: "puasa", done: "false" },
      13:{ id:"13", title: "solat sunat qabliah subuh", done: "false" },
      14:{ id:"14", title: "solat subuh jamaah", done: "false" },
      15:{ id:"15", title: "solat dhuha", done: "false" },
      16:{ id:"16", title: "solat sunat qabliah zohor", done: "false" },
      17:{ id:"17", title: "solat zohor jamaah", done: "false" },
      18:{ id:"18", title: "solat sunat ba'diah zohor", done: "false" },
      19:{ id:"19", title: "solat sunat qabliah asar", done: "false" },
      20:{ id:"20", title: "solat asar jamaah", done: "false" },
      21:{ id:"21", title: "solat sunat qabliah maghrib", done: "false" },
      22:{ id:"22", title: "solat maghrib jamaah", done: "false" },
      23:{ id:"23", title: "solat sunat ba'diah maghrib", done: "false" },
      24:{ id:"24", title: "solat sunat qabliah isya'", done: "false" },
      25:{ id:"25", title: "solat isya jamaah", done: "false" },
      26:{ id:"26", title: "solat sunat ba'diah isya'", done: "false" },
      27:{ id:"27", title: "solat sunat tarawih", done: "false" },
      28:{ id:"28", title: "solat sunat malam", done: "false" },
      29:{ id:"29", title: "tadarus quran", done: "false" },
      30:{ id:"30", title: "zikir", done: "false" },
      31:{ id:"31", title: "iktikaf", done: "false" },
      32:{ id:"32", title: "sedekah", done: "false" },
      33:{ id:"33", title: "zakat", done: "false" }
    };

    data.templateDaily = { ym: "", tid: "", deeds: [], score: "" };

    data.diary;

    this.getTemplateDeeds = function() {
      var ret;

      if (localStorage.getItem("ezzidiarytemplatedeeds") !== null) {
        //...
      } else {
        //console.log("ezzidiary template deeds not found");
        var arryTemplateDeeds = data.templateDeeds;
        localStorage.setItem(
          "ezzidiarytemplatedeeds",
          angular.toJson(arryTemplateDeeds)
        );
      }
      ret = angular.fromJson(localStorage.getItem("ezzidiarytemplatedeeds"));
      return ret;
    };
    this.getTemplateDaily = function() {
      var ret;

      if (localStorage.getItem("ezzidiarytemplatedaily") !== null) {
        //...
      } else {
        //console.log("ezzidiary template daily not found");
        var objtTemplateDaily = data.templateDaily;
        localStorage.setItem(
          "ezzidiarytemplatedaily",
          angular.toJson(objtTemplateDaily)
        );
      }
      ret = angular.fromJson(localStorage.getItem("ezzidiarytemplatedaily"));
      return ret;
    };

    this.getLocalDiary = function() {
      //console.log("getDiary");
      var ret = [];
      if (localStorage.getItem("ezzidiary") !== null) {
        //...
      } else {
        //console.log("ezzidiary not found");
        var arryDiary = [];
        localStorage.setItem("ezzidiary", angular.toJson(arryDiary));
      }
      data.diary = angular.fromJson(localStorage.getItem("ezzidiary"));
      //console.log(data.diary);
      //console.log(data.diary.length);
      ret = data.diary;
      return ret;
    };

    this.initDiary = function() {
      data.diary = self.getLocalDiary();
      return data.diary;
    };

    this.getDailyRecord = function(strgTid) {
      var arryDiary = data.diary;
      var arryFound = [];
      //console.log("arrydiary:", arryDiary);
      objtFound = arryDiary.find(function(objtDiary) {
        //console.log(objtDiary);
        return objtDiary.tid.toString() === strgTid.toString();
      });
      //console.log("found:", objtFound);
      return objtFound || {};
    };

    this.saveDailyRecord = function(objtNewDaily, strgTid) {
      var arryDiary = data.diary;

      //console.log("arrydiary:", arryDiary);

      if (arryDiary.length > 0) {
        var found = 0;
        arryDiary.find(function(objtDiary) {
          console.log(objtDiary);
          if (objtDiary.tid === strgTid) {
            objtDiary = objtNewDaily;
            found = 1;
          }
        });
        if (found == 0) {
          arryDiary.push(objtNewDaily);
        }
      } else {
        arryDiary.push(objtNewDaily);
      }

      data.diary = arryDiary;
      localStorage.setItem("ezzidiary", angular.toJson(arryDiary));
      //data.diary=angular.fromJson(localStorage.getItem("ezzidiary") );
      return data.diary;
    };
  }
]);
