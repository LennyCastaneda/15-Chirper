using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Chirper.API.Models
{
    public class ChirperUser : IdentityUser
    {
        public virtual ICollection<Chirp> Chirps { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
    }
}