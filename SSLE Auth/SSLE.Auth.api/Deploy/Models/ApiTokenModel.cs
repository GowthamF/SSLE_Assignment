using System.ComponentModel.DataAnnotations;

namespace SSLE.Auth.Api.Models
{
    public class ApiTokenModel
    {
        [Required]
        public string Token { get; set; }

        [Required]
        public string RefreshToken { get; set; }
    }
}
