import UsersModel from '../modules/auth/users/mongoose';

const synchronizeUsers = async (criteria: any): Promise<any> => {
    try {
        UsersModel.find(criteria)
        .then((results) => {
          if (results) {
            results.forEach((result) => {
              result.save();
            });
          } else {
            return;
          }
        });
    } catch (err) {
        throw new Error(err);
    }
};

export {
    synchronizeUsers
};