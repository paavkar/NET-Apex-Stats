using Microsoft.Extensions.Options;
using MongoDB.Driver;
using NET_Apex_Stats.Server.Models;

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

        public async Task<List<BattleRoyale>> GetAllAsync(string userId)
        {
            FilterDefinition<BattleRoyale> filter = Builders<BattleRoyale>.Filter.Eq("userId", userId);
            return await _battleRoyaleCollection.Find(filter).ToListAsync();
        }

        public async Task<BattleRoyale> GetAsync(string id)
        {
            FilterDefinition<BattleRoyale> filter = Builders<BattleRoyale>.Filter.Eq("Id", id);
            return _battleRoyaleCollection.Find(filter).First();
        }

        public async Task<BattleRoyale> UpdateBattleRoyaleAsync(BattleRoyale entity, string userId)
        {
            FilterDefinition<BattleRoyale> filter = Builders<BattleRoyale>.Filter.Eq("Id", entity.Id);
            var foundEntry = _battleRoyaleCollection.Find(filter).First();
            if (foundEntry != null && foundEntry.userId == userId)
            {
                var updatedEntry = await _battleRoyaleCollection.FindOneAndReplaceAsync(filter, entity);
                return updatedEntry;
            }
            return null;
        }

        public async Task DeleteAsync(string id, string userId)
        {
            FilterDefinition<BattleRoyale> filter = Builders<BattleRoyale>.Filter.Eq("Id", id);
            var foundEntry = _battleRoyaleCollection.Find(filter);
            var entryToDelete = foundEntry.First();
            if (entryToDelete != null && entryToDelete.userId == userId)
            {
                var result = await _battleRoyaleCollection.DeleteOneAsync(filter);

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
