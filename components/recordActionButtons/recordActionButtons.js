


Template.recordActionButtons.helpers({

});

Template.recordActionButtons.events({
  'click #saveDataButton': function (){
    Template.metadataUpsertPage.saveQuestionnaireData(Session.get('activeMetadata'), false);
  }
});
