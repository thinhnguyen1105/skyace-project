const smsContent = {
  accountRegistration: {
    toStudent: 'Dear <%= studentName %>, thank you for signing up with SkyAce! Please verify your account with the confirmation link sent to your registered email address.',
    toTutor: 'Dear <%= tutorName %>, thank you for signing up with SkyAce! Please verify your account with the confirmation link sent to your registered email address. ',
  },
  newBooking: {
    toStudent: 'Dear <%= studentName %>, your booking details for <%= referenceId %> have been sent to your registered email. Please check that the details are correct.',
    toTutor: 'Dear <%= tutorName %>, you have a new student. Please check your email for more information.'
  },
  cancelTuitionByStudent: {
    toStudent: 'Dear <%= studentName %>, your course <%= referenceId %> has been terminated at your request. Please check your email for the confirmation details. ',
    toTutor: 'Dear <%= tutorName %>, the course <%= referenceId %> has been terminated at your student’s request. Please check your email for the confirmation details. ',
  },
  cancelTuitionByTutor: {
    toStudent: 'Dear <%= studentName %>, the course <%= referenceId %> has been terminated at your tutor’s request. Please check your email for the confirmation details. ',
    toTutor: 'Dear <%= tutorName %>, your lessons for <%= referenceId %> have been terminated at your request. Please check your email for the confirmation details. ',
  },
  cancelUnpaidTuition: {
    toTutor: "Dear <%= tutorName %>, your lessons for <%= referenceId %> have been terminated due to your student, <%= studentName %>'s late payment. Please check your email for the confirmation details. ",
    toStudent: "Dear <%= studentName %>, your lessons for <%= referenceId %> have been terminated due to your late payment. Please check your email for the confirmation details. "
  },
  notiUnpaidTuition: {
    toStudent: "Dear <%= studentName %>, the next lesson in your course <%= referenceId %> is coming soon. Please make payment to ensure availability. Thank you. "
  },
  rescheduleByStudent: {
    toStudent: 'Dear <%= studentName %>, your lesson has been rescheduled from <%= oldStart %> to <%= newStart %>. Please check email for details. ',
    toTutor: 'Dear <%= tutorName %>, your lesson with <%= studentName %> has been rescheduled from <%= oldStart %> to <%= newStart %>. Please check email for details.',
  },
  rescheduleByTutor: {
    toStudent: 'Dear <%= studentName %>, your lesson with <%= tutorName %> has been rescheduled from <%= oldStart %> to <%= newStart %>. Please check email for details.',
    toTutor: 'Dear <%= tutorName %>, your lesson with <%= studentName %> has been rescheduled from <%= oldStart %> to <%= newStart %>. Please check email for details. ',
  },
  commencementVirtualClass: 'Dear <%= name %>, your lesson is starting soon. Please refrain from being late. Thanks!',
};

export default smsContent;