import * as mongoose from 'mongoose';
import config from './api/config';
import * as moment from 'moment';
import { TuitionSchema } from './api/modules/elearning/tuitions/mongoose';
import { CourseSchema } from './api/modules/elearning/courses/mongoose';
import { GroupTuitionSchema } from './api/modules/elearning/group-tuitions/mongoose';

mongoose.connect(config.database.mongoConnectionString, { useNewUrlParser: true }, async (err) => {
  if (err) {
    console.log(err);
  }

  // Individual tuitions
  const TuitionsModel = mongoose.model('Tuition', TuitionSchema);
  const GroupTuitionsModel = mongoose.model('GroupTuition', GroupTuitionSchema);
  mongoose.model('Course', CourseSchema);

  let results: any = await TuitionsModel.find()
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
  
  const tuitionPromises: any[] = [];
  for (let item of tuitions) {
    const referenceId = `${item.course.subject.slice(0,2).toUpperCase()}${item.course.level.slice(0,1).toUpperCase()}${String(item.course.grade).slice(0,1).toUpperCase()}-${moment(item.createdAt).format('YYMMDD')}`;
    tuitionPromises.push(TuitionsModel.findOneAndUpdate({_id: item._id}, {$set: {referenceId}}).exec());
  }

  const groupTuitions: any = await GroupTuitionsModel.find().exec();
  const groupTuitionPromises: any[] = [];
  for (let item of groupTuitions) {
    const referenceId = `${item.course.subject.slice(0,2).toUpperCase()}${item.course.level.slice(0,1).toUpperCase()}${String(item.course.grade).slice(0,1).toUpperCase()}-${moment(item.createdAt).format('YYMMDD')}`;
    groupTuitionPromises.push(GroupTuitionsModel.findOneAndUpdate({_id: item._id}, {$set: {referenceId}}).exec());
  }

  await Promise.all([...tuitionPromises, ...groupTuitionPromises]);

  console.log('Finish Update ReferenceID');
  process.exit();
});