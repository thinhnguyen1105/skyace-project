const SAMPLE_COURSES = [
  {
    "subject" : "Mathematic",
    "country" : "Belgium",
    "level" : "Preschool",
    "grade" : "Kindergarten",
    "session" : 8,
    "hourPerSession" : 2,
    "isDeleted" : false
  },
  {
    "subject" : "English",
    "country" : "Canada",
    "level" : "Primary",
    "grade" : "Primary 1",
    "session" : 9,
    "hourPerSession" : 1,
    "isDeleted" : false
  },
  {
    "subject" : "Philosophy",
    "country" : "Croatia",
    "level" : "Secondary",
    "grade" : "Secondary 3",
    "session" : 10,
    "hourPerSession" : 1,
    "isDeleted" : false
  },
  {
    "subject" : "Chemistry",
    "country" : "France",
    "level" : "Post Secondary",
    "grade" : "Junior College",
    "session" : 8,
    "hourPerSession" : 2,
    "isDeleted" : false
  },
  {
    "subject" : "Physics",
    "country" : "Japan",
    "level" : "Doctor",
    "grade" : "PhD",
    "session" : 9,
    "hourPerSession" : 1.5,
    "isDeleted" : false
  }
];

const SAMPLE_TUTORS = [
  {
    "roles" : [
      "tutor"
    ],
    "email" : "test1@gmail.com",
    "password" : "$2a$09$gimF99bbupPpBdsLsTPkRODKyLXX429/53S0Jfz7XpdjRm2.XmKYu",
    "age" : 30,
    "firstName" : "Karim",
    "lastName" : "Benzema",
    "fullName": "Karim Benzema",
    "teacherExperience" : [],
    "courseForTutor" : [],
    "rating": "3",
    "education" : {
        "highestEducation" : "Master",
        "major" : "Mathematics",
        "university" : "University1"
    },
    "biography" : {
        "language" : "English",
        "nationality" : "Singapore",
        "aboutMe" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "race" : "Asian",
        "gender" : "Male",
        "yearsOfExp" : 1
    },
  },
  {
    "roles" : [
      "tutor"
    ],
    "email" : "test2@gmail.com",
    "password" : "$2a$09$gimF99bbupPpBdsLsTPkRODKyLXX429/53S0Jfz7XpdjRm2.XmKYu",
    "age" : 20,
    "firstName" : "Harry",
    "lastName" : "Kane",
    "fullName": "Harry Kane",
    "teacherExperience" : [],
    "courseForTutor" : [],
    "rating": "3.5",
    "education" : {
        "highestEducation" : "Bachelor",
        "major" : "Physics",
        "university" : "University2"
    },
    "biography" : {
        "language" : "English",
        "nationality" : "France",
        "aboutMe" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "race" : "Europe",
        "gender" : "Female",
        "yearsOfExp" : 2
    }
  },
  {
    "roles" : [
      "tutor"
    ],
    "email" : "test3@gmail.com",
    "password" : "$2a$09$gimF99bbupPpBdsLsTPkRODKyLXX429/53S0Jfz7XpdjRm2.XmKYu",
    "age" : 25,
    "firstName" : "Romelu",
    "lastName" : "Lukaku",
    "fullName": "Romelu Lukaku",
    "teacherExperience" : [],
    "courseForTutor" : [],
    "rating": "4",
    "education" : {
        "highestEducation" : "Primary",
        "major" : "English",
        "university" : "University3"
    },
    "biography" : {
        "language" : "English",
        "nationality" : "Belgium",
        "aboutMe" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "race" : "Europe",
        "gender" : "Male",
        "yearsOfExp" : 3
    }
  },
  {
    "roles" : [
      "tutor"
    ],
    "email" : "test4@gmail.com",
    "password" : "$2a$09$gimF99bbupPpBdsLsTPkRODKyLXX429/53S0Jfz7XpdjRm2.XmKYu",
    "age" : 35,
    "firstName" : "David",
    "lastName" : "Beckham",
    "fullName": "David Beckham",
    "teacherExperience" : [],
    "courseForTutor" : [],
    "rating": "4.5",
    "education" : {
        "highestEducation" : "Secondary",
        "major" : "Chemistry",
        "university" : "University4"
    },
    "biography" : {
        "language" : "Vietnamese",
        "nationality" : "Vietnam",
        "aboutMe" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "race" : "Asian",
        "gender" : "Male",
        "yearsOfExp" : 4
    }
  },
  {
    "roles" : [
      "tutor"
    ],
    "email" : "test5@gmail.com",
    "password" : "$2a$09$gimF99bbupPpBdsLsTPkRODKyLXX429/53S0Jfz7XpdjRm2.XmKYu",
    "age" : 30,
    "firstName" : "Eden",
    "lastName" : "Hazard",
    "fullName": "Eden Hazard",
    "teacherExperience" : [],
    "courseForTutor" : [],
    "rating": "5",
    "education" : {
        "highestEducation" : "Secondary",
        "major" : "Mathematics",
        "university" : "University5"
    },
    "biography" : {
        "language" : "English",
        "nationality" : "Nigeria",
        "aboutMe" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        "race" : "Africa",
        "gender" : "Female",
        "yearsOfExp" : 5
    }
  }
];

