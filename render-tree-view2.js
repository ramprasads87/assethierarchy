(function($, undefined) {
  var treeControlInstance = null;
  var treeControlDataSource = null;

  function getScopeUnappliedSelectionsNodeRefFromPath(path) {
    var self = this;
    var node;
    var found = true;
    var pathArray = [];
    if (path && path.length > 0) {
      pathArray = path.split(".");
    }

    var assetsData = null;
    if (
      siteHierarchy &&
      siteHierarchy.Sites &&
      siteHierarchy.Sites.length > 0 &&
      siteHierarchy.Sites[0] &&
      siteHierarchy.Sites[0].AssetOpInfo
    ) {
      assetsData = siteHierarchy.Sites[0].AssetOpInfo.Assets;
    }
    debugger;
    if (assetsData && pathArray && pathArray.length > 0) {
      var tempNode = assetsData;
      for (var i = 0; i < pathArray.length; i++) {
        if (tempNode && tempNode.length > pathArray[i] && i == 0) {
          tempNode = tempNode[pathArray[i]]; //for site node which will not have child assets
        } else if (tempNode && tempNode.ChildAssets.length > pathArray[i]) {
          tempNode = tempNode.ChildAssets[pathArray[i]];
        } else {
          //not found log it
          found = false;
        }
      }

      if (found == true) {
        node = tempNode;
      }
    }
    return node;
  }

  function createTreeControl(assetsData) {
    $(".tree-control-container .tree-control").kendoTreeView({
      dataSource: new kendo.data.HierarchicalDataSource({
        data: assetsData,
        schema: {
          model: {
            id: "Id",
            hasChildren: function(e) {
              if (e && e.ChildAssets && e.ChildAssets.length > 0) {
                return true;
              } else {
                return false;
              }
            },
            children: "ChildAssets"
          }
        }
      }),
      template: kendo.template(
        $("script.rf-filter-scope-node-template-asset").html()
      ), //"#= item.Name # (#= item.Name #)",
      checkboxes: (function() {
        return {
          template: kendo.template(
            $("script.rf-filter-scope-asset-checkbox-template").html()
          )
        };
      })(),
      check: function(e) {
        var dataItem = treeControlInstance.dataItem(e.node);
        //dataItem.expanded = true;
        var node = getScopeUnappliedSelectionsNodeRefFromPath(dataItem.Path);
        if (node && dataItem) {
          if (dataItem.checked == true) {
            node.checked = true;
          } else {
            node.checked = false;
          }
        }
      },
      select: function(e) {},
      expand: function(e) {
        debugger;
        var dataItem = treeControlInstance.dataItem(e.node);
        //dataItem.expanded = true;
        var node = getScopeUnappliedSelectionsNodeRefFromPath(dataItem.Path);
        if (node) {
          node.expanded = true;
        }
      },
      collapse: function(e) {
        var dataItem = treeControlInstance.dataItem(e.node);
        //dataItem.expanded = true;
        var node = getScopeUnappliedSelectionsNodeRefFromPath(dataItem.Path);
        if (node) {
          node.expanded = false;
        }
      },
      loadOnDemand: true
    });

    treeControlInstance = $(".tree-control-container .tree-control").data(
      "kendoTreeView"
    );
    if (treeControlInstance) {
      treeControlDataSource = treeControlInstance.dataSource;
    }
  }

  function rerender() {
    if (treeControlInstance) {
      //call Kendo's destroy function
      if (treeControlInstance.destroy) {
        treeControlInstance.destroy();
      }
    }

    //remove DOM element - To ensure DOM clean up
    $(".tree-control-container .tree-control").remove();

    //readd DOM element
    addTreeControlDomElement();

    var assetsData = null; 
    if (
      siteHierarchy &&
      siteHierarchy.Sites &&
      siteHierarchy.Sites.length > 0 &&
      siteHierarchy.Sites[0] &&
      siteHierarchy.Sites[0].AssetOpInfo
    ) {
      assetsData = siteHierarchy.Sites[0].AssetOpInfo.Assets;
    }

    //create tree control
    createTreeControl(assetsData);

    //alert('done');
    
  }

  function addTreeControlDomElement() {
    //readd DOM element
    $(".tree-control-container").append("<div class='tree-control'></div>");
  }

  function triggerRenderWithDelay(currentIterationNo, noOfTimesToRun, millisecondsToWait) {
    if(currentIterationNo < noOfTimesToRun){
      rerender();
      currentIterationNo++;
      $("#render-iteration").text(currentIterationNo);

      setTimeout(function(){
        triggerRenderWithDelay(currentIterationNo, noOfTimesToRun);
      }, millisecondsToWait);
    } else{
      $("body").css("cursor", "default");
    }
  }

  $(document).ready(function() {
    
     // create NumericTextBox from input HTML element
     $("#no-of-times-to-render").kendoNumericTextBox({
        format: "n",
        min: 10,
        max: 100,
        step: 1,
        decimals: 0
    });



    //register for button click
    $(".btn-rerender-tree").on("click", function() {
      debugger;
     
      $("body").css("cursor", "wait");

      var numerictextbox = $("#no-of-times-to-render").data("kendoNumericTextBox");
      var noOfTimesToRender = 1;
      if(numerictextbox && numerictextbox.value){
        noOfTimesToRender = numerictextbox.value();
      }

      /*
      for(var i=0; i < noOfTimesToRender; i++){
        rerender();
      }
      */
      
     triggerRenderWithDelay(0,noOfTimesToRender,10000);

    });

    rerender();

  });
})(jQuery);

