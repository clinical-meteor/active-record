##clinical:active-record  

An ActiveRecord pattern that provides CRUDL templates, using AutoForms and SimpleSchema.

===============================
#### Installation  

````bash
meteor add clinical:active-record
````

===============================
#### Usage  

1.  Define your schema...

```js
CkccSchema = new SimpleSchema({
  "name": {
    type: String,
    optional: true,
    defaultValue: "",
    label: "Name"
  },
  "description": {
    type: String,
    optional: true,
    defaultValue: "",
    label: "Description",
    autoform: {
      afFieldInput: {
        type: "textarea",
        rows: 10,
        class: "foo",
        placeholder: "Lorem ipsum..."
      }
    }
  }
});
Records.attachSchema(CkccSchema);
```

2.  Set up your publications and subscriptions....

```js
// client/subscriptions.js
Meteor.subscribe("records");

// server/publications.js
Meteor.publish("records", function (recordId) {
  if (recordId) {
    // if (User.collaborationsContain(

    return Records.findOne({
      _id: recordId,
      collaborations: {
        $in: User.getCollaborations()
      }
    });
  } else
    return Records.find({
      collaborations: {
        $in: User.getCollaborations()
      }
  });
});
```

3.  Then use the default routes...
````js
Router.go('/insert/record');
Router.go('/upsert/record/:id');
Router.go('/view/record/:id');
Router.go('/list/records');
Router.go('/grid/records');
Router.go('/record/:id');
````

4.  Or add templates directly to your application...

````html
<!-- basic upsert/list pattern -->
{{> recordsUpsertPage }}
{{> recordsListPage }}

<!-- additional views -->
{{> recordImageGridPage }}
{{> recordImageGridPage }}
{{> recordsTablePage }}
````


===============================
#### Cloning/Forking  



````bash

````


===============================
#### Licensing  

MIT.  Use as you will.
