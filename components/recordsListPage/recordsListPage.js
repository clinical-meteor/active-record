Session.setDefault('recordSearchFilter', '');
Session.setDefault('tableLimit', 20);
Session.setDefault('paginationCount', 1);
Session.setDefault('selectedPagination', 0);
Session.setDefault('skipCount', 0);



//------------------------------------------------------------------------------
// ROUTING

Router.map(function () {
  this.route('recordsListPage', {
    path: '/list/records/',
    template: 'recordsListPage',
    yieldTemplates: {
      'navbarHeader': {
        to: 'header'
      },
      'navbarRecords.ter': {
        to: 'recordter'
      },
      'mainSidebar': {
        to: 'sidebar'
      },
      'recordUpsertPage': {
        to: 'secondPage'
      },
    },
    data: function () {
      if (Session.get('activeRecord')) {
        return Records.findOne(Session.get('activeRecord'));
      }
    }
  });
});

//------------------------------------------------------------------------------
// TEMPLATE INPUTS

Template.recordsListPage.events({
  'change #recordSearchInput': function () {
    Session.set('recordSearchFilter', $('#recordSearchInput').val());
  },
  'click .addRecords.Item': function () {
    Router.go('/insert/record');
  },
  'click .recordItem': function (event, template) {
    event.preventDefault();

    if (Session.get('appWidth') > 1900) {
      Session.set('activeRecord', this._id);
    } else {
      Router.go('/view/record/' + this._id);
    }
  },
  // use keyup to implement dynamic filtering
  // keyup is preferred to keypress because of end-of-line issues
  'keyup #recordSearchInput': function () {
    Session.set('recordSearchFilter', $('#recordSearchInput').val());
  }
});



//------------------------------------------------------------------------------
// TEMPLATE OUTPUTS


var OFFSCREEN_CLASS = 'off-screen';
var EVENTS = 'webkitTransitionEnd oTransitionEnd transitionEnd msTransitionEnd transitionend';

Template.recordsListPage.rendered = function () {
  console.log("trying to update layout...");

  Template.appLayout.delayedLayout(20);
};


Template.recordsListPage.helpers({
  getRecordSearchFilter: function () {
    return Session.get('recordSearchFilter');
  },
  hasNoContent: function () {
    if (Records.find().count() === 0) {
      return true;
    } else {
      return false;
    }
  },
  recordsList: function () {
    // this triggers a refresh of data elsewhere in the table
    // step C:  receive some data and set our reactive data variable with a new value
    Session.set('receivedData', new Date());

    Template.appLayout.delayedLayout(20);

    // this is a performant local (client-side) search on the data
    // current in our CustomerAccounts cursor, and will reactively
    // update the table

    return Records.find({
      $or: [
        {
          institutionId: {
            $regex: Session.get('recordSearchFilter'),
            $options: 'i'
          }
        },
        {
          participantId: {
            $regex: Session.get('recordSearchFilter'),
            $options: 'i'
          }
        },
        {
          _id: {
            $regex: Session.get('recordSearchFilter'),
            $options: 'i'
          }
        },
        {
          physicianName: {
            $regex: Session.get('recordSearchFilter'),
            $options: 'i'
          }
        },
        {
          questionnaireName: {
            $regex: Session.get('recordSearchFilter'),
            $options: 'i'
          }
        },
        {
          collaborationName: {
            $regex: Session.get('recordSearchFilter'),
            $options: 'i'
          }
        }
    ]
    }, {
      sort: {
        createdAt: -1
      }
    });
  }
});
