namespace SSLE.Auth.Repository
{
    using AutoMapper;
    using SSLE.Auth.Common.Constants;
    using SSLE.Auth.Data.Contract;
    using SSLE.Auth.Data.Models.Identity;
    using SSLE.Auth.Repository.Contract;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using IO = SSLE.Auth.Data.Models.Identity;
    using SO = SSLE.Auth.Services.Models;
    using SSLE.Auth.Services.Models;
    using Microsoft.Azure.Cosmos;

    public class UserRepository : IUserRepository
    {
        private readonly UserManager<IO.User> userManager;
        private readonly SignInManager<IO.User> signInManager;
        private readonly RoleManager<IO.Role> roleManager;
        private readonly IStorageContext context;
        private readonly IMapper _mapper;

        public UserRepository(UserManager<IO.User> userManager,
            IMapper mapper,
            SignInManager<IO.User> signInManager,
            RoleManager<IO.Role> roleManager,
            IStorageContext context)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.roleManager = roleManager;
            this._mapper = mapper;
        }

        public async Task<SO.UserModel> GetUserByEmail(string email)
        {
            IO.User user = await userManager.FindByEmailAsync(email);
            var userRoles = await userManager.GetRolesAsync(user);

            var result = _mapper.Map<IO.User, SO.UserModel>(user);
            if (userRoles.Any())
            {
                result.Roles = userRoles.ToList();
            }

            return result;
        }

        public async Task<SO.UserModel> GetUserByUserId(int userId)
        {
            IO.User user = await userManager.FindByIdAsync(userId.ToString());
            var userRoles = await userManager.GetRolesAsync(user);

            var result = _mapper.Map<IO.User, SO.UserModel>(user);
            if (userRoles.Any())
            {
                result.Roles = userRoles.ToList();
            }

            return result;
        }

        public async Task<bool> CreateUser(SO.UserModel user)
        {
            IO.User userModel = _mapper.Map<SO.UserModel, IO.User>(user);

            userModel.UserName = userModel.Email;
            userModel.EmailConfirmed = true;
            userModel.IsActivated = true;
            userModel.PhoneNumber = string.Empty;
            userModel.PhoneNumberConfirmed = false;
            userModel.TwoFactorEnabled = false;
            userModel.CreatedDate = DateTime.Now;

            IdentityResult result = await userManager.CreateAsync(userModel); //"Abcd@1234#"

            if (result.Succeeded)
            {
                return true;
            }

            return false;
        }

        public async Task<UserModel?> SignInAsync(string userName, string password)
        {
            if (userName == null || password == null)
            {
                return null;
            }
            var formattedusername = userName.Trim().ToUpper();
            var user = await this.userManager.FindByNameAsync(formattedusername);
            if (user == null)
            {
                return null;
            }

            var isUserSignIn = await this.signInManager.CanSignInAsync(user);
            if (!isUserSignIn) return null;

            await signInManager.PasswordSignInAsync(user, password, false, false);
            var roles = await userManager.GetRolesAsync(user);
            var result = new UserModel { Id = user.Id, FirstName = user.FirstName, LastName = user.LastName, Roles = roles.ToList() };
            return result;
        }

        public async Task<SO.UserModel> Register(SO.UserModel user, bool isAdmin = false)
        {
            try
            {
                var requestRoles = user.Roles;

                if (!await roleManager.RoleExistsAsync(SystemConstants.AdminRole))
                    await roleManager.CreateAsync(new Role(SystemConstants.AdminRole));
                if (!await roleManager.RoleExistsAsync(SystemConstants.UserRole))
                    await roleManager.CreateAsync(new Role(SystemConstants.UserRole));
                if (!await roleManager.RoleExistsAsync(SystemConstants.SuperAdminRole))
                    await roleManager.CreateAsync(new Role(SystemConstants.SuperAdminRole));

                var doUser = new IO.User { FirstName = user.FirstName, LastName = user.LastName, Email = user.Email, UserName = user.Email, EmailConfirmed = true, PhoneNumber = user.PhoneNumber, IsActivated = true, ProfileImage = "profile.png" };
                var result = await userManager.CreateAsync(doUser);
                if (result.Succeeded)
                {
                    var newUser = this.userManager.Users.First(x => x.Email == user.Email);


                    foreach (var item in requestRoles)
                    {
                        if (item == SystemConstants.AdminRole)
                        {
                            await userManager.AddToRoleAsync(newUser, SystemConstants.AdminRole);

                        }
                        if (item == SystemConstants.SuperAdminRole)
                        {
                            await userManager.AddToRoleAsync(newUser, SystemConstants.SuperAdminRole);
                        }

                        if (item == SystemConstants.UserRole)
                        {
                            await userManager.AddToRoleAsync(newUser, SystemConstants.UserRole);
                        }
                    }

                    await this.userManager.AddPasswordAsync(newUser, user.Password);
                    await this.signInManager.PasswordSignInAsync(newUser, user.Password, false, false);
                    return user;
                }

            }
            catch (Exception ex)
            {

                var x = ex.ToString();
            }
            return null;
        }


        public async Task<bool> UpdateRole(int id, List<string> roles)
        {
            if (id <= 0 || roles == null) return false;

            var user = await userManager.FindByIdAsync(id.ToString());
            var currentRoles = await userManager.GetRolesAsync(user);

            var removeAction = await userManager.RemoveFromRolesAsync(user, currentRoles);
            if (removeAction == null || !removeAction.Succeeded) return false;

            var addAction = await userManager.AddToRolesAsync(user, roles);

            if (addAction == null || !addAction.Succeeded) return false;
            return addAction.Succeeded;
        }

        public async Task<SO.UserModel> GetUserInfo(string email)
        {
            if (string.IsNullOrEmpty(email)) return null;

            IO.User user = await userManager.FindByEmailAsync(email);
            if (user == null) return null;

            var userRoles = await userManager.GetRolesAsync(user);

            var result = _mapper.Map<IO.User, SO.UserModel>(user);
            if (userRoles.Any())
            {
                result.Roles = userRoles.ToList();
            }
           
            return result;
        }

        public async Task<List<SO.UserModel>> GetUsers()
        {
            var users = await this.userManager.Users.ToListAsync();
            return _mapper.Map<List<IO.User>, List<SO.UserModel>>(users);
        }
        public async Task<SO.UserModel> Getuser(int id) 
        {
            if (id <= 0) return null;
           
            var users = await this.userManager.FindByIdAsync(id.ToString());
            return _mapper.Map<IO.User, SO.UserModel>(users);
        }
    }
}