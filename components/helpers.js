Session.setDefault('recordSearchFilter', '');



Template.registerHelper("recordsList", function (){
  return Records.getFilteredData();
});
