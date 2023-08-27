using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace NET_Apex_Stats.Server.Models
{
    public class BattleRoyale
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string season { get; set; } = null!;

        public int games { get; set; }

        public int wins { get; set; }

        public int kills { get; set; }

        public int deaths { get; set; }

        public int damage { get; set; }

        public int highestDamage { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string? userId { get; set; }
    }
}
