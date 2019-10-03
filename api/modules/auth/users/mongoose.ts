import * as mongoose from 'mongoose';
import { addAuditSchema, addActiveSchema } from '../../../core/helpers';
import { IUser } from './interface';
import addTenantSchema from '../../../core/helpers/add-tenant-schema';
import * as mongoosastic from 'mongoosastic';
import getElasticInstance from "../../../elasticsearch/elasticInstance";

// Have to create this schema to prevent mongoose auto creating _id for subarray, which broke ElasticSearch's structure.
const TeacherExperienceSchema = new mongoose.Schema(
  {
    start: {
      type: Date,
      es_type: "date"
    },
    end: {
      type: Date,
      es_type: "date"
    },
    experience: {
      type: String,
      es_type: "text"
    },
    index: {
      type: Number,
      es_type: "integer"
    }
  },
  // this line below prevent mongoose to create _id field for sub array automatically
  { _id: false }
);

const ListSubjectSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      es_type: "text"
    },
    academicLevel: {
      type: String,
      es_type: "text"
    },
    grade: {
      type: String,
      es_type: "text"
    },
    hourlyRate: {
      type: Number,
      es_type: "integer"
    },
    index: {
      type: Number,
      es_type: "integer"
    }
  },
  // this line below prevent mongoose to create _id field for sub array automatically
  { _id: false }
);

const UsersSchema = new mongoose.Schema(addAuditSchema(addActiveSchema(addTenantSchema({
  email: {
    type: String,
    es_type: "text",
    es_analyzer: "default",
  },
  password: {
    type: String,
    es_type: "text"
  },
  imageUrl: {
    type: String,
    es_type: "text"
  },
  firstName: {
    type: String,
    es_type: 'text',
    es_fielddata: true,
    es_analyzer: "default",
  },
  lastName: {
    type: String,
    es_type: 'text',
    es_fielddata: true,
    es_analyzer: "default",
  },
  fullName: {
    type: String,
    es_type: 'keyword',
  },
  normalizedFullName: {
    type: String,
    es_type: "text",
    es_fielddata: true,
  },
  timeZone: {
    type: Object,
    es_type: 'nested',
  },
  currency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Currency",
    es_type: 'nested'
  },
  hourlyPerSessionTrial: {
    type: Number,
    es_type: "float",
    default: 0,
  },
  dob: {
    type: Date,
    es_type: "date"
  },
  gender: {
    type: String,
    es_type: "text"
  },
  nationality: {
    type: String,
    es_type: "text"
  },
  currentAcademicLevel: {
    type: String,
    es_type: "text"
  },
  nationalID: {
    type: String,
    es_type: "text"
  },
  currentlyBasedIn: {
    type: String,
    es_type: "text"
  },
  paypalEmail: {
    type: String,
    es_type: "text"
  },
  paymentMethod: {
    type: String,
    es_type: "text"
  },
  bankName: {
    type: String,
    es_type: "text"
  },
  accountHolderName: {
    type: String,
    es_type: "text"
  },
  accountNumber: {
    type: String,
    es_type: "text"
  },
  biography: {
    language: {
      type: String,
      es_type: "text"
    },
    nationality: {
      type: String,
      es_type: "text"
    },
    aboutMe: {
      type: String,
      es_type: "text"
    },
    race: {
      type: String,
      es_type: "text"
    },
    gender: {
      type: String,
      es_type: "text"
    },
    yearsOfExp: {
      type: Number,
      es_type: "float"
    },
    secondaryLanguage: {
      type: String,
      es_type: "text"
    }
  },
  education: {
    highestEducation: {
      type: String,
      es_type: "text"
    },
    major: {
      type: String,
      es_type: "text"
    },
    university: {
      type: String,
      es_type: "text"
    },
    fileListDocument: {
      type: Object,
      es_type: "object"
    }
  },
  teacherExperience: [
    TeacherExperienceSchema
  ],
  teacherSubject: {
    basedIn: {
      type: String,
      es_type: "text"
    },
    listSubject: [
      ListSubjectSchema
    ]
  },
  externalLogin: {
    google: {
      id: {
        type: String,
        es_type: "text"
      },
      email: {
        type: String,
        es_type: "text"
      }
    },
    facebook: {
      id: {
        type: String,
        es_type: "text"
      },
      email: {
        type: String,
        es_type: "text"
      }
    },
  },
  permissions: {
    type: Array,
    es_type: "nested"
  },
  roles: {
    type: Array,
    es_type: "keyword"
  },
  isLocked: {
    type: Boolean,
    es_type: "boolean"
  },
  failLoginTryCount: {
    type: Number,
    es_type: "integer"
  },
  emailConfirmed: {
    type: Boolean,
    es_type: "boolean"
  },
  lastLoginTime: {
    type: Date,
    es_type: "date"
  },
  language: {
    type: String,
    es_type: "text"
  },
  phone: {
    phoneID: {
      type: String,
      es_type: "text"
    },
    phoneNumber: {
      type: String,
      es_type: "text"
    },
  },
  passwordResetToken: {
    type: String,
    es_type: "text"
  },
  passwordResetExpires: {
    type: Date,
    es_type: "date"
  },
  // FOR ONLY TUTOR
  age: {
    type: Number,
    es_type: "integer"
  },
  rating: {
    type: Number,
    es_type: "float"
  },
  courseForTutor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseForTutor",
    es_type: "nested",
    es_include_in_parent: true
  }],
  forGroupTuitionElastic: {
    type: Boolean,
    es_type: "boolean"
  },
  groupTuitionFakeUsers: [{
    type: String,
    es_type: 'keyword',
  }],
  distributorInfo: {
    type: Object,
    es_type: 'object'
  },
  firstTimeLoggedIn: {
    type: Boolean,
    es_type: "boolean",
    default: true
  },
  isImported: {
    type: Boolean,
    es_type: "boolean",
    default: false
  },
  distributorPaycheck: [{
    type: String,
    es_type: "text"
  }],
  lang: {
    type: String,
    es_type: "text",
    default: 'en'
  },
}))), {timestamps: true});

