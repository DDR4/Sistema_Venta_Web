using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SVW.Entities
{
    public class Gastos
    {
        public int? Gasto_Id { get; set; }
        public string Gasto_Nombre { get; set; }
        public int Gasto_Cantidad { get; set; }
        public double Gasto_Total { get; set; }
        public int Gasto_Estado { get; set; }
        public int? Gasto_Fecha { get; set; }
        public Producto Producto { get; set; }
        public Operacion Operacion { get; set; }
        public Auditoria Auditoria { get; set; }
    }
}
