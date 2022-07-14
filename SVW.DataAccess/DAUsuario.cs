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
    public class DAUsuario
    {
        public IEnumerable<Usuario> GetUsuario(Usuario obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Usuario_Estado", obj.Usuario_Estado);
                parm.Add("@NumPagina", obj.Operacion.Inicio);
                parm.Add("@TamPagina", obj.Operacion.Fin);
                var result = connection.Query(
                     sql: "SP_BUSCAR_USUARIO",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                     .Select(n => new Usuario
                     {
                         Usuario_Id = n.Single(d => d.Key.Equals("Usuario_Id")).Value.Parse<int>(),
                         Usuario_Nombre = n.Single(d => d.Key.Equals("Usuario_Nombre")).Value.Parse<string>(),
                         Usuario_Clave = n.Single(d => d.Key.Equals("Usuario_Clave")).Value.Parse<string>(),
                         Usuario_Tipo = n.Single(d => d.Key.Equals("Usuario_Tipo")).Value.Parse<int>(),
                         Usuario_Estado = n.Single(d => d.Key.Equals("Usuario_Estado")).Value.Parse<int>(),
                         Auditoria = new Auditoria
                         {
                             TipoUsuario = obj.Auditoria.TipoUsuario,
                         },
                         Operacion = new Operacion
                         {
                             TotalRows = n.Single(d => d.Key.Equals("TotalRows")).Value.Parse<int>(),
                         }
                     });

                return result;
            }
        }

        public int InsertUpdateUsuario(Usuario obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Usuario_Id", obj.Usuario_Id);
                parm.Add("@Usuario_Nombre", obj.Usuario_Nombre);
                parm.Add("@Usuario_Clave", obj.Usuario_Clave);
                parm.Add("@Usuario_Tipo", obj.Usuario_Tipo);
                parm.Add("@Usuario_Estado", obj.Usuario_Estado);
                var result = connection.Execute(
                    sql: "SP_INSERTAR_USUARIO",
                    param: parm,
                    commandType: CommandType.StoredProcedure);

                return result;
            }
        }

        public int DeleteUsuario(Usuario obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Usuario_Id", obj.Usuario_Id);
                var result = connection.Execute(
                    sql: "SP_ELIMINAR_USUARIO",
                    param: parm,
                    commandType: CommandType.StoredProcedure);

                return result;
            }
        }
    }
}
