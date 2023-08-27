using Amazon.Runtime.Internal;
using Microsoft.AspNetCore.Mvc;
using NET_Apex_Stats.Server.Models;
using NET_Apex_Stats.Services;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NET_Apex_Stats.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly MongoDBService _mongoDBService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserController(MongoDBService mongoDBService, IHttpContextAccessor httpContextAccessor)
        {
            _mongoDBService = mongoDBService;
            _httpContextAccessor = httpContextAccessor;
        }

        // GET: api/<UserController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpGet("{id}")]
        [Route("profile/{id}")]
        public async Task<ActionResult<object>> Get(string id)
        {
            string userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Sid);
            
            //if (userId == null)
            //{
            //    return Unauthorized("Missing or invalid access token");
            //}

            User? user = null;
            user = await _mongoDBService.GetUserFromIdAsync(id);

            if (user == null)
            {
                return NotFound("No user found with given id");
            }
            return Ok(user);
        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<object>> Put(string id, UpdatePassword request)
        {
            string currentPassword = request.CurrentPassword;
            string newPassword = request.NewPassword;

            string userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Sid);

            User? user = null;
            user = await _mongoDBService.GetUserFromIdAsync(id);

            if(user != null)
            {
                if (user.Id != userId)
                {
                    return Forbid("Current user not allowed to change this user's password");
                }

                if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
                {
                    return Unauthorized("Incorrect current password");
                }

                int saltRounds = 10;

                string passwordHash = BCrypt.Net.BCrypt.HashPassword(newPassword, saltRounds);

                if(user.PasswordHash == passwordHash)
                {
                    return BadRequest("New password cannot be the same as old one");
                }

                user.PasswordHash = passwordHash;

                await _mongoDBService.UpdateUserAsync(user);

                return Ok(user);
            }
            return Unauthorized("no user found");
        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
