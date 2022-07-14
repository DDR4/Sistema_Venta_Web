using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security;
using SVW.Entities;
using Sistema_Venta_Web.Core.Identity;
using Sistema_Venta_Web.Models;

namespace Sistema_Venta_Web.Controllers
{
    public class AccountController : Controller
    {
        private CustomUserManager CustomUserManager { get; set; }

        public AccountController() : this(new CustomUserManager()) { }

        public AccountController(CustomUserManager customUserManager)
        {
            CustomUserManager = customUserManager;
        }

        // GET: Account
        [AllowAnonymous]
        public ActionResult Login(string returnUrl)
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToLocal(SVW.Common.Constants.ConfigurationKeys.DefaultRedirect);
            }
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel modelView, string returnUrl)
        {
            if (!ModelState.IsValid)
            {
                return View(modelView);
            }

            var result = await CustomUserManager.FindAsync(modelView.UserName, modelView.Password);

            if (result.Usuario.InternalStatus == SVW.Common.EnumTypes.InternalStatus.Success)
            {
                await SignInAsync(result, true);
                return RedirectToLocal(returnUrl);
            }
            else
            {
                ModelState.AddModelError("", result.Usuario.InternalException);
            }

            return View(modelView);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult LogOff(string returnUrl)
        {
            AuthenticationManager.SignOut();
            return RedirectToLocal(returnUrl);

        }
        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }

            return Redirect(AppConfig.UriBase);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && CustomUserManager != null)
            {
                CustomUserManager.Dispose();
                CustomUserManager = null;
            }
            base.Dispose(disposing);
        }
        private IAuthenticationManager AuthenticationManager
        {
            get { return HttpContext.GetOwinContext().Authentication; }
        }

        public async Task SignInAsync(CustomApplicationUser user, bool isPersistent)
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);

            var identity = await CustomUserManager.CreateIdentityAsync(user, DefaultAuthenticationTypes.ApplicationCookie);

            identity.AddClaim(new Claim("Username", user.Id ?? ""));
            identity.AddClaim(new Claim("NombreUsuario", user.UserName ?? ""));
            //identity.AddClaim(new Claim("EmailUsuario", Bsp.Security.TokenValidator.Token.EmailUsuario ?? ""));
          

            var authenticationProperties = new AuthenticationProperties();
            authenticationProperties.IsPersistent = isPersistent;
            authenticationProperties.ExpiresUtc = DateTime.UtcNow.AddMinutes(60);
            authenticationProperties.AllowRefresh = true;

            AuthenticationManager.SignIn(authenticationProperties, identity);

        }

    }
}