using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using SSLE.Auth.Api.Models;
using SSLE.Auth.Common.Constants;
using SSLE.Auth.Services.Contract;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using CO = SSLE.Auth.Api.Models;
using SO = SSLE.Auth.Services.Models;
using Newtonsoft.Json.Linq;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Azure.Cosmos.Serialization.HybridRow;

namespace SSLE.Auth.Api.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly ILogger logger;        
        private readonly IUserService userService;
        private readonly IConfiguration configuration;       
        private readonly IMapper mapper;


        public AccountController(ILogger<AccountController> logger, 
            IUserService userService, 
            IMapper mapper, IConfiguration configuration)
        {
            this.userService = userService;
            this.mapper = mapper;
            this.configuration = configuration;
            this.logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> Token([FromBody] LoginModel model)
        {
            if (model == null
                || string.IsNullOrWhiteSpace(model.Username)
                || string.IsNullOrWhiteSpace(model.Password))
            {
                return BadRequest("Invalid Input");
            }

            var result = await userService.SignInAsync(model.Username, model.Password);
            if (result != null)
            {
                var token = GenerateJwt(model.Username);

                return Ok(new
                {
                    token = token,
                    userId = result.Id,
                    roles = result.Roles
                });
            }
            return Unauthorized();
        }

        [HttpPost]
        public async Task<bool> Register([FromBody] UserModel model)
        {
            var mappedModel = mapper.Map<UserModel, SO.UserModel>(model);
            var result = await this.userService.Register(mappedModel, false);
            return result;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost]
        public async Task<IActionResult> UpdateUserRoles([FromBody] UpdateRole model)
        {
            if (model== null || model.Id <= 0 || model.Roles == null)
            {
                return BadRequest("Invalid Input");
            }
            var result = await this.userService.UpdateRoles(model.Id,model.Roles);
            if (!result)
                return BadRequest("Invalid Input");

            return Ok(new
            {               
                userId = model.Id,
                roles = model.Roles
            });
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost]
        public async Task<IActionResult> ValidateToken([FromBody] JwtTokenModel model) 
        {
            if (model== null || string.IsNullOrEmpty(model.Token))
            {
                return BadRequest("Invalid Input");
            }
            var jwt = new JwtSecurityTokenHandler().ReadJwtToken(model.Token);
            string email = jwt.Claims.First(c => c.Type == "sub").Value;

            var user = await  userService.GetUserInfo(email);

            var result = mapper.Map<SO.UserModel, UserModel>(user);
            return Ok(result);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await userService.GetUsers();
            var result = mapper.Map<List<SO.UserModel>, List<UserInfoModel>>(users);
            return Ok(result);   
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost]
        public async Task<IActionResult> GetUserById([FromBody] UserRequestModel model)
        {
            if (model.UserId <= 0)  
            {
                return BadRequest("Invalid Input");
            }

            var user = await userService.GetUserById(model.UserId);
            var result  = mapper.Map<SO.UserModel, UserModel>(user);
            return Ok(result);
        }
        private string GenerateJwt(string email)
        {

            var claims = new[]
            {
                          new Claim(JwtRegisteredClaimNames.Sub,email),
                          new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtToken:SecurityKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
              configuration["JwtToken:Issuer"],
              configuration["JwtToken:Audience"],
              claims,
              expires: DateTime.UtcNow.AddHours(SystemConstants.JwtLifetime),
              signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

    }
}