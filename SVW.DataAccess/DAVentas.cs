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
    public class DAVentas
    {
        public IEnumerable<Ventas> GetVentas(Ventas obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@FECHA", obj.Fecha);
                parm.Add("@NumPagina", obj.Operacion.Inicio);
                parm.Add("@TamPagina", obj.Operacion.Fin);

                var result = connection.Query(
                     sql: "SP_BUSCAR_VENTA",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                     .Select(n => new Ventas
                     {
                         Venta_Id = n.Single(d => d.Key.Equals("Venta_Id")).Value.Parse<int>(),
                         Producto = new Producto
                         {
                             Producto_Nombre = n.Single(d => d.Key.Equals("Producto_Nombre")).Value.Parse<string>(),
                             Producto_Precio = n.Single(d => d.Key.Equals("Producto_Precio")).Value.Parse<double>(),
                         },
                         Venta_Cantidad = n.Single(d => d.Key.Equals("Venta_Cantidad")).Value.Parse<int>(),
                         Venta_Precio = n.Single(d => d.Key.Equals("Venta_Total")).Value.Parse<double>(),
                         Venta_Descuento = n.Single(d => d.Key.Equals("Venta_Descuento")).Value.Parse<double>(),
                         Venta_Precio_Total = n.Single(d => d.Key.Equals("Venta_Total_Neto")).Value.Parse<double>(),
                         TipoVenta = new TipoVenta
                         {
                             TipoVenta_Id = n.Single(d => d.Key.Equals("Venta_Tipo")).Value.Parse<int>(),
                             TipoVenta_Nombre = n.Single(d => d.Key.Equals("Venta_Tipo_Des")).Value.Parse<string>(),
                         },
                         TipoPago = new TipoPago
                         {
                             TipoPago_Id = n.Single(d => d.Key.Equals("Venta_Tipo_Pago")).Value.Parse<int>(),
                             TipoPago_Nombre = n.Single(d => d.Key.Equals("Venta_Tipo_Pago_Des")).Value.Parse<string>(),
                         },
                         Fecha = n.Single(d => d.Key.Equals("Fecha")).Value.Parse<int>(),
                         Auditoria = new Auditoria
                         {
                             TipoUsuario = obj.Auditoria.TipoUsuario
                         },
                         Operacion = new Operacion
                         {
                             TotalRows = n.Single(d => d.Key.Equals("TotalRows")).Value.Parse<int>()
                         }
                     });

                return result;
            }
        }

        public int InsertUpdateVentas(Ventas obj)
        {

            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Producto_Id", obj.Producto.Producto_Id);
                parm.Add("@Venta_Cantidad", obj.Venta_Cantidad);
                parm.Add("@Venta_Total", obj.Venta_Precio);
                parm.Add("@Venta_Descuento", obj.Venta_Descuento);
                parm.Add("@Venta_Total_Neto", obj.Venta_Precio_Total);
                parm.Add("@Venta_Tipo", obj.TipoVenta.TipoVenta_Id);
                parm.Add("@Venta_Tipo_Pago", obj.TipoPago.TipoPago_Id);
                parm.Add("@Usuario", obj.Auditoria.UsuarioCreacion);

                var result = connection.Execute(
                    sql: "SP_INSERTAR_VENTA",
                    param: parm,
                    commandType: CommandType.StoredProcedure);

                return result;
            }
        }

        public int DeleteVentas(Ventas obj)
        {

            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@Venta_Id", obj.Venta_Id);
                parm.Add("@Usuario", obj.Auditoria.UsuarioModificacion);

                var result = connection.Execute(
                    sql: "SP_ELIMINAR_VENTA",
                    param: parm,
                    commandType: CommandType.StoredProcedure);

                return result;
            }
        }

        public IEnumerable<Ventas> GetAllVentas(Ventas obj)
        {
            using (var connection = Factory.ConnectionFactory())
            {
                connection.Open();
                var parm = new DynamicParameters();
                parm.Add("@FechaDesde", obj.FechaDesde);
                parm.Add("@FechaHasta", obj.FechaHasta);

                var result = connection.Query(
                     sql: "SP_FILTRAR_VENTA",
                     param: parm,
                     commandType: CommandType.StoredProcedure)
                     .Select(m => m as IDictionary<string, object>)
                          .Select(n => new Ventas
                          {
                              Venta_Id = n.Single(d => d.Key.Equals("Venta_Id")).Value.Parse<int>(),
                              Producto = new Producto
                              {
                                  Producto_Nombre = n.Single(d => d.Key.Equals("Producto_Nombre")).Value.Parse<string>(),
                                  Producto_Precio = n.Single(d => d.Key.Equals("Producto_Precio")).Value.Parse<double>(),
                              },
                              Venta_Cantidad = n.Single(d => d.Key.Equals("Venta_Cantidad")).Value.Parse<int>(),
                              Venta_Precio = n.Single(d => d.Key.Equals("Venta_Total")).Value.Parse<double>(),
                              Venta_Descuento = n.Single(d => d.Key.Equals("Venta_Descuento")).Value.Parse<double>(),
                              Venta_Precio_Total = n.Single(d => d.Key.Equals("Venta_Total_Neto")).Value.Parse<double>(),
                              TipoVenta = new TipoVenta
                              {
                                  TipoVenta_Id = n.Single(d => d.Key.Equals("Venta_Tipo")).Value.Parse<int>(),
                                  TipoVenta_Nombre = n.Single(d => d.Key.Equals("Venta_Tipo_Des")).Value.Parse<string>(),
                              },
                              TipoPago = new TipoPago
                              {
                                  TipoPago_Id = n.Single(d => d.Key.Equals("Venta_Tipo_Pago")).Value.Parse<int>(),
                                  TipoPago_Nombre = n.Single(d => d.Key.Equals("Venta_Tipo_Pago_Des")).Value.Parse<string>(),
                              },
                              Fecha = n.Single(d => d.Key.Equals("Fecha")).Value.Parse<int>()
                          });

                return result;
            }
        }

    }
}
