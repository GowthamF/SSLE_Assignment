namespace SSLE.Auth.Services.Contract
{
    using SO = SSLE.Auth.Services.Models;

    public interface IUserService
    {        
        Task<SO.UserModel> SignInAsync(string userName, string password);
        Task<bool> Register(SO.UserModel user, bool isAdmin = false);

        Task<bool> UpdateRoles(int id, List<string> roles);

        Task<SO.UserModel> GetUserInfo(string email);

        Task<SO.UserModel> GetUserById(int id);

        Task<List<SO.UserModel>> GetUsers();

    }
}