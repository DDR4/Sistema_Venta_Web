using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SVW.Entities
{
    public class Imagen
    {
        public string Imagen_Nombre { get; set; }
        public string Imagen_Tipo { get; set; }
        public string Imagen_ImgBase64 { get; set; }
        public byte[] Imagen_Binario { get; set; }

    }
}