const SAMPLE_SCHEDULES = [
  {
    "title" : "New Event 1",
    "type" : "tutor"
  },
  {
    "title" : "New Event 2",
    "type" : "tutor"
  },
  {
    "title" : "New Event 3",
    "type" : "tutor"
  },
  {
    "title" : "New Event 4",
    "type" : "tutor"
  },
  {
    "title" : "New Event 5",
    "type" : "tutor"
  },
];

const SAMPLE_CURRENCIES = [
  {
    code: 'USD',
    exchangeRate: 1.38,
    name: 'United States Dollar'
  },
  {
    code: 'EUR',
    exchangeRate: 1.60,
    name: 'Euro'
  },
  {
    code: 'GBP',
    exchangeRate: 1.78,
    name: 'British Pound'
  },
  {
    code: 'AUD',
    exchangeRate: 0.99,
    name: 'Australian Dollar'
  },
  {
    code: 'CAD',
    exchangeRate: 1.04,
    name: 'Canadian Dollar'
  },
  {
    code: 'CHF',
    exchangeRate: 1.41,
    name: 'Swiss Franc'
  },
  {
    code: 'INR',
    exchangeRate: 0.02,
    name: 'Indian Rupee'
  },
  {
    code: 'JPY',
    exchangeRate: 0.0125,
    name: 'Japanese Yen'
  },
  {
    code: 'CNY',
    exchangeRate: 0.2,
    name: 'Chinese Yuan'
  },
  {
    code: 'MYR',
    exchangeRate: 0.33,
    name: 'Malaysian Ringgit'
  },
  {
    code: 'THB',
    exchangeRate: 0.04,
    name: 'Thai Baht'
  },
  {
    code: 'IDR',
    exchangeRate: 0.00009,
    name: 'Indonesian Rupiah'
  },
  {
    code: 'KRW',
    exchangeRate: 0.00123,
    name: 'South Korean won'
  },
  {
    code: 'PHP',
    exchangeRate: 0.02553,
    name: 'Philippine Peso'
  },
  {
    code: 'VND',
    exchangeRate: 0.00006,
    name: 'Vietnamese dong'
  },
  {
    code: 'HKD',
    exchangeRate: 0.17524,
    name: 'Hong Kong Dollar'
  },
  {
    code: 'TWD',
    exchangeRate: 0.04470,
    name: 'New Taiwan dollar'
  },
  {
    code: 'SGD',
    exchangeRate: 1,
    name: 'Singapore Dollar'
  }
];

export default {
  SAMPLE_COURSES,
  SAMPLE_TUTORS,
  SAMPLE_SCHEDULES,
  SAMPLE_CURRENCIES
};