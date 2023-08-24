using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NET_Apex_Stats.Server.Models;
using NET_Apex_Stats.Services;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace NET_Apex_Stats.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly MongoDBService _mongoDBService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AuthController(IConfiguration configuration, MongoDBService mongoDBService, IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _mongoDBService = mongoDBService;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(UserDto request)
        {
            string username = request.Username;
            string password = request.Password;

            User? existingUser = null;
            existingUser = await _mongoDBService.GetUserAsync(username);

            if(existingUser != null)
            {
                return BadRequest("Username must be unique");
            }

            if(username.Length < 3 || username.Length > 30)
            {
                return BadRequest("Username has to be between 3 and 30 characters long");
            }

            if(password.Length < 8)
            {
                return BadRequest("Password has to be at least 8 characters long");
            }

            int saltRounds = 10;

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(password, saltRounds);

            var user = new User(
                username,
                passwordHash
            );

            await _mongoDBService.CreateUserAsync(user);
            
            return Ok(user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<object>> Login(UserDto request)
        {
            var username = request.Username;
            var password = request.Password;

            User? user = null;
            user = await _mongoDBService.GetUserAsync(username);

            if (user != null)
            {
                if (user.Username != request.Username || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                {
                    return Unauthorized("invalid username or password");
                }
                string token = CreateToken(user);

                var refreshToken = GenerateRefreshToken();
                SetRefreshToken(refreshToken, user);

                return Ok(new { token, user });
            }
            return Unauthorized("invalid username or password");
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<object>> RefreshToken()
        {
            if(_httpContextAccessor.HttpContext == null)
            {
                return BadRequest();
            }
            string refreshToken = Request.Cookies["refreshToken"];
            string userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Sid);
            
            User? user = null;
            user = await _mongoDBService.GetUserFromIdAsync(userId);

            if (!user.RefreshToken.Equals(refreshToken))
            {
                return Unauthorized("Invalid Refresh Token");
            }
            else if (user.TokenExpires < DateTime.Now)
            {
                return Unauthorized("Token expired");
            }

            string token = CreateToken(user);
            var newRefreshToken = GenerateRefreshToken();
            SetRefreshToken(newRefreshToken, user);

            return Ok(new { user, token });
        }


        private RefreshToken GenerateRefreshToken()
        {
            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expires = DateTime.Now.AddDays(7)
            };

            return refreshToken;
        }


        private async void SetRefreshToken(RefreshToken newRefreshToken, User user)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = newRefreshToken.Expires,
            };
            Response.Cookies.Append("refreshToken", newRefreshToken.Token, cookieOptions);

            user.RefreshToken = newRefreshToken.Token;
            user.TokenCreated = newRefreshToken.Created;
            user.TokenExpires = newRefreshToken.Expires;

            await _mongoDBService.UpdateUserAsync(user);
        }


        private string CreateToken(User user)
        {
            List<Claim> claims = new()
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Sid, user.Id)
            };

            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
    }
}
