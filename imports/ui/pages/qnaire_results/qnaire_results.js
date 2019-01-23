import { Meteor } from "meteor/meteor";
import { User } from "../../../api/users/users.js";
import "./qnaire_results.html";

Template.qnaire_results.onCreated(function() {
	this.qnrid = FlowRouter.getParam('qnaireId');
    console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq", this.qnrid);
//    this.autorun( () => {
//        this.subscription = this.subscribe('qnaire', this.qnrid, {
//            onStop: function () {
//                console.log("Qnaire subscription stopped! ", arguments, this);
//            },
//            onReady: function () {
//                console.log("Qnaire subscription ready! ", arguments, this);
//            }
//        });
//    });
  if (this.data.userId) {
    this.userId = this.data.userId;
  } else {
    this.userId = Meteor.userId();
  }
});

Template.qnaire_results.helpers({
  user() {
    let user = User.findOne({ _id: Template.instance().userId });
    return user;
  },
  getQnaireId() {
	return Template.instance().qnrid;
  },
  resultTable(userObj) {
	let myQn = userObj.MyProfile.UserType.getQnaire(Template.instance().qnrid);
	console.log(myQn);
	myTable =  "<table>";
	myTable +=   "<tr>";
	myTable +=     "<th>Label </th><th>Question </th><th>Answer </th>";
	myTable +=   "</tr>";
	//myTable +=   "<tr>";
	console.log("wwwwwwwwwwwwffffffffffffff", myQn);
	myQn.QnaireAnswers.forEach(function(value, index) {
	  myTable += "<tr>";
	  myTable +=   "<td>" + value.label + "</td>";
	  myTable +=   "<td>" + value.question + "</td>";
	  myTable +=   "<td>" + value.answers + "</td>";
	  myTable += "</tr>";
	});
	//myTable +=   "</tr>"
	myTable += "</table>";
//		<table>
//			<thead>
//				<tr>
//					<th>hello</th>
//				</tr>
//			</thead>
//			<tbody>
//				<tr>
//					<td>there</td>
//				</tr>
//			</tbody>
//		</table>
	return myTable;
  },

  results(category, userObj, mbtiNumber) {
    let identifier = userObj.MyProfile.UserType.Personality.getIdentifierById(
      category
    );

    let identifierValue =
      userObj.MyProfile.UserType.Personality[identifier].Value;

    let percentageValue =
      userObj.MyProfile.UserType.Personality[
        userObj.MyProfile.UserType.Personality.getIdentifierById(category)
      ];

    let percentage = Math.round(Math.abs(percentageValue.Value) * 2);

    //checking if INTJ on screen and if user personality is INT or J
    if (mbtiNumber === 6 && identifierValue < 0) {
      return 50 + percentage;
      //checking if INTJ on screen and if user personality is ESF or P
    } else if (mbtiNumber === 6 && identifierValue > 0) {
      return 50 - percentage;
    }

    //checking if ESFP on screen and if user personality is ESF or P
    if (mbtiNumber === 7 && identifierValue > 0) {
      return 50 + percentage;
      //checking if ESFP on screen and if user personality is INT or J
    } else if (mbtiNumber === 7 && identifierValue < 0) {
      return 50 - percentage;
    }
  }
});

Template.qnaire_results.events({
  "click a#results_descriptions"(event, instance) {
    event.preventDefault();
    FlowRouter.go("/resultsDescriptions");
  }
});
