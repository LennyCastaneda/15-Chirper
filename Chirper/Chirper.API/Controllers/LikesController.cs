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
    public class LikesController : ApiController
    {
        private DataContext db = new DataContext();

        // GET: api/Likes
        public IQueryable<Like> GetLikes()
        {
            return db.Likes;
        }

        // GET: api/Likes/5
        [ResponseType(typeof(Like))]
        public IHttpActionResult GetLike(int id)
        {
            Like like = db.Likes.Find(id);
            if (like == null)
            {
                return NotFound();
            }

            return Ok(like);
        }

        // PUT: api/Likes/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutLike(int id, Like like)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != like.LikeId)
            {
                return BadRequest();
            }

            db.Entry(like).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LikeExists(id))
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

        // POST: api/Likes
        [ResponseType(typeof(Like))]
        public IHttpActionResult PostLike(Like like)
        {
            string username = User.Identity.Name;
            var user = db.Users.FirstOrDefault(u => u.UserName == username);

            //Add userId if username is found
            if (user.Id == null)
            {
                Unauthorized();
            }
            else
            {
                like.UserId = user.Id;
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Likes.Add(like);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = like.LikeId }, like);
        }

        // DELETE: api/Likes/5
        [ResponseType(typeof(Like))]
        public IHttpActionResult DeleteLike(int id)
        {
            Like like = db.Likes.Find(id);
            if (like == null)
            {
                return NotFound();
            }

            db.Likes.Remove(like);
            db.SaveChanges();

            return Ok(like);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool LikeExists(int id)
        {
            return db.Likes.Count(e => e.LikeId == id) > 0;
        }
    }
}