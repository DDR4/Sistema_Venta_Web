using Dapper;
using SVW.Common;
using SVW.Entities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SVW.DataAccess
{
    public class DAProducto
    {
        public IEnumerable<Producto> GetProducto(Producto obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Categoria_Id", obj.Categoria.Categoria_Id);
                parm.Add("@Producto_Nombre", obj.Producto_Nombre);
                parm.Add("@Producto_Cantidad", obj.Producto_Cantidad);
                parm.Add("@Producto_Estado", obj.Producto_Estado);
                parm.Add("@NumPagina", obj.Operacion.Inicio);
                parm.Add("@TamPagina", obj.Operacion.Fin);
                var result = connection.Query(
                     sql: "SP_BUSCAR_PRODUCTO",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                     .Select(n => new Producto
                     {
                         Producto_Id = n.Single(d => d.Key.Equals("Producto_Id")).Value.Parse<int>(),
                         Producto_Nombre = n.Single(d => d.Key.Equals("Producto_Nombre")).Value.Parse<string>(),
                         Producto_Precio = n.Single(d => d.Key.Equals("Producto_Precio")).Value.Parse<double>(),
                         Producto_Precio_Mayor = n.Single(d => d.Key.Equals("Producto_Precio_Mayor")).Value.Parse<double>(),
                         Producto_Cantidad = n.Single(d => d.Key.Equals("Producto_Cantidad")).Value.Parse<int>(),
                         Producto_Cantidad_Gramo = n.Single(d => d.Key.Equals("Producto_Cantidad_Gramo")).Value.Parse<int>(),
                         Producto_Cantidad_Kilo = n.Single(d => d.Key.Equals("Producto_Cantidad_Kilo")).Value.Parse<int>(),
                         Producto_Tipo = n.Single(d => d.Key.Equals("Producto_Tipo")).Value.Parse<int>(),
                         Categoria = new Categoria
                         {
                             Categoria_Id = n.Single(d => d.Key.Equals("Categoria_Id")).Value.Parse<int>(),
                             Categoria_Nombre = n.Single(d => d.Key.Equals("Categoria_Nombre")).Value.Parse<string>(),
                         },
                         Producto_Estado = n.Single(d => d.Key.Equals("Producto_Estado")).Value.Parse<int>(),
                         Auditoria = new Auditoria
                         {
                             TipoUsuario = obj.Auditoria.TipoUsuario,
                         },
                         Operacion = new Operacion
                         {
                             TotalRows = n.Single(d => d.Key.Equals("TotalRows")).Value.Parse<int>(),
                         },
                         Producto_Fecha = n.Single(d => d.Key.Equals("Fecha")).Value.Parse<int>(),
                     });

                return result;
            }
        }

        public IEnumerable<Categoria> GetCategoria()
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                var result = connection.Query(
                     sql: "SP_BUSCAR_CATEGORIA",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                     .Select(n => new Categoria
                     {
                         Categoria_Id = n.Single(d => d.Key.Equals("Categoria_Id")).Value.Parse<int>(),
                         Categoria_Nombre = n.Single(d => d.Key.Equals("Categoria_Nombre")).Value.Parse<string>()
                     });

                return result;
            }
        }

        public int InsertUpdateProducto(Producto obj)
        {

            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Producto_Id", obj.Producto_Id);
                parm.Add("@Categoria_Id", obj.Categoria.Categoria_Id);
                parm.Add("@Producto_Nombre", obj.Producto_Nombre);
                parm.Add("@Producto_Precio", obj.Producto_Precio);
                parm.Add("@Producto_Precio_Mayor", obj.Producto_Precio_Mayor);
                parm.Add("@Producto_Cantidad", obj.Producto_Cantidad);
                parm.Add("@Producto_Cantidad_Kilo", obj.Producto_Cantidad_Kilo);
                parm.Add("@Producto_Tipo", obj.Producto_Tipo);
                parm.Add("@Usuario", obj.Auditoria.UsuarioCreacion);
                parm.Add("@Estado", obj.Producto_Estado);
                var result = connection.Execute(
                    sql: "SP_INSERTAR_PRODUCTO",
                    param: parm,
                    commandType: CommandType.StoredProcedure);

                return result;
            }
        }

        public int DeleteProducto(Producto obj)
        {

            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Producto_Id", obj.Producto_Id);
                parm.Add("@Usuario", obj.Auditoria.UsuarioModificacion);
                var result = connection.Execute(
                    sql: "SP_ELIMINAR_PRODUCTO",
                    param: parm,
                    commandType: CommandType.StoredProcedure);

                return result;
            }
        }

        public IEnumerable<Producto> GetAllProductos(Producto obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Producto_Nombre", obj.Producto_Nombre);
                parm.Add("@Estado", obj.Producto_Estado);
                parm.Add("@FechaDesde", obj.FechaDesde);
                parm.Add("@FechaHasta", obj.FechaHasta);

                var result = connection.Query(
                     sql: "SP_FILTRAR_PRODUCTO",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                     .Select(n => new Producto
                     {
                         Categoria = new Categoria
                         {
                             Categoria_Nombre = n.Single(d => d.Key.Equals("Categoria_Nombre")).Value.Parse<string>(),
                         },
                         Producto_Nombre = n.Single(d => d.Key.Equals("Producto_Nombre")).Value.Parse<string>(),                         
                         Producto_Precio = n.Single(d => d.Key.Equals("Producto_Precio")).Value.Parse<double>(),
                         Producto_Precio_Mayor = n.Single(d => d.Key.Equals("Producto_Precio_Mayor")).Value.Parse<double>(),
                         Producto_Cantidad = n.Single(d => d.Key.Equals("Producto_Cantidad")).Value.Parse<int>(),
                         Producto_Tipo = n.Single(d => d.Key.Equals("Producto_Tipo")).Value.Parse<int>(),
                         Producto_Estado = n.Single(d => d.Key.Equals("Producto_Estado")).Value.Parse<int>(),
                         Producto_Fecha = n.Single(d => d.Key.Equals("Fecha")).Value.Parse<int>()
                     });

                return result;
            }
        }         
    }
}
