// tslint:disable
import * as mongoose from 'mongoose';
import config from '../api/config';
import { UsersSchema } from '../api/modules/auth/users/mongoose';
import { TenantsSchema } from '../api/modules/auth/tenants/mongoose';
import users from './user';
import roles from './role';
import roles_users from './role_users__user_roles';
import * as bcrypt from 'bcryptjs';


mongoose.connect(config.database.mongoConnectionString, { useNewUrlParser: true }, async (err) => {
  if (err) {
    console.log(err);
  }

  const UsersModel = mongoose.model('User', UsersSchema);
  await UsersModel.deleteMany({isImported: true});
  const TenantsModel = mongoose.model('Tenant', TenantsSchema);
  const adminTenant = await TenantsModel.findOne({name: 'admin'}).exec() as any;
  const promises = users.map((user: any) => {
    var json = JSON.parse(JSON.stringify(user));
    var role_user = roles_users.filter((r_u) => {
      return r_u.user_roles && r_u.user_roles.$oid === json._id.$oid; 
    });
    var role = 'tutor';
    if (role_user && role_user.length) {
      const filteredRole = roles.filter((rol) => {
        return rol._id && rol._id.$oid === role_user[0].role_users.$oid;
      })
      if (filteredRole && filteredRole.length) {
        role = filteredRole[0].name;
      }
    } 
    if (role === 'manager' || role === 'admin' || role === 'sgadmin') {
      role = "admin";
    } else if (role === 'sgsuperadmin') {
      role = "sysadmin";
    }
    const createData = {
      firstName: json.first_name,
      lastName: json.last_name,
      fullName: (json.first_name || json.last_name) ? json.first_name + " " + json.last_name : json.username,
      email: json.email,
      emailConfirmed: true,
      firstTimeLoggedIn: true,
      isImported: true,
      isActive: true,
      tenant: adminTenant._id,
      roles: [role],
      password: bcrypt.hashSync('skyace123', 10)
    };
    const newUser = new UsersModel(createData);
    return newUser.save();
  })

  await Promise.all(promises);

  process.exit();
})
