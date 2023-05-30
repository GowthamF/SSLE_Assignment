namespace SSLE.Auth.Services.Models
{
    public class UserModel
    {
        public int Id { get; set; }
        public string Email { get; set; }
         public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ProfileImage { get; set; }
        public string PhoneNumber { get; set; }
        public List<string> Roles { get; set; }

    }
}