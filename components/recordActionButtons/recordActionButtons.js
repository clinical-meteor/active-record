


Template.recordActionButtons.helpers({

});

Template.recordActionButtons.events({
  'click #saveDataButton': function (){
    Template.metadataUpsertPage.saveQuestionnaire(Session.get('activeMetadata'), false);
  }
});