UsersSchema.index({'distributorInfo.companyName' : 'text'});
interface IUserModel extends mongoose.Model<IUser> {
  synchronize(criteria?: any): any;
  search(query: any, options: any, callback: any): any;
  esSearch(query: any, options: any, callback: any);
  createMapping(options: any, callback?: any): any;
}

// Connect mongoose plugin Mongoosastic with ElasticSearch
UsersSchema.plugin(mongoosastic, {
  esClient: getElasticInstance(),
  populate: [
    {
      path: 'courseForTutor',
      model: 'CourseForTutor',
      populate: [{
        path: 'course',
        model: 'Course',
        populate: [{
          path: 'subject',
          model: 'Subject',
        }, {
          path: 'level',
          model: 'Level'
        }, {
          path: 'grade',
          model: 'Grade'
        }]
      }, {
        path: 'tuitions',
        model: 'Tuition',
        populate: {
          path: 'sessions',
          model: 'Session'
        }
      }, {
        path: 'groupTuition',
        model: 'GroupTuition',
        populate: {
          path: 'period',
          model: 'Schedule'
        }
      }]
    },
    {
      path: 'currency',
      model: 'Currency'
    }
  ],
  // transform data to create a third field in order to sort both group tuition & individual tuition, and filter trial course.
  transform: function (data: any, user: any) {
    if (data.forGroupTuitionElastic) {
      data.esSortingHourlyRate = user.courseForTutor && user.courseForTutor.length ? user.courseForTutor[0].groupTuition && user.courseForTutor[0].groupTuition.course ? [user.courseForTutor[0].groupTuition.course.hourlyRate] : [] : [];
      data.esSortingSubject = user.courseForTutor && user.courseForTutor.length ? user.courseForTutor[0].groupTuition && user.courseForTutor[0].groupTuition.course ? [user.courseForTutor[0].groupTuition.course.subject ? user.courseForTutor[0].groupTuition.course.subject.name : ''] : [] : [];
    } else {
      data.esSortingHourlyRate = user.courseForTutor && user.courseForTutor.length ? user.courseForTutor.map((val) => val.hourlyRate) : [];
      data.esSortingSubject = user.courseForTutor && user.courseForTutor.length ? user.courseForTutor.map((val) => val.course ? val.course.subject ? val.course.subject.name : '' : '').filter(val => val && val !== 'trial') : [];
    }
    data.courseForTutor = data.courseForTutor.filter(val => val.hourlyRate > 0).map((val) => {
      let deepClone = JSON.parse(JSON.stringify(val));
      if (deepClone.course){
        deepClone.course = {
          ...deepClone.course,
          level: deepClone.course.level ? deepClone.course.level.name : undefined,
          grade: deepClone.course.grade ? deepClone.course.grade.name : undefined,
          subject: deepClone.course.subject ? deepClone.course.subject.name : undefined
        }
      }
      return deepClone;
    });
    return data;
  }
});

var UsersModel = mongoose.model<IUser, IUserModel>('User', UsersSchema);

UsersModel.createMapping(
  {
    "settings": {
      "number_of_shards": 1,
      "analysis": {
        "filter": {
          "nGram_filter": {
            "type": "ngram",
            "min_gram": 3,
            "max_gram": 5,
            "token_chars": [
              "letter",
              "digit",
              "punctuation",
              "whitespace",
              "symbol"
            ]
          }
        },
        "analyzer": {
          "default": {
            "tokenizer": "my_tokenizer",
            "filter": [
              "lowercase",
              "asciifolding",
              "nGram_filter"
            ]
          }
        },
        "tokenizer": {
          "my_tokenizer": {
            "type": "ngram",
            "min_gram": 3,
            "max_gram": 5,
            "token_chars": [
              "letter",
              "digit",
              "whitespace",
              "symbol"
            ]
          }
        }
      }
    }
  },
  function (err: any, mapping: any) {
    if (err) {
      console.log('error creating mapping', err);
    } else {
      console.log('Mapping Created', mapping);
      // Synchronize records from mongodb to elasticsearch index
      var stream = UsersModel.synchronize();
      var count = 0;
      stream.on('data', function () {
        count++;
      });
      stream.on('close', function () {
        console.log('Indexed ' + count + ' Documents');
      });
      stream.on('error', function (error: any) {
        console.log(error);
      });
    }
  }
);

export { 
  UsersSchema
};
export default UsersModel;