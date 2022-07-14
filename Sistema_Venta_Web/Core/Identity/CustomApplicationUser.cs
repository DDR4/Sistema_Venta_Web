using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;

namespace Sistema_Venta_Web.Core.Identity
{
    public class CustomApplicationUser : IUser
    {
        public string Id { get; }
        public string UserName { get; set; }
        public SVW.Common.Response<SVW.Entities.Usuario> Usuario { get; set; }

        public CustomApplicationUser() : this(new SVW.Common.Response<SVW.Entities.Usuario>(default(SVW.Entities.Usuario)))
        {
        }


        public CustomApplicationUser(SVW.Common.Response<SVW.Entities.Usuario> usuario)
        {
            Usuario = usuario;

            if (usuario.InternalStatus == SVW.Common.EnumTypes.InternalStatus.Success)
            {
                Id = usuario.Data.Usuario_Tipo.ToString();
                UserName = usuario.Data.Usuario_Nombre;
            }
            else
            {
                // Valores por defecto, lo cuales no tendran relevancia, puesto que la aplicación no iniciará sesión.
                Id = "01";
                UserName = "USER";
            }
        }


    }
}