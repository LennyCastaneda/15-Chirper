using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Chirper.API.Models
{
    public class Like
    {
        //Primary key
        public int LikeId { get; set; }

        //Foreign Key
        public int ChirpId { get; set; }
        public string UserId { get; set; }

        //Entity relationships
        public virtual Chirp Chirp { get; set; }
        public virtual ChirperUser User { get; set; }

    }
}