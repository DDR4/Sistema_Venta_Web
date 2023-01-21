using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace SVW.Entities
{
    public class Producto
    {
        public int? Producto_Id { get; set; }
        public string Producto_Codigo { get; set; }
        public string Producto_Nombre { get; set; }
        public double Producto_Precio { get; set; }
        public double Producto_Precio_Mayor { get; set; }
        public int Producto_Cantidad { get; set; }
        public int Producto_Cantidad_Gramo { get; set; }
        public int Producto_Cantidad_Kilo { get; set; }
        public int Producto_Tipo { get; set; }
        public Imagen Imagen { get; set; }
        public Categoria Categoria { get; set; }
        public int Producto_Estado { get; set; }
        public Operacion Operacion { get; set; }
        public Auditoria Auditoria { get; set; }
        public int? Producto_Fecha { get; set; }
        public string FechaDesde { get; set; }
        public string FechaHasta { get; set; }

    }
}
