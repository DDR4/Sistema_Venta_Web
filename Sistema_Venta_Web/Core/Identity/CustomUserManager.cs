using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;
using System.Threading.Tasks;


namespace Sistema_Venta_Web.Core.Identity
{
    public class CustomUserManager : UserManager<CustomApplicationUser>
    {
        public CustomUserManager() : base(new CustomUserStore<CustomApplicationUser>())
        {
        }

        public override Task<CustomApplicationUser> FindAsync(string userName, string password)
        {
            var taskInvoke = Task<CustomApplicationUser>.Factory.StartNew(() =>
            {
                var credential = new SVW.Entities.Usuario
                {
                    Usuario_Nombre = userName,
                    Usuario_Clave = password
                };

                var authBL = new SVW.BusinessLogic.BLAuthorization();
                var result = authBL.Authorize(credential);

                return new CustomApplicationUser(result.Result);

            });

            return taskInvoke;
        }
    }
}