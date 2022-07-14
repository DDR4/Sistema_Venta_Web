using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dapper;
using SVW.Common;
using SVW.Entities;

namespace SVW.DataAccess
{
    public class DAAuthorization
    {
        public Task<Usuario> Authorize(Usuario obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();

                var parameter = new DynamicParameters();

                parameter.Add("@Usuario_Nombre", obj.Usuario_Nombre);
                parameter.Add("@Usuario_Clave", obj.Usuario_Clave);

                var result = connection.Query(
                    sql: "LOGEAR",
                    param: parameter,
                    commandType: CommandType.StoredProcedure)
                    .Select(m => m as IDictionary<string, object>)
                    .Select(n => new Usuario
                    {
                        Usuario_Id = n.Single(d => d.Key.Equals("Usuario_Id")).Value.Parse<int>(),
                        Usuario_Nombre = n.Single(d => d.Key.Equals("Usuario_Nombre")).Value.Parse<string>(),
                        Usuario_Tipo = n.Single(d => d.Key.Equals("Usuario_Tipo")).Value.Parse<int>(),
                    });

                return Task.FromResult(result.FirstOrDefault());

            }


        }
    }
}
