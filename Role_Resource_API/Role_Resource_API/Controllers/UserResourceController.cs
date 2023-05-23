using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Role_Resource_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserResourceController : ControllerBase
    {
        private readonly DatabaseContext _databaseContext;

        public UserResourceController(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }


        [HttpPost("InsertUserResource")]
        public async Task<IActionResult> InsertUserResource(UserResource userResource)
        {
            _databaseContext.UserResources.Add(userResource);
            await _databaseContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("VerifyUserResource")]
        public async Task<IActionResult> VerifyUserResource(UserResource userResource)
        {
            var isResourceIncluded = await _databaseContext.UserRoles.AnyAsync(x => x.UserId == userResource.UserId && x.Role == userResource.ResourceName);

            if (isResourceIncluded)
            {
                return Ok();
            }


            return Unauthorized();
        }
    }
}
