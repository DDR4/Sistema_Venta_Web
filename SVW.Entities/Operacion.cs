using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SVW.Entities
{
   public class Operacion
    {
        public string TipoOperacion { get; set; }
        public string Opcion { get; set; }

        public int Inicio { get; set; }
        public int Fin { get; set; }
        public int TotalRows { get; set; }

    }
}
