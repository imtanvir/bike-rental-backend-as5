import config from "../config";
import { USER_ROLE } from "../modules/user/user.constant";
import { UserModel } from "../modules/user/user.model";

const superUser = {
  name: "Apollo",
  email: "apollo_sadmin@mail.com",
  password: config.super_admin_password,
  phone: "01752661670",
  address: "Dinajpur, Bangladesh",
  role: USER_ROLE.superAdmin,
};

const superAdmin = async () => {
  const isSuperAdminExits = await UserModel.findOne({
    role: USER_ROLE.superAdmin,
  });

  if (!isSuperAdminExits) {
    await UserModel.create(superUser);
  }
};

export default superAdmin;
