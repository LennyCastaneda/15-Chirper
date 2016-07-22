using Chirper.API.Infrastructure;
using Chirper.API.Models;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Chirper.API.Controllers
{
    public class AccountsController : ApiController
    {
        private AuthorizationRepository _repo = new AuthorizationRepository();
        
        //POST 
        [Route("api/accounts/register")]
        public async Task<IHttpActionResult> Register(RegistrationModel userModel)
        {
            //Validation
            if(!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _repo.RegisterUser(userModel);

            IHttpActionResult errorResult = GetErrorResult(result);

            if(errorResult != null)
            {
                return errorResult;
            }

            return Ok();
        }

        //rolls up error messages to return as error result
        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if(result == null)
            {
                return InternalServerError();
            }
            if(!result.Succeeded)
            {
                if(result.Errors!= null)
                {
                    foreach(string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }
                if(ModelState.IsValid)
                {
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }
            return null;
        }

        //Clean up
        protected override void Dispose(bool disposing)
        {
            if(disposing)
            {
                _repo.Dispose();
            }
            base.Dispose(disposing);
        }

    }
}
