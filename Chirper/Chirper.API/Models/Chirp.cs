using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Chirper.API.Models
{
    public class Chirp
    {
        //Primary key
        public int ChirpId { get; set; }

        //Foreign Key
        public string UserId { get; set; }

        //Chirp fields
        public string Text { get; set; }
        public DateTime CreatedDate { get; set; }
        public int LikedCount { get; set; }

        //Entity relationships
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual ChirperUser User { get; set; }
        public virtual ICollection<Like> Likes { get; set; }

    }
}