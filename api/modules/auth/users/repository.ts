import UsersModel from './mongoose';
import {
  IFindUserDetail,
  ICreateUserInput,
  IFindUsersQuery,
  IFindUsersResult,
  IFindUsersESResult,
  IUpdateUserInput,
  IActivateUser,
  ICreateUserBySocialCredentialInput,
} from './interface';
import CourseModel from '../../elearning/courses/mongoose';
import * as courseForTutorRepository from '../../elearning/course-for-tutor/repository';
import * as schedulesRepository from '../../elearning/schedules/repository';
import rawData from '../../../config/rawdata';
import { ILoginInput } from '../auth/interface';
import TenantsModel from '../tenants/mongoose';
import config from '../../../config';
import CourseForTutorModel from '../../../../api/modules/elearning/course-for-tutor/mongoose';
import { createTrialCourse } from '../../elearning/courses/repository';

const addQuery = (tenantId: string, query: IFindUsersQuery): any => {
  return UsersModel.find({
    $and: [
      { tenant: tenantId },
      { forGroupTuitionElastic: { $ne: true } },
      query.search
        ? {
          $or: [
            { email: { $regex: query.search, $options: 'i' } },
            {
              fullName: {
                $regex: query.search,
                $options: 'i'
              }
            }
          ]
        }
        : {},
      query.role ? { roles: query.role } : {}
    ]
  });
};

const addQueryFranchises = (query: IFindUsersQuery): any => {
  return UsersModel.find({
    $and: [
      { forGroupTuitionElastic: { $ne: true } },
      query.search
        ? { 'distributorInfo.companyName': { $regex: `^${query.search}`, $options: 'i' } }
        : {},
      { roles: 'franchise' }
    ]
  });
}

