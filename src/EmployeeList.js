// <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.isotope/2.2.2/isotope.pkgd.js"></script>
// ~sitecollection/SiteAssets/jquery.js
// ~sitecollection/SiteAssets/demo.js
// window.citiesOfCountry = window.citiesOfCountry || {};
// var countriesToCityUrl = "https://raw.githubusercontent.com/David-Haim/CountriesToCitiesJSON/master/countriesToCities.json"; -->
var countriesToCityUrl = "/SiteAssets/countriesToCities.txt";

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
	    // }, 
	    "Country_x0020_of_x0020_Birth": {
	    	        "NewForm": Country_x0020_of_x0020_BirthCreateOrUpdate,
	    	        "EditForm": Country_x0020_of_x0020_BirthCreateOrUpdate,
	    	        // "DisplayForm": Country_x0020_of_x0020_BirthDisplay,
	    	        // "View": Country_x0020_of_x0020_BirthView
	    },
	    "City_x0020_of_x0020_Birth": {
	    	        "NewForm": City_x0020_of_x0020_BirthCreateOrUpdate,
	    	        "EditForm": City_x0020_of_x0020_BirthCreateOrUpdate,
	    	        // "DisplayForm": City_x0020_of_x0020_BirthDisplay,
	    	        // "View": City_x0020_of_x0020_BirthView
	    }
	};

	// overrideContext.Templates.Item = item;
	// overrideContext.Templates.Header = header;
	// overrideContext.Templates.Footer = footer;
	// overrideContext.Templates.OnPostRender = postRender;
	// overrideContext.Templates.OnPreRender = preRender;
	SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideContext);
})();

// Starts City_x0020_of_x0020_Birth override implementation
window.CityOfCountry = window.CityOfCountry || {};

function City_x0020_of_x0020_BirthCreateOrUpdate(ctx) {
   // var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
   var  formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
   var fieldId = formCtx.fieldSchema.Id;
   var fieldName = formCtx.fieldSchema.Name;
   var fieldTitle = formCtx.fieldSchema.Title;
   var uniqueID = fieldName + "_" + fieldId;
   
   var itemID = formCtx.itemAttributes.Id;
   var itemValue = formCtx.fieldValue || "";
   
   var resultCallback = function () {
       return $("#" + uniqueID).val();
   }
   
   var validationCallback = function (errorResult) {
       SPFormControl_AppendValidationErrorMessage(uniqueID + '_validation', errorResult);
   }
   
   fldSetup(formCtx, resultCallback, validationCallback, null);

   $.get(countriesToCityUrl)
   .then(function(data) {
   	   window.CityOfCountry = $.parseJSON(data);
   });

   var inputHTML = "<select id='" + uniqueID + "'  title='" + fieldTitle + "' />";
   inputHTML += "</select>";
   inputHTML += "<input type='hidden' id='cityUniqueID' value='" + uniqueID + "' />";
   inputHTML += "<div id='" + uniqueID + "_validation'></div>";
     
   return inputHTML;
}

function City_x0020_of_x0020_BirthDisplay(ctx) {
   // var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
    return "City_x0020_of_x0020_Birth Display";
}

function City_x0020_of_x0020_BirthView(ctx) {
    //var currentItemDisplayForm
    
    var itemValue = ctx.CurrentItem.City_x0020_of_x0020_Birth
    return "City_x0020_of_x0020_Birth View";
}
// Ends City_x0020_of_x0020_Birth override implementation

// Starts Country_x0020_of_x0020_Birth override implementation
function Country_x0020_of_x0020_BirthCreateOrUpdate(ctx) {
   // var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
   var  formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
   var fieldId = formCtx.fieldSchema.Id;
   var fieldName = formCtx.fieldSchema.Name;
   var fieldTitle = formCtx.fieldSchema.Title;
   var uniqueID = fieldName + "_" + fieldId;
   
   var itemID = formCtx.itemAttributes.Id;
   var itemValue = formCtx.fieldValue || "";
   
   var resultCallback = function () {
       return $("#" + uniqueID).val();
   }
   
   var validationCallback = function (errorResult) {
       SPFormControl_AppendValidationErrorMessage(uniqueID + '_validation', errorResult);
   }
   
   fldSetup(formCtx, resultCallback, validationCallback, null);
   

   $.get('https://restcountries.eu/rest/v1/all')
   .then(function(data) {
   	  var inputHTML = "<select id='" + uniqueID + "' class='dropdownlist' title='" + fieldTitle + "' onchange='countryOnChange(this);'>";
   	  $.each(data, function (idx, item) {
   	  	var selected = "";
   	  	if(typeof item.name != 'undefined' && item.name.trim() == 'United States')
   	  	{
   	  		selected = 'selected';
   	  	}   	  	 
   	  	inputHTML += "<option value='" + item.name + "' "+selected+">" + item.name + "</option>";
   	     });
   	  
   	  inputHTML += "</select>";
   	  inputHTML += "<div id='" + uniqueID + "_validation'></div>";
   	  
   	  $("#" + uniqueID).replaceWith(inputHTML);
   	  $("#" + uniqueID).trigger('onchange');
   });
   
   return "<div id='" + uniqueID + "'></div>";
    
}

function countryOnChange(sender){
	//cityUniqueID
	var selectedCountry = $("option:selected", sender).text();
	var uniqueID = $("#cityUniqueID").val();
	    
	var selectOptions = $("#" + uniqueID);
	selectOptions.hide();
	
	if(cityOfCountry != null)
	{
		Q.fcall(function() {
			var cities = cityOfCountry[selectedCountry] || [];
			$("#" + uniqueID + " option").remove();
			var html = $.map(cities, function(item){
	    		return "<option value='" + item + "'>" + item + "</option>";
	    	}).join('');
	    	selectOptions.append(html);
			selectOptions.show();
		});	    	
	} 
}

function Country_x0020_of_x0020_BirthDisplay(ctx) {
   // var formCtx = SPClientTemplates.Utility.GetFormContextForCurrentField(ctx);
    return "Country_x0020_of_x0020_Birth Display";
}

function Country_x0020_of_x0020_BirthView(ctx) {
    //var currentItemDisplayForm
    
    var itemValue = ctx.CurrentItem.Country_x0020_of_x0020_Birth
    return "Country_x0020_of_x0020_Birth View";
}
// Ends Country_x0020_of_x0020_Birth override implementation

// Field Setup

function fldSetup(formCtx, resultCallback, validationCallback, validators) {

    // Register result callback
    formCtx.registerGetValueCallback(formCtx.fieldName, resultCallback);

    // Register validator
    var validatorSet = new SPClientForms.ClientValidation.ValidatorSet();

    if (formCtx.fieldSchema.Required) {
        validatorSet.RegisterValidator(new SPClientForms.ClientValidation.RequiredValidator());
    }

    if (validators != null) {
        if (validators.length > 0) {
            $.each(validators, function (index, value) {
                validatorSet.RegisterValidator(value);
            });
        }
    }

    if (validatorSet._registeredValidators.length > 0)
        formCtx.registerClientValidator(formCtx.fieldName, validatorSet);

    formCtx.registerValidationErrorCallback(formCtx.fieldName, validationCallback);
}
