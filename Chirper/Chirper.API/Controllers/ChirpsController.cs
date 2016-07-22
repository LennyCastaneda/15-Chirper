using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Chirper.API.Infrastructure;
using Chirper.API.Models;

namespace Chirper.API.Controllers
{
    [Authorize]
    public class ChirpsController : ApiController
    {
        private DataContext db = new DataContext();

        // GET: api/Chirps
        public IQueryable<Chirp> GetChirps()
        {
            return db.Chirps;
        }

        // GET: api/Chirps/5
        [ResponseType(typeof(Chirp))]
        public IHttpActionResult GetChirp(int id)
        {
            Chirp chirp = db.Chirps.Find(id);
            if (chirp == null)
            {
                return NotFound();
            }

            return Ok(chirp);
        }

        // PUT: api/Chirps/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutChirp(int id, Chirp chirp)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != chirp.ChirpId)
            {
                return BadRequest();
            }

            db.Entry(chirp).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChirpExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Chirps
        [ResponseType(typeof(Chirp))]
        public IHttpActionResult PostChirp(Chirp chirp)
        {
            string username = User.Identity.Name;
            var user = db.Users.FirstOrDefault(u => u.UserName == username);

            //Add userId if username is found
            if(user.Id == null)
            {
                Unauthorized();
            }
            else
            {
                chirp.UserId = user.Id;
            }

            //Add created date
            chirp.CreatedDate = DateTime.Now;

            //Add Liked Count
            chirp.LikedCount = 0;

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Chirps.Add(chirp);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = chirp.ChirpId }, chirp);
        }

        // DELETE: api/Chirps/5
        [ResponseType(typeof(Chirp))]
        public IHttpActionResult DeleteChirp(int id)
        {
            Chirp chirp = db.Chirps.Find(id);
            if (chirp == null)
            {
                return NotFound();
            }

            db.Chirps.Remove(chirp);
            db.SaveChanges();

            return Ok(chirp);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ChirpExists(int id)
        {
            return db.Chirps.Count(e => e.ChirpId == id) > 0;
        }
    }
}