namespace SSLE.Auth.Services
{
    using SSLE.Auth.Common.Constants;
    using SSLE.Auth.Repository.Contract;
    using SSLE.Auth.Services.Contract;
    using SO = SSLE.Auth.Services.Models;

    public class UserService : IUserService
    {
        private readonly IUserRepository userRepository;
        

        public UserService(IUserRepository userRepository)
        {
            this.userRepository = userRepository;           
        }

        public async Task<bool> Register(SO.UserModel user, bool isAdmin = false)
        {
            if (user == null)
            {
                return false;
            }
            
            var result = await this.userRepository.Register(user, isAdmin);
            return result != null;
        }
        public async Task<SO.UserModel> SignInAsync(string userName, string password)
        {
            if (userName == null || password == null) return null;            

            var result = await this.userRepository.SignInAsync(userName, password);
            return result;
        }  
        private async Task<bool> CreateUser(SO.UserModel user)
        {
            return await userRepository.CreateUser(user);
        }

        public async Task<bool> UpdateRoles(int id,List<string> roles)
        {
            if (id <= 0 || roles == null)
            {
                return false;
            }

            var result = await this.userRepository.UpdateRole(id,roles);
            return result != null;
        }

        public async Task<SO.UserModel> GetUserInfo(string email)
        {
            if (string.IsNullOrEmpty(email)) return null;
            
            var result = await this.userRepository.GetUserInfo(email);
            return result;
        }

        public async Task<SO.UserModel> GetUserById(int id)
        {
            if (id <= 0) return null;

            var result = await this.userRepository.GetUserByUserId(id);
            return result;
        }

        public async Task<List<SO.UserModel>> GetUsers()
        {
            var result = await this.userRepository.GetUsers();
            return result;
        }
    }
}