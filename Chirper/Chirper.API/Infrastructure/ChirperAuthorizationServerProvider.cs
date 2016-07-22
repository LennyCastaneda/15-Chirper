using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace Chirper.API.Infrastructure
{
    //Inherits OAuthAuthorizationServerProvider class
    public class ChirperAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        //Two override methods

        //Check login context
        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            //Allow cors specifically for OAuth and authenticating users
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });
            {
                //Find user based on username and password in auth repository
                using (var authorizationRepository = new AuthorizationRepository())
                {
                    var user = await authorizationRepository.FindUser(context.UserName, context.Password);

                    //Throw error if no user found
                    if(user == null)
                    {
                        context.SetError("invalid_grant", "username or password is incorrect");

                    }
                    else
                    {
                        //Create a token and add some claims - name, role, and authorization type
                        var token = new ClaimsIdentity(context.Options.AuthenticationType);
                        token.AddClaim(new Claim(ClaimTypes.Name, context.UserName));
                        token.AddClaim(new Claim(ClaimTypes.Role, "user"));

                        context.Validated(token);
                    }
                }
                    
            }

        }
    }
}