using NET_Apex_Stats.Server.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace NET_Apex_Stats.Services
{
    public class MongoDBService
    {
        private readonly IMongoCollection<User> _userCollection;
        private readonly IMongoCollection<BattleRoyale> _battleRoyaleCollection;

        public MongoDBService(IOptions<MongoDBSettings> mongoDBSettings)
        {
            MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
            IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
            _battleRoyaleCollection = database.GetCollection<BattleRoyale>(mongoDBSettings.Value.BattleRoyaleCollection);
            _userCollection = database.GetCollection<User>(mongoDBSettings.Value.UserCollection);
        }

        public async Task CreateAsync(BattleRoyale battleRoyale)
        {
            await _battleRoyaleCollection.InsertOneAsync(battleRoyale);
            return;
        }

        public async Task CreateUserAsync(User user)
        {
            await _userCollection.InsertOneAsync(user);
            return;
        }


        public async Task<User> GetUserAsync(string username)
        {
            FilterDefinition<User> filter = Builders<User>.Filter.Eq("Username", username);
            var user = _userCollection.Find(filter);
            var user2 = await user.SingleOrDefaultAsync();
            return user2;
        }

        public async Task<List<BattleRoyale>> GetAsync(string userId)
        {
            FilterDefinition<BattleRoyale> filter = Builders<BattleRoyale>.Filter.Eq("userId", userId);
            return await _battleRoyaleCollection.Find(filter).ToListAsync();
        }


        public async Task DeleteAsync(string id, string userId)
        {
            FilterDefinition<BattleRoyale> filter = Builders<BattleRoyale>.Filter.Eq("Id", id);
            var findEntry = _battleRoyaleCollection.Find(filter);
            var entryToDelete = findEntry.First();
            if (entryToDelete != null && entryToDelete.userId == userId)
            {
                await _battleRoyaleCollection.DeleteOneAsync(filter);
                
                return;
            }
            return;
        }

        public async Task UpdateUserAsync(User user)
        {
            FilterDefinition<User> filter = Builders<User>.Filter.Eq("Id", user.Id);
            await _userCollection.FindOneAndReplaceAsync(filter, user);
            return;
        }

        public async Task<User> GetUserFromIdAsync(string userId)
        {
            FilterDefinition<User> filter = Builders<User>.Filter.Eq("Id", userId);
            var user = _userCollection.Find(filter);
            var found_user = await user.SingleOrDefaultAsync();
            return found_user;
        }
    }
}
