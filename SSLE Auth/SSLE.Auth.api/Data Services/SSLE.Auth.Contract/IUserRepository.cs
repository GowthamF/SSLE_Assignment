using SSLE.Auth.Services.Models;
using SO = SSLE.Auth.Services.Models;

namespace SSLE.Auth.Repository.Contract
{
    public interface IUserRepository
    {
        Task<SO.UserModel> GetUserByEmail(string email);

        Task<SO.UserModel> GetUserByUserId(int userId);       

        Task<bool> CreateUser(SO.UserModel user);
        
        Task<UserModel?> SignInAsync(string userName, string password);
        Task<SO.UserModel> Register(SO.UserModel user, bool isAdmin = false);

        Task<bool> UpdateRole(int id, List<string> roles);

        Task<SO.UserModel> GetUserInfo(string email);

        Task<List<SO.UserModel>> GetUsers();

        Task<SO.UserModel> Getuser(int id);
    }
}