
(function () {
	var overrideContext = {};
	//overrideContext.ListTemplateType = 100;
	overrideContext.Templates = {}
	overrideContext.Templates.Fields = {
	    // "fieldInternal": {
	    //     "NewForm": fieldCreate,
	    //     "EditForm": fieldUpdate,
	    //     "DisplayForm": fieldDisplay,
	    //     "View": fieldView
	    // }
	    "PercentComplete": {
	    	        // "NewForm": PercentCompleteCreateOrUpdate,
	    	        // "EditForm": PercentCompleteCreateOrUpdate,
	    	        "DisplayForm": PercentCompleteDisplay,
	    	        "View": PercentCompleteView
	    }
	};

	// overrideContext.Templates.Item = item;
	// overrideContext.Templates.Header = header;
	// overrideContext.Templates.Footer = footer;
	// overrideContext.Templates.OnPostRender = postRender;
	// overrideContext.Templates.OnPreRender = preRender;
	SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideContext);
})();

// Starts PercentComplete override implementation
function PercentCompleteCreateOrUpdate(ctx) {
   // var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
    return "PercentComplete CreateOfUpdate";
}

function PercentCompleteDisplay(ctx) {
   // var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
    formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
   var fieldId = formCtx.fieldSchema.Id;
   var fieldName = formCtx.fieldSchema.Name;
   var fieldTitle = formCtx.fieldSchema.Title;
   var uniqueID = fieldName + "_" + fieldId;
   
   var itemID = formCtx.itemAttributes.Id;
   var itemValue = formCtx.fieldValue || "0 %";
   
   var html = '<div style="background: #F3F3F3; display:block;">';
    html += '<div style="background: #0072C6; height: 100%; width:'+itemValue.replace(/ /g,"")+';">&nbsp;';
    html += '</div>'+itemValue+'</div>';

    return html;
}

function PercentCompleteView(ctx) {
    //var currentItemDisplayForm
    
    var itemValue = ctx.CurrentItem.PercentComplete || '0 %';

    var html = '<div style="background: #F3F3F3; display:block;">';
    html += '<div style="background: #0072C6; height: 100%; width:'+itemValue.replace(/ /g,"")+';">&nbsp;';
    html += '</div>'+itemValue+'</div>';

    return html;
}
// Ends PercentComplete override implementation
