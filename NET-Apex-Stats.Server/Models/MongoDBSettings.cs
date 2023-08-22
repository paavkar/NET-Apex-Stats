namespace NET_Apex_Stats.Server.Models
{
    public class MongoDBSettings
    {
        public string ConnectionURI { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string BattleRoyaleCollection { get; set; } = null!;
        public string UserCollection { get; set; } = null!;
    }
}
