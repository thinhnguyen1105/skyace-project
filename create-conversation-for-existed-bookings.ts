import * as mongoose from 'mongoose';
import firebase from 'firebase';
import * as moment from 'moment';
import config from './api/config';
import { TuitionSchema } from './api/modules/elearning/tuitions/mongoose';
import { GroupTuitionSchema } from './api/modules/elearning/group-tuitions/mongoose';
import { ConversationSchema } from './api/modules/private-message/conversations/mongoose';
import initFirebaseApp from './nextjs/helpers/init-firebase';
import { CourseSchema } from './api/modules/elearning/courses/mongoose';

mongoose.connect(config.database.mongoConnectionString, { useNewUrlParser: true }, async (err) => {
  if (err) {
    console.log(err);
  }

  // Individual tuitions
  const TuitionsModel = mongoose.model('Tuition', TuitionSchema);
  const ConversationsModel = mongoose.model('Conversation', ConversationSchema);
  mongoose.model('Course', CourseSchema);
  await ConversationsModel.deleteMany({}).exec();
  let results: any = await TuitionsModel.find({isCompleted: false, isCanceled: false, isPendingReview: false})
    .populate({
      path: 'course',
      model: 'Course',
      populate: [{
        path: 'level',
        model: 'Level',
      }, {
        path: 'subject',
        model: 'Subject'
      }, {
        path: 'grade',
        model: 'Grade'
      }]
    })
    .exec();

    let tuitions = JSON.parse(JSON.stringify(results));
    tuitions = tuitions.map((val) => {
      let clone = JSON.parse(JSON.stringify(val));
      if (clone && clone.course) {
        clone.course = {
          ...clone.course,
          level: clone.course.level ? clone.course.level.name : undefined,
          grade: clone.course.grade ? clone.course.grade.name : undefined,
          subject: clone.course.subject ? clone.course.subject.name : undefined,
        }
      }
      return clone;
    })

  const conversations: any = [];
  for (let tuition of tuitions) {
    conversations.push({
      participants: [tuition.tutor, tuition.student],
      tuition: tuition._id,
      tenant: tuition.tenant,
      isDisabled: false,
    });
  }

  const conversationList: any = await ConversationsModel.create(conversations);
  for (let item of conversationList) {
    const tuition = tuitions.filter((tuition) => String(tuition._id) === String(item.tuition))[0];
    const notificationContent = `New course ${tuition.course.subject.slice(0,2).toUpperCase()}${tuition.course.level.slice(0,1).toUpperCase()}${String(tuition.course.grade).slice(0,1).toUpperCase()}-${moment((tuition as any).createdAt).format('YYMMDD')} has been created`;

    if (!firebase.apps.length) {
      initFirebaseApp();
    }
    await firebase.database().ref(`skyace-message/${item._id}/messages`).push({
      sender: {
        id: 'system',
        fullName: 'system',
      },
      createdAt: new Date().getTime(),
      content: notificationContent,
      type: 'notification'
    });
    await firebase.database().ref(`skyace-notification/${item.participants[0]}/${item._id}`).update({
      seen: false,
      lastMessage: 'System Notification',
    });
    await firebase.database().ref(`skyace-notification/${item.participants[1]}/${item._id}`).update({
      seen: false,
      lastMessage: 'System Notification',
    });
  }

  // Group tuitions
  const GroupTuitionModel = mongoose.model('GroupTuition', GroupTuitionSchema);
  const groupTuitions: any = await GroupTuitionModel.find({isActive: true}).exec();
  const groupConversations = groupTuitions.map(val => {
    return {
      participants: [val.tutor, ...val.students],
      groupTuition: val._id,
      tenant: val.tenant,
      isDisabled: false
    }
  })

  const groupConversationList: any = await ConversationsModel.create(groupConversations);
  if (groupConversationList) {
    for (let val of groupConversationList) {
      const groupTuition = groupTuitions.filter(groupTuition => groupTuition._id.toString() === val.groupTuition.toString())[0];
      const groupNotificationContent = `New course ${groupTuition.course.subject.slice(0,2).toUpperCase()}${groupTuition.course.level.slice(0,1).toUpperCase()}${String(groupTuition.course.grade).slice(0,1).toUpperCase()}-${moment((groupTuition as any).createdAt).format('YYMMDD')} has been created`;
      if (!firebase.apps.length) {
        initFirebaseApp();
      }
      await firebase.database().ref(`skyace-message/${val._id}/messages`).push({
        sender: {
          id: 'system',
          fullName: 'system',
        },
        createdAt: new Date().getTime(),
        content: groupNotificationContent,
        type: 'notification'
      });
      const promises = val.participants.map(participant => {
        return firebase.database().ref(`skyace-notification/${participant}/${val._id}`).update({
          seen: false,
          lastMessage: 'System Notification',
        });
      })
      await Promise.all(promises);
    }
  }

  console.log('Finish Migrate');
  process.exit();
});