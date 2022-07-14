using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace SVW.Entities
{
    public class Ventas
    {
        public int? Venta_Id { get; set; }
        public int Venta_Cantidad { get; set; }
        public double Venta_Descuento { get; set; }
        public double Venta_Precio { get; set; }
        public double Venta_Precio_Total { get; set; }
        public TipoVenta TipoVenta { get; set; }
        public TipoPago TipoPago { get; set; }
        public int? Fecha { get; set; }
        public string FechaDesde { get; set; }
        public string FechaHasta { get; set; }
        public Producto Producto { get; set; }
        public Operacion Operacion { get; set; }
        public Auditoria Auditoria { get; set; }
    }
}
