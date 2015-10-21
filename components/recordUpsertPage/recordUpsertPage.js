Session.setDefault('recordReadOnly', true);


Router.map(function (){
  this.route('newRecords.Route', {
    path: '/insert/record',
    template: 'recordUpsertPage',
    onAfterAction: function (){
      Session.set('recordReadOnly', false);
    }
  });

});
Router.route('/questionnaire/:questionnaireId/new', {
  name: 'recordUpsertForTemplate',
  template: 'recordUpsertPage',
  data: function (){
    return Questionnaires.findOne({_id: this.params.questionnaireId});
  }
});

Router.route('/upsert/record/:id', {
  name: 'upsertRecords.Route',
  template: 'recordUpsertPage',
  data: function (){
    return Records.findOne(this.params.id);
  },
  onAfterAction: function (){
    Session.set('recordReadOnly', false);
  }
});
Router.route('/view/record/:id', {
  name: 'viewRecords.Route',
  template: 'recordUpsertPage',
  data: function (){
    return Records.findOne(this.params.id);
  },
  onAfterAction: function (){
    Session.set('recordReadOnly', true);
  }
});


//-------------------------------------------------------------


Template.recordUpsertPage.rendered = function (){
  Template.appLayout.layout();
};


Template.recordUpsertPage.helpers({
  isNewRecords.: function (){
    if (this._id){
      return false;
    } else {
      return true;
    }
  },
  getLockIcon: function (){
    if (Session.get('recordReadOnly')){
      return "fa-lock";
    } else {
      return "fa-unlock";
    }
  },
  isReadOnly: function (){
    if (Session.get('recordReadOnly')){
      return "readonly";
    }
  },
  getRecordId: function () {
    if ( this._id ) {
      return this._id;
    } else {
      return "---";
    }
  }
});

Template.recordUpsertPage.events({
  'click #removeRecordButton': function (){
    Records.remove(this._id, function (error, result){
      if (result){
        Router.go('/list/records');
      }
    });
  },
  "click #saveRecordButton": function (event, template){
    event.preventDefault();
    Template.recordUpsertPage.saveRecords.(false, this);
    Session.set('recordReadOnly', true);
  },
  "click .barcode": function (){
    // TODO:  refactor to Session.toggle('recordReadOnly')
    if (Session.equals('recordReadOnly', true)){
      Session.set('recordReadOnly', false);
    } else {
      Session.set('recordReadOnly', true);
      console.log('Locking the record...');
      Template.recordUpsertPage.saveRecords.(false, this);
    }
  },
  "click #lockRecords.Button": function (){
    console.log("click #lockRecords.Button");

    if (Session.equals('recordReadOnly', true)){
      Session.set('recordReadOnly', false);
    } else {
      Session.set('recordReadOnly', true);
    }
  },
  "click .listButton": function (event, template){
    Router.go('/list/records');
  },
  "click .imageGridButton": function (event, template){
    Router.go('/grid/records');
  },
  "click .tableButton": function (event, template){
    Router.go('/table/records');
  },
  'click #previewRecords.Button':function (){
    Router.go('/customer/' + this._id);
  }
  // 'submit #saveRecordButton': function () {
  //   console.log('creating new record...');
  //   Template.recordUpsertPage.saveRecords.(false, this);
  // }
});


Template.recordUpsertPage.saveRecords. = function (record, questionnaire){

  console.log("Template.recordUpsertPage.saveRecords.", questionnaire);
  // TODO:  add validation functions

  // var newRecord = {
  //   institutionName: $('input[name="institutionName"]').val(),
  //   institutionId: $('input[name="institutionId"]').val(),
  //   physicianName: $('input[name="physicianName"]').val(),
  //   studyName: $('input[name="studyName"]').val(),
  //   studyId: $('input[name="studyId"]').val(),
  //   patientAge: $('input[name="patientAge"]').val(),
  //   patientGender: $('input[name="patientGender"]').val(),
  //   diagnosisDescription: $('input[name="diagnosisDescription"]').val(),
  //   diagnosisCode: $('input[name="diagnosisCode"]').val(),
  //   diseaseSubtype: $('input[name="diseaseSubtype"]').val(),
  //   priorTreatmentHistory: $('input[name="priorTreatmentHistory"]').val(),
  //   complicatingConditions: $('input[name="complicatingConditions"]').val(),
  //   currentStatus: $('input[name="currentStatus"]').val(),
  //   lastFollowUpDate: $('input[name="lastFollowUpDate"]').val(),
  //   familyHistory: $('input[name="familyHistory"]').val(),
  //   molecularTesting: $('input[name="molecularTesting"]').val(),
  //   actionableFindings: $('input[name="actionableFindings"]').val(),
  //   genomicAnalysis: $('input[name="genomicAnalysis"]').val(),
  //   biopsySource: $('input[name="biopsySource"]').val(),
  //   tumorCellFraction: $('input[name="tumorCellFraction"]').val(),
  //   otherStudies: $('input[name="otherStudies"]').val(),
  //   createdAt: new Date()
  // };

  var newRecord = {};
  var inputElements = $('#recordUpsertPage input');
  var textareaElements = $('#recordUpsertPage textarea');

  console.log('inputElements', inputElements);
  console.log('textareaElements', textareaElements);

  for (var i = 0; i < inputElements.length; i++) {
    newRecord[inputElements[i].name] = inputElements[i].value;
  }
  for (var i = 0; i < textareaElements.length; i++) {
    newRecord[textareaElements[i].name] = textareaElements[i].value;
  }

  newRecord.createdAt = new Date();
  newRecord.questionnaireId = questionnaire._id;

  console.log ("newRecord", newRecord);


  if (record._id){
    Records.update({_id: record._id}, {$set: newRecord }, function (error, result){
      if (error) console.log(error);
      Router.go('/view/record/' + record._id);
    });
  } else {
    Records.insert(newRecord, function (error, result){
      if (error) console.log(error);
      Router.go('/list/records');
      //Router.go('/view/record/' + result);
    });
  }
};
