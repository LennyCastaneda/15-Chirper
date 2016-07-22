using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Chirper.API.Models
{
    public class Comment
    {
        //Primary key
        public int CommentId { get; set; }

        //Foreign Key
        public int ChirpId { get; set; }
        public string UserId { get; set; }

        //Comment fields
        public string Text { get; set; }
        public DateTime CreatedDate { get; set; }
        public int LikedCount { get; set; }

        //Entity relationships
        public virtual Chirp Chirp { get; set; }
        public virtual ChirperUser User { get; set; }
    }
}