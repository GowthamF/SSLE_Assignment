using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Role_Resource_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRolesController : ControllerBase
    {
        private readonly DatabaseContext _databaseContext;

        public UserRolesController(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }


        [HttpPost("InsertUserRole")]
        public async Task<IActionResult> InsertUserRole(UserRole userRole)
        {
            _databaseContext.UserRoles.Add(userRole);
            await _databaseContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("VerifyUserRole")]
        public async Task<IActionResult> VerifyUserRole(UserRole userRole)
        {
            var isRoleIncluded = await _databaseContext.UserRoles.AnyAsync(x=>x.UserId == userRole.UserId && x.Role == userRole.Role);

            if(isRoleIncluded)
            {
                return Ok();
            }


            return Unauthorized();
        }
    }
}
