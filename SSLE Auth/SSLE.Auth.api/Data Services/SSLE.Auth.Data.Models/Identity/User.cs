using SSLE.Auth.Data.Contract;
using Microsoft.AspNetCore.Identity;

namespace SSLE.Auth.Data.Models.Identity
{
    public class User : IdentityUser<int>, IEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ProfileImage { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsActivated { get; set; }       
        
        
    }
}