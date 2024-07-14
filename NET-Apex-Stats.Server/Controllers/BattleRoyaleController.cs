using Microsoft.AspNetCore.Mvc;
using NET_Apex_Stats.Server.Models;
using NET_Apex_Stats.Services;
using System.Security.Claims;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NET_Apex_Stats.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BattleRoyaleController : ControllerBase
    {
        private readonly MongoDBService _mongoDBService;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BattleRoyaleController(MongoDBService mongoDBService, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _mongoDBService = mongoDBService;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        // GET: api/<BattleRoyaleController>
        [HttpGet]
        public async Task<List<BattleRoyale>> Get()
        {
            string userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Sid);
            return await _mongoDBService.GetAllAsync(userId);
        }

        // GET api/<BattleRoyaleController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var entry = await _mongoDBService.GetAsync(id);

            if (entry is null)
            {
                return NotFound("No entry found with given Id.");
            }
            return Ok(entry);
        }

        // POST api/<BattleRoyaleController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] BattleRoyale battleRoyale)
        {
            try
            {
                string userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Sid);
                battleRoyale.userId = userId;
                await _mongoDBService.CreateAsync(battleRoyale);
                return CreatedAtAction(nameof(Get), battleRoyale);
            }
            catch
            {
                return Unauthorized("Invalid or missing token");
            }
        }

        // PUT api/<BattleRoyaleController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] BattleRoyale entry)
        {
            try
            {
                string userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Sid);
                var updatedEntry = await _mongoDBService.UpdateBattleRoyaleAsync(entry, userId);

                if (updatedEntry is null) return NotFound("No entry found with given Id.");
                return Ok(updatedEntry);
            }
            catch
            {
                return Unauthorized("Invalid or missing token");
            }
        }

        // DELETE api/<BattleRoyaleController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                string userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Sid);
                await _mongoDBService.DeleteAsync(id, userId);
                return NoContent();
            }
            catch
            {
                return Unauthorized("Invalid or missing token");
            }
        }
    }
}
