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
    public class DAGastos
    {
        public IEnumerable<Gastos> GetGastos(Gastos obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Gasto_Fecha", obj.Gasto_Fecha);
                parm.Add("@Gasto_Estado", obj.Gasto_Estado);
                parm.Add("@NumPagina", obj.Operacion.Inicio);
                parm.Add("@TamPagina", obj.Operacion.Fin);
                var result = connection.Query(
                     sql: "SP_BUSCAR_GASTO",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                     .Select(n => new Gastos
                     {
                         Gasto_Id = n.Single(d => d.Key.Equals("Gasto_Id")).Value.Parse<int>(),
                         Gasto_Nombre = n.Single(d => d.Key.Equals("Gasto_Nombre")).Value.Parse<string>(),
                         Gasto_Total = n.Single(d => d.Key.Equals("Gasto_Total")).Value.Parse<double>(),
                         Gasto_Estado = n.Single(d => d.Key.Equals("Gasto_Estado")).Value.Parse<int>(),
                         Gasto_Fecha = n.Single(d => d.Key.Equals("Gasto_Fecha")).Value.Parse<int>(),
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

        public int InsertUpdateGastos(Gastos obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Gasto_Id", obj.Gasto_Id);
                parm.Add("@Gasto_Nombre", obj.Gasto_Nombre);
                parm.Add("@Gasto_Total", obj.Gasto_Total);
                parm.Add("@Gasto_Fecha", obj.Gasto_Fecha);
                parm.Add("@Gasto_Estado", obj.Gasto_Estado);
                parm.Add("@Usuario", obj.Auditoria.UsuarioCreacion);
                var result = connection.Execute(
                    sql: "SP_INSERTAR_GASTO",
                    param: parm,
                    commandType: CommandType.StoredProcedure);

                return result;
            }
        }

        public int DeleteGastos(Gastos obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Gasto_Id", obj.Gasto_Id);
                parm.Add("@Usuario", obj.Auditoria.UsuarioModificacion);
                var result = connection.Execute(
                    sql: "SP_ELIMINAR_GASTO",
                    param: parm,
                    commandType: CommandType.StoredProcedure);

                return result;
            }
        }
    }
}
