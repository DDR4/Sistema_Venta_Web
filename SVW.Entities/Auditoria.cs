using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SVW.Entities
{
    public class Auditoria
    {
        public string UsuarioCreacion { get; set; }
        public string UsuarioModificacion { get; set; }
        public string TipoUsuario { get; set; }
    }
}