const findUsers = async (tenantId: string, query: IFindUsersQuery): Promise<IFindUsersResult> => {
  try {
    // Exec query
    const totalPromise = addQuery(tenantId, query)
      .countDocuments()
      .exec();

    const dataPromise = addQuery(tenantId, query)
      .sort((query.asc as any) === 'true' ? query.sortBy : `-${query.sortBy}`)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(Number(query.pageSize))
      .populate('tenant')
      .select(`_id permissions roles phone createdAt lastModifiedAt firstName lastName email phone, normalizedFullname fullName isActive emailConfirmed tenant firstTimeLoggedIn distributorInfo lang`)
      .exec();

    const [total, data] = await Promise.all([totalPromise, dataPromise]);

    return {
      total,
      data
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findFranchises = async (query: IFindUsersQuery): Promise<IFindUsersResult> => {
  try {
    // Exec query
    const totalPromise = addQueryFranchises(query)
      .countDocuments()
      .exec();

    const dataPromise = addQueryFranchises(query)
      .sort((query.asc as any) === 'true' ? query.sortBy : `-${query.sortBy}`)
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(Number(query.pageSize))
      .populate('tenant')
      .select(`_id permissions roles phone createdAt lastModifiedAt firstName lastName email phone, normalizedFullname fullName isActive emailConfirmed tenant distributorInfo firstTimeLoggedIn lang`)
      .exec();

    const [total, data] = await Promise.all([totalPromise, dataPromise]);

    return {
      total,
      data
    };
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const getAllFranchiseName = async (): Promise<any> => {
  try {
    return await UsersModel.find({ roles: { $in: ['franchise', 'sysadmin'] } }).select('_id fullName roles distributorInfo').exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const findUserForLogin = async (tenantId: string, body: ILoginInput) => {
  try {
    return UsersModel.findOne({
      $and: [
        { tenant: tenantId },
        { email: body.email }
      ]
    }).populate('tenant').populate('currency').exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findUserForImpersonate = async (tenant: string, _id: string) => {
  try {
    return UsersModel.findOne({ tenant: tenant, _id: _id }).populate('tenant').populate('currency').exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const findUserBySocialCredential = async (tenantId: string, socialAccountId: string): Promise<IFindUserDetail> => {
  try {
    return await UsersModel.findOne({
      $and: [
        { tenant: tenantId },
        { $or: [{ 'externalLogin.facebook.id': socialAccountId }, { 'externalLogin.google.id': socialAccountId }] }
      ]
    }).populate('tenant').exec() as any;
  } catch (error) {
    throw new Error('Internal Server Error');
  }
};

const findUserByEmail = async (
  tenantId: string,
  email: string
): Promise<IFindUserDetail> => {
  try {
    const user = await UsersModel.findOne({
      $and: [{ email: email }, { tenant: tenantId }]
    })
      .populate('tenant')
      .select(`_id permissions roles firstName lastName email phone, normalizedFullname fullName isActive emailConfirmed tenant firstTimeLoggedIn distributorInfo lang`)
      .exec();
    return user as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findUserById = async (
  userId: string
): Promise<IFindUserDetail> => {
  try {
    const user = await UsersModel.findOne({
      $and: [{ _id: userId }]
    })
      .populate('tenant')
      .populate('currency')
      .select(`_id permissions roles firstName lastName email phone normalizedFullname fullName isActive emailConfirmed imageUrl tenant currency timeZone distributorInfo firstTimeLoggedIn lang`)
      .exec();
    return user as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findUserWithPasswordById = async (
  tenantId: string,
  userId: string
): Promise<any> => {
  try {
    return await UsersModel.findOne({
      tenant: tenantId,
      _id: userId
    }).select('_id password').exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const findTutorById = async (tenantId: string, tutorId: string): Promise<IFindUserDetail> => {
  try {
    let user = await UsersModel.findOne({
      $and: [{ _id: tutorId }, { tenant: tenantId }, { roles: 'tutor' }]
    })
      .populate('tenant')
      .populate('currency')
      .populate(
        {
          path: 'courseForTutor',
          model: 'CourseForTutor',
          populate: [
            {
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
            },
            {
              path: 'tuitions',
              model: 'Tuition',
              populate: {
                path: 'sessions',
                model: 'Session'
              }
            }
          ]
        })
      .select(`_id permissions roles firstName lastName email phone gender paypalEmail paymentMethod bankName accountHolderName accountNumber nationality currentAcademicLevel nationalID currentlyBasedIn timeZone currency hourlyPerSessionTrial normalizedFullname fullName isActive emailVerified tenant biography education teacherExperience dob imageUrl teacherSubject courseForTutor rating externalLogin firstTimeLoggedIn distributorInfo lang`)
      .exec() as any;
    let deepClone = JSON.parse(JSON.stringify(user));
    if (deepClone && deepClone.courseForTutor) {
      deepClone.courseForTutor = deepClone.courseForTutor.map((val) => {
        let clone = JSON.parse(JSON.stringify(val));
        if (clone.course) {
          clone.course.level = clone.course.level ? clone.course.level.name : undefined;
          clone.course.grade = clone.course.grade ? clone.course.grade.name : undefined;
          clone.course.subject = clone.course.subject ? clone.course.subject.name : undefined;
        }
        return clone;
      })
    }
    return deepClone as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const findStudentById = async (tenantId: string, studentId: string): Promise<IFindUserDetail> => {
  try {
    const user = await UsersModel.findOne({
      $and: [{ _id: studentId }, { tenant: tenantId }, { roles: 'student' }]
    })
      .populate('tenant')
      .populate('currency')
      .select(`_id permissions roles firstName lastName email gender nationality currentAcademicLevel nationalID currentlyBasedIn phone timeZone currency normalizedFullname fullName isActive emailVerified tenant dob imageUrl firstTimeLoggedIn lang`)
      .exec();
    return user as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const createNewUser = async (
  tenantId: string,
  body: ICreateUserInput
): Promise<IFindUserDetail> => {
  try {
    const newUser = await UsersModel.create({
      ...body,
      tenant: tenantId,
      rating: 0
    });

    return await UsersModel.findOne({ _id: newUser._id })
      .populate('tenant')
      .populate('currency')
      .select(`_id permissions roles firstName lastName email phone normalizedFullname fullName isActive emailConfirmed tenant currency timeZone createdAt distributorInfo lang`)
      .exec() as any;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const createUserBySocialCredential = async (tenantId: string, body: ICreateUserBySocialCredentialInput): Promise<IFindUserDetail> => {
  try {
    const newUser = new UsersModel({
      ...body,
      tenant: tenantId,
      emailConfirmed: true,
      isActive: true,
      rating: 0
    });
    await newUser.save();

    return await UsersModel.findOne({ _id: newUser._id }).populate('tenant').exec() as any;
  } catch (error) {
    throw new Error('Internal Server Error');
  }
};

const enableFunctionOfTrialButton = async (tutorId: string, tenantId: string, hourlyPerSessionTrial: number): Promise<void> => {
  try {
    const tutorCourses = await CourseForTutorModel.find({ tutor: tutorId }).populate({
      path: 'course', model: 'Course',
      populate: [{
        path: 'subject',
        model: 'Subject',
      }]
    });
    const trialCourse = tutorCourses.filter(item => item.course && item.course.subject && item.course.subject.name === 'trial');
    switch (hourlyPerSessionTrial) {
      case 0:
        // delete course for tutor
        if (trialCourse && trialCourse.length) {
          await CourseForTutorModel.deleteOne({ _id: trialCourse[0]._id })
        }
        break;
      default:
        // create or update course for turor and course with hourlyPerSession 1
        let halfTrialCouse = await CourseModel.findOne({
          country: 'trial', hourPerSession: hourlyPerSessionTrial,
        })
        if (halfTrialCouse) {

        } else {
          halfTrialCouse = await createTrialCourse({
            hourPerSession: hourlyPerSessionTrial,
            tenant: tenantId,
          });
        }
        if (trialCourse && trialCourse.length) {
          //update
          await CourseForTutorModel.update({
            _id: trialCourse[0]._id,
          }, {
              $set: {
                course: (halfTrialCouse as any)._id,
              }
            }).exec();
        } else {
          //create
          await CourseForTutorModel.create({
            tuitions: [],
            isDelete: false,
            course: (halfTrialCouse as any)._id,
            hourlyRate: 0,
            tutor: tutorId,
            tenant_id: tenantId,
          })
        }
    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
}

const updateUser = async (
  body: IUpdateUserInput
): Promise<void> => {
  try {
    const mainUser = await UsersModel.findOneAndUpdate(
      { $and: [{ _id: body._id }] },
      { $set: body },
      { new: true }
    ).exec();
    if (mainUser && mainUser.groupTuitionFakeUsers && mainUser.groupTuitionFakeUsers.length) {
      const deepCloneBody = JSON.parse(JSON.stringify(body));
      delete deepCloneBody._id;
      const promises = mainUser.groupTuitionFakeUsers.map((val) => {
        return UsersModel.findOneAndUpdate({ _id: val }, { $set: deepCloneBody }, { new: true });
      })
      await Promise.all(promises);

    }
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

/** update user in social login */
const updateSocialUser = async (
  tenantId: string,
  body: IUpdateUserInput
): Promise<any> => {
  try {
    const user = await UsersModel.findOneAndUpdate(
      {
        $and: [{ _id: body._id }, { tenant: tenantId }]
      },
      {
        $set: {
          roles: body.roles,
          firstName: body.firstName,
          lastName: body.lastName,
          fullName: [body.firstName, body.lastName].join(' '),
          normalizedFullname: [body.firstName, body.lastName].join(' ').toLocaleLowerCase(),
          email: body.email,
          phone: {
            phoneID: (body.phone as any).phoneID,
            phoneNumber: (body.phone as any).phoneNumber
          },
          isActive: true,
          emailConfirmed: true,
        }
      },
      { new: true }
    ).exec();

    return user;
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const verifyEmail = async (
  params: IActivateUser
) => {
  try {
    return await UsersModel.findOneAndUpdate(
      { $and: [{ _id: params.userId }] },
      { $set: { ...params, emailConfirmed: true, isActive: true } },
      { new: true }
    ).populate('tenant').exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

/** active user */
const activateUser = async (
  tenantId: string,
  params: IActivateUser
): Promise<void> => {
  try {
    await UsersModel.findOneAndUpdate(
      { $and: [{ _id: params.userId }, { tenant: tenantId }] },
      { $set: { ...params, isActive: true } },
      { new: true }
    ).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

/** active user */
const deactivateUser = async (
  params: IActivateUser
): Promise<void> => {
  try {
    await UsersModel.findOneAndUpdate(
      { _id: params.userId },
      { $set: { ...params, isActive: false } },
      { new: true }
    ).exec();
  } catch (error) {
    throw new Error(error.message || 'Internal server error.');
  }
};

const searchUsers = (
  tenant: string,
  query: any
): Promise<IFindUsersESResult> => {
  try {
    // return a Promise contains data from query ElasticSearch (ES)
    return new Promise((resolve, reject) => {
      let conditions: any[] = [];
      let shouldConditions: any[] = [];
      conditions.push({
        match_phrase: { "tenant": tenant }
      });

      // Create a criteria object for letious fields to put in elasticsearch's match query
      // Match query : like the AND operator, documents have to match all field in this 'match' object criteria
      for (let property in query.match) {
        if (property && query.match[property]) {
          let object = {};
          if (property !== 'search') {
            object[property] = query.match[property];
            conditions.push({ match_phrase: object });
          } else {
            // Why we use should condition here, is because we take a random input from user and try to search from all the field listed below.
            // If one field matched the search query, we return the data. Therefore we use should, think of it like OR operator.
            shouldConditions.push(
              {
                match_phrase: { "firstName": query.match[property] },
              },
              {
                match_phrase: { "lastName": query.match[property] },
              },
              {
                match_phrase: { "courseForTutor.course.subject": query.match[property] }
              },
              {
                match_phrase: { "courseForTutor.course.grade": query.match[property] }
              },
              {
                match_phrase: { "courseForTutor.course.country": query.match[property] }
              },
              {
                match_phrase: { "courseForTutor.groupTuition.course.country": query.match[property] }
              },
              {
                match_phrase: { "courseForTutor.groupTuition.course.subject": query.match[property] }
              },
              {
                match_phrase: { "courseForTutor.groupTuition.course.grade": query.match[property] }
              }
            );
          }
        }
      }

      // Create a criteria object for letious fields to put in elasticsearch's should query
      // This part is a little complicated. Because of the difference in data structure of user-with-individual-tuition and user-with-group-tuition,
      // when student filter, for example, every course that has country located in Vietnam, we have to query both individual-tuition and group-tuition,
      // This is why we use should condition here. The result should match the country field, individual OR group.
      // And why not push all the should conditions into shouldConditions array? 
      let shouldConditionsFromQuery: any[] = [];
      for (let property in query.should) {
        if (property && query.should[property]) {
          let object = {};
          object[property] = query.should[property];
          shouldConditionsFromQuery.push({ match_phrase: object });
        }
      }

      // These two below are to verify if the user is a tutor and if he (she) is teaching any course at the moment.
      conditions.push({ match: { roles: 'tutor' } });
      conditions.push({ exists: { field: 'courseForTutor' } });

      // Create range query
      // Range query is to query document that has some fields matched the criteria in a range. For example, search for course that has
      // min price is 10 SGD and max price is 30 SGD.
      if (query.range) {
        // Age of tutor
        if (query.range.maxAge && query.range.minAge) {
          conditions.push(
            {
              range: {
                age: {
                  gte: query.range.minAge,
                  lte: query.range.maxAge,
                  boost: 2
                }
              }
            }
          );
        }

        if (query.range.maxPrice > 0 && query.range.minPrice >= 0) {
          // Hourly rate, or course price
          // We use conditions here because both individual tuitions & group tuitions has the same data structure for hourlyRate field (inside courseForTutor)
          conditions.push(
            {
              range: {
                "courseForTutor.hourlyRate": {
                  gte: query.range.minPrice,
                  lte: query.range.maxPrice,
                  boost: 2
                }
              }
            }
          );
        }

        // // Tutor's years of experience
        // if (query.range.minYearsOfExp && query.range.maxYearsOfExp) {
        //   conditions.push({
        //     range: {
        //       "biography.yearsOfExp": {
        //         gte: query.range.minYearsOfExp,
        //         lte: query.range.maxYearsOfExp,
        //         boost: 2
        //       }
        //     }
        //   });
        // }

        // Tutor's rating
        if (query.range.minRating && query.range.maxRating) {
          conditions.push({
            range: {
              "rating": {
                gte: query.range.minRating,
                lte: query.range.maxRating,
                boost: 2
              }
            }
          });
        }
      }

      // Create sort options.
      // Sort options allow us to sort the results in different fields with different orders.
      let sortCondition = {};
      if (query.sort) {
        if (query.sort.sortBy !== 'courseForTutor.course.subject' && query.sort.sortBy !== 'courseForTutor.hourlyRate') {
          sortCondition[query.sort.sortBy] = {
            "order": query.sort.asc ? "asc" : "desc"
          };
        } else {
          if (query.sort.sortBy === 'courseForTutor.hourlyRate') {
            // mode "avg" means ES will calculate the average value of that array, and use it to compare and sort.
            sortCondition['esSortingHourlyRate'] = {
              "order": query.sort.asc ? "asc" : "desc",
              "mode": "avg"
            };
          } else {
            sortCondition['esSortingSubject.keyword'] = {
              "order": query.sort.asc ? "asc" : "desc",
            };
          }
        }
      }

      // Here we combine all the queries above
      const queries = !query.match.search ? {
        must: conditions,
        should: [
          // These two queries below is a little complicated. Their jobs is to filter all group tuitions which are active
          // or all individual tuitions. We don't want any outdated group tuitions in our results.
          {
            match: { "courseForTutor.groupTuition.isActive": true }
          },
          {
            bool: {
              must_not: [
                {
                  exists: {
                    field: "courseForTutor.isGroup"
                  }
                }
              ]
            }
          },
          ...shouldConditions,
          ...shouldConditionsFromQuery
        ],
        // The minimum_should_match field tells ES how many field in the should conditions should be matched. If not enough ES will not return that document.
        // This is why we have to use a temporary variable 'shouldConditionsFromQuery', to calculate the minimum_should_match.
        minimum_should_match: 1 + Math.floor(shouldConditionsFromQuery.length / 2)
      } : {
          must: conditions,
          should: [
            ...shouldConditions,
            ...shouldConditionsFromQuery,
            // These two queries below is a little complicated. Their jobs is to filter all group tuitions which are active
            // or all individual tuitions. We don't want any outdated group tuitions in our results.
            {
              match: { "courseForTutor.groupTuition.isActive": true }
            },
            {
              bool: {
                must_not: [
                  {
                    exists: {
                      field: "courseForTutor.isGroup"
                    }
                  }
                ]
              }
            }
          ],
          minimum_should_match: 2 + Math.floor(shouldConditionsFromQuery.length / 2)
        };

      // Raw query ES, supported by Mongoosastic
      UsersModel.esSearch(
        {
          from: query.pagination ? (Number(query.pagination.pageNumber - 1) * Number(query.pagination.pageSize)) : 0,
          size: Number(query.pagination ? query.pagination.pageSize : 10),
          query: {
            bool: queries
          },
          sort: [sortCondition]
        },
        {
          hydrate: false
        },
        function (err: any, results: any) {
          if (err) {
            console.log(err);
            reject(err.message || "Internal server error.");
          }
          resolve({
            result: results ? (results.hits ? results.hits.hits : []) : [],
            total: results ? (results.hits ? results.hits.total : 0) : 0,
          });
          resolve(results);
        }
      );
    });
  } catch (err) {
    throw new Error(err.message || "Internal server error.");
  }
};

const generateTestData = async (tenantId: string): Promise<void> => {
  try {
    await rawData.SAMPLE_COURSES.forEach(async (course, index) => {
      let newCourse = new CourseModel({ ...course, tenant_id: tenantId });
      await newCourse.save(async function (err, courseDoc) {
        if (err) {
          throw new Error(err);
        } else {
          let newTutor = new UsersModel({ ...rawData.SAMPLE_TUTORS[index], tenant: tenantId });
          await newTutor.save(async function (error, tutorDoc) {
            if (error) {
              throw new Error(error);
            } else {
              const body = {
                course: courseDoc._id.toString(),
                tutor: tutorDoc._id,
                hourlyRate: (index + 1) * 10,
                tenant_id: tenantId
              };

              await courseForTutorRepository.createCourseForTutor(body);

              let array = [0, 1, 2, 3];
              await array.forEach(async (val) => {
                let startDate = new Date();
                startDate.setDate(startDate.getDate() + val);
                startDate.setHours(0);

                let endDate = new Date();
                endDate.setDate(endDate.getDate() + val);
                endDate.setHours(14);

                const scheduleBody = {
                  start: startDate,
                  end: endDate,
                  title: rawData.SAMPLE_SCHEDULES[index].title,
                  type: "tutor",
                  owner: tutorDoc._id
                };

                await schedulesRepository.createNewSchedule(tenantId, scheduleBody as any);
              });
            }
          });
        }
      });
    });
  } catch (err) {
    throw new Error(err.message || "Internal server error.");
  }
};

const removeOldCurrencyAndTimeZoneFromUsers = async (): Promise<void> => {
  return await UsersModel.updateMany({}, { $unset: { currency: 1, timeZone: 1 } }).exec();
}

const updateRating = async (tenant: string, _id: string, rating: number): Promise<any> => {
  return await UsersModel.findOneAndUpdate({ _id: _id, tenant: tenant }, { $set: { rating: rating } }, { new: true });
}

const findRealUser = async (tenant: string, _id: string): Promise<any> => {
  return await UsersModel.findOne({ tenant: tenant, groupTuitionFakeUsers: _id }).select('_id').exec();
}

const countNewestRegisteredStudent = async (tenant: string): Promise<any> => {
  // Last 30 days
  return await UsersModel.find({ isActive: true, emailConfirmed: true, tenant: tenant, roles: 'student', createdAt: { $gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }).countDocuments().exec();
}


const countNewestRegisteredTutor = async (tenant: string): Promise<any> => {
  // Last 30 days
  return await UsersModel.find({ isActive: true, emailConfirmed: true, tenant: tenant, roles: 'tutor', forGroupTuitionElastic: { $ne: true }, createdAt: { $gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }).countDocuments().exec();
}

const findTenantAdmin = async (tenant: string): Promise<any> => {
  return await UsersModel.find({ tenant: tenant, isActive: true, roles: 'admin', forGroupTuitionElastic: { $ne: true } }).select('_id').exec();
}

const findTenantAdminAndSys = async (tenant: string): Promise<any> => {
  return await UsersModel.find({ tenant: tenant, isActive: true, roles: {$in : ['admin', 'sysadmin']}, forGroupTuitionElastic: { $ne: true } }).select('_id email fullName').exec();
}

const findDistributors = async (): Promise<any> => {
  const data = await UsersModel.find({ roles: 'franchise' }).select('_id fullName email roles distributorInfo createdAt phone isActive').exec();
  return data;
}

const findAllUsers = async (tenant: string): Promise<any> => {
  return await UsersModel.find({ tenant: tenant }).select('_id fullName email roles distributorInfo phone isActive lang createdAt').exec();
}

const findAllPaymentsOfDistributor = async (_id: string): Promise<any> => {
  const user = await UsersModel.findById(_id).exec();
  if (!user) throw new Error('Cannot find distributor');
  if (user.roles[0] !== 'franchise') return [];
  else {
    const startCountingDate = new Date(user.createdAt);
    const dayInMonth = user.distributorInfo.dayInMonth;
    if (dayInMonth) {
      startCountingDate.setDate(dayInMonth);
    }
    const end = new Date();
    const sysadminTenant = await TenantsModel.findOne({ name: 'admin' }).exec();
    if (!sysadminTenant) throw new Error('Cannot find sysadmin configuration!');
    const commissionFee = sysadminTenant.commissionFee && sysadminTenant.commissionFee.firstPayment !== undefined ?
      sysadminTenant.commissionFee.firstPayment : config.sysadmin.defaultCommissionFee;
    const fixedAmount = user.distributorInfo ? user.distributorInfo.fixedAmount !== undefined ? user.distributorInfo.fixedAmount : 0 : 0;
    const monthsBetween = end.getMonth() - startCountingDate.getMonth()
      + (12 * (end.getFullYear() - startCountingDate.getFullYear()));
    const initialArray = Array.apply(null, { length: monthsBetween } as any).map(Number.call, Number);
    const dateArray = initialArray.map((_val, index) => {
      let initialStart = new Date(startCountingDate);
      let initialEnd = new Date(startCountingDate);
      initialStart.setMonth(initialStart.getMonth() + index);
      initialEnd.setMonth(initialEnd.getMonth() + index + 1);
      return {
        startDate: initialStart,
        endDate: initialEnd
      }
    })
    const promises = dateArray.map((_val: any) => {
      return TenantsModel.find({
        adminCreated: _id, assignDistributorTime: {
          $gte: startCountingDate,
        }
      }).select('paymentInfo').exec();
    })
    const partners = await Promise.all(promises);
    const dataWithParnersAndDates = partners.map((val: any, index) => {
      return {
        partners: val,
        start: dateArray[index].startDate,
        end: dateArray[index].endDate
      }
    });
    const data = dataWithParnersAndDates.map((val) => {
      const total = val.partners.reduce((sum, v) => {
        if (v.paymentInfo && v.paymentInfo.fixedAmount) {
          return sum += Number(v.paymentInfo.fixedAmount);
        } else {
          return sum;
        }
      }, 0);
      return {
        totalIncome: total,
        fixedAmount: fixedAmount,
        commissionFee: commissionFee,
        total: (Number(fixedAmount) + Number(commissionFee) * Number(total) / 100),
        start: val.start,
        end: val.end
      }
    })
    return data;
  }
}

const updateDistributorPaycheck = async (_id: string, date: string): Promise<void> => {
  const record = await UsersModel.findById(_id).select('distributorPaycheck').exec();
  if (!record) throw new Error('Cannot find record');
  if (record.distributorPaycheck.indexOf(date) >= 0) {
    await UsersModel.updateOne({ _id: _id }, { $pull: { distributorPaycheck: date } }).exec();
  } else {
    await UsersModel.updateOne({ _id: _id }, { $push: { distributorPaycheck: date } }).exec();
  }
}

const getDistributorPaycheck = async (_id: string): Promise<any> => {
  const record = await UsersModel.findById(_id).select('distributorPaycheck').exec();
  if (!record) throw new Error('Cannot find record');
  return record.distributorPaycheck || [];
}

export {
  findUserByEmail,
  findUserById,
  findUsers,
  createNewUser,
  updateUser,
  activateUser,
  deactivateUser,
  updateSocialUser,
  verifyEmail,
  findTutorById,
  searchUsers,
  findStudentById,
  generateTestData,
  findUserForLogin,
  removeOldCurrencyAndTimeZoneFromUsers,
  findUserBySocialCredential,
  createUserBySocialCredential,
  updateRating,
  findRealUser,
  findUserWithPasswordById,
  countNewestRegisteredStudent,
  countNewestRegisteredTutor,
  findTenantAdmin,
  findUserForImpersonate,
  findFranchises,
  getAllFranchiseName,
  findDistributors,
  findAllUsers,
  findAllPaymentsOfDistributor,
  updateDistributorPaycheck,
  getDistributorPaycheck,
  findTenantAdminAndSys,
  enableFunctionOfTrialButton,
};
