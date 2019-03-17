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

    var assetsData = null; //[{"Id":"86078056-21d1-4ea8-8abb-ff71b0b27448","Path":"0","Name":"QSGTL","ChildAssets":[{"Id":"32d1fc47-82c8-4fef-bff1-6ff236d92e10","Path":"0.0","Name":"PLANTS","ChildAssets":[{"Id":"45ba8d0e-241d-48b9-ab11-b455f5862887","Path":"0.0.0","Name":"Assets","ChildAssets":[{"Id":"0981b5df-8503-41cc-b775-17f445bdfce8","Path":"0.0.0.0","Name":"1_FGP","ChildAssets":[{"Id":"7fea9e89-150a-41fd-84a2-a9507a3422c8","Path":"0.0.0.0.0","Name":"1A","ChildAssets":null,"checked":false,"OPLinks":[],"Count":0,"Selectable":true,"AssetType":"Equipment","totalChildrenCount":34,"selectedChildrenCount":0}],"checked":false,"OPLinks":[],"Count":0,"Selectable":true,"AssetType":"Unit","totalChildrenCount":84,"selectedChildrenCount":0},{"Id":"d3af6538-12e5-4dc0-a8be-f1f5d2e543d7","Path":"0.0.0.1","Name":"2_UTL","ChildAssets":null,"checked":false,"OPLinks":[],"Count":0,"Selectable":true,"AssetType":"Unit","totalChildrenCount":106,"selectedChildrenCount":0},{"Id":"04224935-7487-4985-a72b-d34d6f57ef1c","Path":"0.0.0.2","Name":"3_GTL","ChildAssets":[{"Id":"bea5d0bd-a6c0-40b6-9770-b78813e3fe5a","Path":"0.0.0.2.0","Name":"3A","ChildAssets":null,"checked":false,"OPLinks":[],"Count":0,"Selectable":true,"AssetType":"Equipment","totalChildrenCount":68,"selectedChildrenCount":0},{"Id":"d940a730-b94b-4f23-80fd-2624ae669bc2","Path":"0.0.0.2.1","Name":"3B","ChildAssets":null,"checked":false,"OPLinks":[],"Count":0,"Selectable":true,"AssetType":"Equipment","totalChildrenCount":66,"selectedChildrenCount":0},{"Id":"06ccedba-9c77-4708-a27d-3bf51f45aacd","Path":"0.0.0.2.2","Name":"MAINT","ChildAssets":[{"Id":"a76ec4e2-4f3e-4f42-b87b-1bfb3a5c05fd","Path":"0.0.0.2.2.0","Name":"HPS1ES1","ChildAssets":null,"checked":false,"OPLinks":[],"Count":0,"Selectable":true,"AssetType":"Equipment","totalChildrenCount":5,"selectedChildrenCount":0},{"Id":"39912928-2bfc-40bb-a63b-3c2a4bba0f33","Path":"0.0.0.2.2.1","Name":"HPS2ES1","ChildAssets":null,"checked":false,"OPLinks":[],"Count":0,"Selectable":true,"AssetType":"Equipment","totalChildrenCount":5,"selectedChildrenCount":0}],"checked":false,"OPLinks":[],"Count":0,"Selectable":true,"AssetType":"Equipment","totalChildrenCount":19,"selectedChildrenCount":0}],"checked":false,"OPLinks":[],"Count":0,"Selectable":true,"AssetType":"Unit","totalChildrenCount":154,"selectedChildrenCount":0}],"checked":false,"OPLinks":[],"Count":0,"Selectable":true,"AssetType":"Area","totalChildrenCount":423,"selectedChildrenCount":0}],"checked":true,"OPLinks":[],"Count":0,"Selectable":true,"AssetType":"Plant","totalChildrenCount":6771,"selectedChildrenCount":2101}],"checked":true,"OPLinks":[],"Count":0,"Selectable":true,"AssetType":"Site","totalChildrenCount":6772,"selectedChildrenCount":2102}];
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
  }

  function addTreeControlDomElement() {
    //readd DOM element
    $(".tree-control-container").append("<div class='tree-control'></div>");
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


      for(var i=0; i < noOfTimesToRender; i++){
        rerender();
      }

      $("body").css("cursor", "default");

    });

    rerender();

  });
})(jQuery);

