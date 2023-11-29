/***
@controller Name:sap.suite.ui.generic.template.ObjectPage.view.Details,
*@viewId:ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition
*/
/*WRICEF ID    : ENH-8857  
  Tag          : 2006597120230609*/
sap.ui.define([
		'sap/ui/core/mvc/ControllerExtension',
		'sap/suite/ui/generic/template/extensionAPI/extensionAPI',
		'sap/ui/model/json/JSONModel',
	    'sap/ui/core/mvc/OverrideExecution'
	],
	function (
		ControllerExtension,
		ExtensionAPI,
		JSONModel

	) {
		"use strict";
		return ControllerExtension.extend("customer.zehsm.task.defs1.var1.customController", {
			/*make description field mandatory*/
			makeDescriptionMandatory:function(){
				this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--basicInformation::EHSTaskDescription::Field').setMandatory(true);
			},
			/*When recommendation is unselected we need to update blank to recommnedation fields*/
		    onUnselectReccommendation:function(){
            for(var i=0; i<this.getView().getModel('rData').oData.results.length; i++){
				
				if(this.getView().getModel('rData').oData.results[i].selected == true){
					this.getView().getModel('rData').oData.results[i].selected = false;
					this.getView().getModel().setProperty(this.getView().getBindingContext().sPath + "/" + 'zzinc_recommend_txt_tip', '');
					this.getView().getModel().setProperty(this.getView().getBindingContext().sPath + "/" + 'zzinc_recommend_txt', '' );
					this.getView().getModel().setProperty(this.getView().getBindingContext().sPath + "/" + 'zzinc_recommend_key', '00000000-0000-0000-0000-000000000000' );
					this.getView().getModel('rData').refresh();
				}
			}
			},
			fillDescription:function(descText){
               var currText = this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--basicInformation::EHSTaskDescription::Field').getValue();
			   if(!currText){
                this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--basicInformation::EHSTaskDescription::Field').setValue(descText);
			   }
			},
			// Format the date displayed in recommendations pop up
			formatDate:function(iDate){
				const yyyy = iDate.getFullYear();
                let mm = iDate.getMonth() + 1; 
                let dd = iDate.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;
                return dd + '.' + mm + '.' + yyyy;
			},
			hideLabel:function(oEvent,oLabel){
				if(!oEvent.context.getProperty('zzinc_recommend_txt_tip')){
										oLabel.setLabel("");
					}
			},
			unhideLabel:function(oLabel, label){
				oLabel.setLabel(label);
			},
			//Incident label in header is mapped to incidentCategoryText fields
			incidentLabel : function(oEvent){
				var lvalue = oEvent.context.getProperty('EHSTaskHostObjectInstanceUUID');
				//var lvalue = '005056A8-1CEC-1EEB-9C80-8F2602AB0766';
				            var endPoint = '(guid' + "'" + lvalue +  "'" + ')';
				            var that = this;
							var fnsuccess = function(oData,oResponse) {
							this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--header::headerEditable::HostObject::EHSTskRelatedObjectDescription::Label').setText(oData.IncidentCategoryText);
									}.bind(that);
							var oModel = this.getView().getModel();
							oModel.read("/IncidentSet" + endPoint, {
											success: fnsuccess,
										 error:function(oError){
											
							}
						});
            },
			//Based on the edit button link will enable & disable
			linkEnableDisable : function(oEvent){
                if (  oEvent.context.getProperty('Edit_ac') == true ){
					this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--customer.zehsm.task.defs1.var1.link1').setEnabled(false);
				  }else if(oEvent.context.getProperty('Edit_ac') == false){
					this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--customer.zehsm.task.defs1.var1.link1').setEnabled(true);
				  }
			},
			oFragment2:null,
			// this is used to detrimine which pop data we have to fetch either recommendations or findings
			oFlag:'',
			references : function(oEvent){
				var oJSONModel = new JSONModel();
				var lvalue = oEvent.context.getProperty('EHSTaskHostObjectInstanceUUID');
				//var lvalue = '005056A8-1CEC-1EEB-9C80-8F2602AB0766';
				            var aFilters = new Array();
				            var incidentKey = new sap.ui.model.Filter({
					        path: "IncidentKey",
					        operator:sap.ui.model.FilterOperator.EQ,
					        value1: lvalue
				             });
						    aFilters.push(incidentKey);
				            var that = this;
							var fnsuccess = function(oData,oResponse) {
								var recObj = { results: [] };
								var olink1 = this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--customer.zehsm.task.defs1.var1.link1');
								var oLabel = this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--id-1689760662579-177');
								var oText = this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--customer.zehsm.task.defs1.var1.text1');
								oText.setText( oEvent.context.getProperty('zzinc_recommend_txt_tip') );//already linked text will be assigned
								olink1.setText("");// clearing the values
								for(let i = 0 ; i<oData.results.length; i++){
						         var record = {
							        ReferenceCategory:oData.results[i].ReferenceCategory,
									ReferenceLabel:oData.results[i].ReferenceLabel,
									ReferenceVisiblity:oData.results[i].ReferenceVisiblity,
									ReferenceCount:oData.results[i].ReferenceCount
							        }
									if(record.ReferenceCount !== 0){//  there will be no recommendations or Findings
									  this.oFlag = 'X';// FLAG TO CHECK WEATHER RECOMMENDATIONS AND FINDINGS AVAILABLE OR NOT //hpqc 2285
						              recObj.results.push(record);
									  olink1.setText(record.ReferenceLabel);// Text to be displayed on link
									  if(record.ReferenceCategory === '0001'){ //Based on this we will call Recommendations or Findings Popup
									  oLabel.setLabel("Recommendations");
									  this.recommendations(oEvent);
									  this.linkEnableDisable(oEvent); //enable/Disable link based on edit button
									  this.hideLabel(oEvent,oLabel);//hide label if no Text is available
									  }else{
									  oLabel.setLabel("Findings");
									  this.findings(oEvent);
									  this.linkEnableDisable(oEvent);//enable/Disable link based on edit button
									  this.hideLabel(oEvent,oLabel);//hide label if no Text is available
									  }
									}
								}//hide the recommendation block if nothing to display //hpqc 2285
								if(this.oFlag == ''){
									  this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--RecommenInfo::Section').setVisible(false);
									}
								oJSONModel.setData(recObj);
					            this.getView().setModel(oJSONModel,"iData");
								}.bind(that);
				           var oModel = this.getView().getModel();
				          oModel.read("/ReferenceSet", {
					              filters: aFilters,
					             success: fnsuccess,
					           error:function(oError){
						    }
				            });
            },
			//Fetching findings pop up data
			findings: function(event){
				            var oJSONModel = new JSONModel();
							var lvalue = event.context.getProperty('EHSTaskHostObjectInstanceUUID');
							//var lvalue = '005056A8-1CEC-1EEB-9C80-8F2602AB0766';
				            var aFilters = new Array();
				            var incidentKey = new sap.ui.model.Filter({
					        path: "IncidentKey",
					        operator:sap.ui.model.FilterOperator.EQ,
					        value1: lvalue
				             });
						    aFilters.push(incidentKey);
				            var that = this;
							var fnsuccess = function(oData,oResponse) {
								var recObj = { results: [] };
					           for(let i = 0 ; i<oData.results.length; i++){
						        var record = {
									//selected:false,
							        FindingID:oData.results[i].FindingID,
									FindingDescText:oData.results[i].FindingDescText,
									FindingKey:oData.results[i].FindingKey
							        }
								
								// 	var dbRecKey1 = this.getView().getBindingContext().getProperty('zzinc_recommend_key');
								//  if(dbRecKey1){
								// 	if(oData.results[i].RecommendationKey == dbRecKey1){
								// 		record.selected = true;
								// 	}
								//  }
								 
						         recObj.results.push(record);
								 
					            }
								//this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--id-1689760662579-177').setLabel("Findings");
								oJSONModel.setData(recObj);
					            this.getView().setModel(oJSONModel,"rData");
							}.bind(that);
				           var oModel = this.getView().getModel();
				          oModel.read("/FindingSet", {
					              filters: aFilters,
					             success: fnsuccess,
					           error:function(oError){
						    }
				            });

			},
			//fetching data for recommendations popup
			recommendations: function(event) {
				            var oJSONModel = new JSONModel();
							var lvalue = event.context.getProperty('EHSTaskHostObjectInstanceUUID');
							//var lvalue = '005056A8-285C-1EDC-B7D8-DDE9556D9ED9';
				            var aFilters = new Array();
				            var incidentKey = new sap.ui.model.Filter({
					        path: "IncidentKey",
					        operator:sap.ui.model.FilterOperator.EQ,
					        value1: lvalue
				             });
						    aFilters.push(incidentKey);
				            var that = this;
							var fnsuccess = function(oData,oResponse) {
								var recObj = { results: [] };
					           for(let i = 0 ; i<oData.results.length; i++){
								var record = {
									selected:false,
							        InvestigationStepCategoryText:oData.results[i].InvestigationStepCategoryText,
							        RecommendationDueDate2:oData.results[i].RecommendationDueDate,
							        RecommendationText:oData.results[i].RecommendationText,
							        RecommendationManager:oData.results[i].RecommendationManager,
							        InvestigationStepText:oData.results[i].InvestigationStepText,
									RecommendationTip:oData.results[i].RecommendationTip,
									RecommendationKey:oData.results[i].RecommendationKey,
									BeingUsedCalced:oData.results[i].BeingUsedCalced,
									InvTypeCalced:oData.results[i].InvTypeCalced,
									RecommendationDisplayText:oData.results[i].RecommendationDisplayText

						            }
									//Format date in dd.mm.yyyy 
								 record.RecommendationDueDate2 = this.formatDate(record.RecommendationDueDate2);
								 //RadioButton will be selected if task has already assigned recommendation Text
								 var dbRecKey = this.getView().getBindingContext().getProperty('zzinc_recommend_key');
								 if(dbRecKey){
									if(oData.results[i].RecommendationKey == dbRecKey){
										record.selected = true;
									}
								 }
						         recObj.results.push(record);
								 }
								oJSONModel.setData(recObj);
					            this.getView().setModel(oJSONModel,"rData");
							}.bind(that);
				           var oModel = this.getView().getModel();
				          oModel.read("/RecommendationSet", {
					              filters: aFilters,
					             success: fnsuccess,
					           error:function(oError){
						    }
				            });

			},
			//Action nature event handler
			onSelectRadio : function(oEvent){
				var ActionNature;
				var oSelectedIndex = oEvent.getParameter("selectedIndex");
				var oRadioButtonSrc = oEvent.getSource().getAggregation("buttons");
				// Reading the radio button text selected
				var oSelectedRadioText = oRadioButtonSrc[oSelectedIndex].getText();
				// updating the value to backend
				if (oSelectedRadioText == 'Corrective'){
                  ActionNature = 'X';
				}
				if (oSelectedRadioText == 'Preventive'){
					ActionNature = '-';
				}
				//updating the Model
				var oModel = this.getView().getModel();
				oModel.setProperty(this.getView().getBindingContext().sPath + "/" + 'zzact_nature', ActionNature);
			},
			//on Close of recommnedations pop up
			handleClose: function (oEvent) {
				
				var oLabel = this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--id-1689760662579-177');
				var aContexts = oEvent.getParameter("selectedContexts");
	            if (aContexts && aContexts.length) {
					var selText = aContexts.map(function (oContext) { return oContext.getObject().RecommendationTip; });
					var recText = aContexts.map(function (oContext) { return oContext.getObject().RecommendationText; });
					var recKey  = aContexts.map(function (oContext) { return oContext.getObject().RecommendationKey; });
					var selText500 = selText[0].substring(0,499);
					var selText100 = recText[0].substring(0,99);
					/* Recommendation text naming convention changed INC2956197*/
					// var recDueDate  = aContexts.map(function (oContext) { return oContext.getObject().RecommendationDueDate2; });
					// var InvType = aContexts.map(function (oContext) { return oContext.getObject().InvTypeCalced; });
					// var selText50 = selText[0].substring(0,49);
					// var recommentext = `${InvType[0]} | ${recDueDate[0]} | ${selText50}`;
					var recommentext = aContexts.map(function (oContext) { return oContext.getObject().RecommendationDisplayText; });
					this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--customer.zehsm.task.defs1.var1.text1').setText(recommentext[0]);
					//this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--customer.zehsm.task.defs1.var1.text1').setText(selText500);
				    /* Recommendation text naming convention changed INC2956197*/
					var oModel = this.getView().getModel();
					oModel.setProperty(this.getView().getBindingContext().sPath + "/" + 'zzinc_recommend_txt_tip', recommentext[0]);
					oModel.setProperty(this.getView().getBindingContext().sPath + "/" + 'zzinc_recommend_txt', selText100 );
					oModel.setProperty(this.getView().getBindingContext().sPath + "/" + 'zzinc_recommend_key', recKey[0] );
					this.unhideLabel(oLabel, "Recommendations");
					this.fillDescription(selText500);//fill Description field only during first time
				}
			},
			//on Close of findings pop up
			handleClose1: function (oEvent) {
				var oLabel = this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--id-1689760662579-177');
				var aContexts = oEvent.getParameter("selectedContexts");
		
				if (aContexts && aContexts.length) {
					var selText = aContexts.map(function (oContext) { return oContext.getObject().FindingDescText; });
					var findKey = aContexts.map(function (oContext) { return oContext.getObject().FindingKey; });
					var selText500 = selText[0].substring(0,499);
					var oModel = this.getView().getModel();
					oModel.setProperty(this.getView().getBindingContext().sPath + "/" + 'zzinc_recommend_txt_tip', selText500);
					oModel.setProperty(this.getView().getBindingContext().sPath + "/" + 'zzinc_recommend_key', findKey[0] );
                
					this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--customer.zehsm.task.defs1.var1.text1').setText(selText500);
					this.fillDescription(selText500);//fill Description field only during Task Creation
					this.unhideLabel(oLabel, "Findings");
					
					
				}
			},
			oFragment:null,
		    oFragment1:null,
			//on click of recommendations or findings link
			handleLinkPress1: function (evt) {
				if(this.getView().getModel('iData').oData.results[0].ReferenceCategory === '0002'){ // Findings fragment
					
				if(!this.oFragment1){
					this.oFragment1 = new sap.ui.xmlfragment("customer.zehsm.task.defs1.var1.changes.fragments.findings",this);
					this.getView().addDependent(this.oFragment1);
				}
				var fModel  = this.getView().getModel("rData");
				this.oFragment1.setModel(fModel);
		        this.oFragment1.bindAggregation("items",{
			  	path:"rData>/results",
				template: new sap.m.ColumnListItem({
					cells:[
						// new sap.m.RadioButton({
						// 	selected:"{rData>selected}"
						//    }),
						new sap.m.Text({
							text:"{rData>FindingID}"
						}),
						new sap.m.Text({
							text:"{rData>FindingDescText}"
						})
						
					]
				})
			});
			
			this.oFragment1.open();
		    }else {//Recommendations fragment
			if(!this.oFragment){
				this.oFragment = new sap.ui.xmlfragment("customer.zehsm.task.defs1.var1.changes.fragments.popup",this);
				this.getView().addDependent(this.oFragment);
			}
			var fModel  = this.getView().getModel("rData");
			this.oFragment.setModel(fModel);
			this.oFragment.bindAggregation("items",{
			  path:"rData>/results",
			template: new sap.m.ColumnListItem({
				cells:[
					new sap.m.RadioButton({
                     selected:"{rData>selected}"
					}),
					new sap.ui.core.Icon({
						src:"{rData>BeingUsedCalced}",
						class:"size2"
					}),
					new sap.m.Text({
						text:"{rData>InvestigationStepCategoryText}"
					}),
					new sap.m.Text({
						text:"{rData>RecommendationDueDate2}"
					}),
					new sap.m.Text({
						text:"{rData>RecommendationText}"
					}),
					new sap.m.Text({
						text:"{rData>RecommendationManager}"
					}),
					new sap.m.Text({
						text:"{rData>InvestigationStepText}"
					}),
				]
			})
		});
		//this.oFragment.setShowClearButton(true);
		this.oFragment.open();
	  }

	      },
			override: {
				onInit: function(oEvent) {
				      ExtensionAPI.getExtensionAPIPromise(this.getView()).then(function (oExtensionAPI) { 
						oExtensionAPI.attachPageDataLoaded(function (oEvent) { 
							this.references(oEvent);
							this.incidentLabel(oEvent);
							this.makeDescriptionMandatory();
													
							
						}.bind(this)); 
					}.bind(this))
					   },
				onBeforeRendering: function(){
                
				},
				oDialog:null,/*defect 3041 ++206597120230922*/
				onAfterRendering: function() {
					ExtensionAPI.getExtensionAPIPromise(this.getView()).then(function (oExtensionAPI) { 
						oExtensionAPI.attachPageDataLoaded(function (event) { 
							/*defect 3041 begin of ++206597120230922*/
							if(!this.oDialog){
								this.oDialog = new sap.ui.xmlfragment("customer.zehsm.task.defs1.var1.changes.fragments.busyDialog",this);
								this.getView().addDependent(this.oDialog);
							}
							this.oDialog.open();
							/*defect 3041 end of ++2006597120230922*/
							// Action nature Enable/Disable based on Edit button
							 if (  event.context.getProperty('Edit_ac') == true ){
							  this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--customer.zehsm.task.defs1.var1.RB1-1').setEnabled(false);
							  this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--customer.zehsm.task.defs1.var1.RB1-2').setEnabled(false);
							  this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--customer.zehsm.task.defs1.var1.RB1-3').setEnabled(false);
							  }
							  if (  event.context.getProperty('Edit_ac') == false ){
							   this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--customer.zehsm.task.defs1.var1.RB1-1').setEnabled(true);
							   this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--customer.zehsm.task.defs1.var1.RB1-2').setEnabled(true);
							   this.getView().byId('ehs.fnd.task.definitions1::sap.suite.ui.generic.template.ObjectPage.view.Details::C_EHSSimpleTaskDefinition--customer.zehsm.task.defs1.var1.RB1-3').setEnabled(true);
							  }
							  this.oDialog.close(); /*defect 3041 ++206597120230922*/  
						   }.bind(this)); 
						}.bind(this)) 
				}
			}
			
		});
	});