namespace SSLE.Auth.Services.Models
{
    public class UserProfileInfoModel
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public UserModel User { get; set; }       
    }
}