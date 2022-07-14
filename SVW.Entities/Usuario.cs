using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SVW.Entities
{
    public class Usuario
    {
        public int? Usuario_Id { get; set; }
        public string Usuario_Nombre { get; set; }
        public string Usuario_Clave { get; set; }
        public int Usuario_Tipo { get; set; }
        public int Usuario_Estado { get; set; }
        public Operacion Operacion { get; set; }
        public Auditoria Auditoria { get; set; }
    }
}
