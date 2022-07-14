using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SVW.Common
{
   public static class ExtendedMethods
    {
        public static dynamic Parse<T>(this object obj)
        {
            try
            {
                if (typeof(T) == typeof(string))
                {
                    return obj.ToString();
                }
                else if (typeof(T) == typeof(char))
                {
                    return Convert.ToChar(obj);
                }
                else if (typeof(T) == typeof(bool))
                {
                    return Convert.ToBoolean(obj);
                }
                else if (typeof(T) == typeof(int))
                {
                    return Convert.ToInt32(obj);
                }
                else if (typeof(T) == typeof(Int16))
                {
                    return Convert.ToInt16(obj);
                }
                else if (typeof(T) == typeof(Int32))
                {
                    return Convert.ToInt32(obj);
                }
                else if (typeof(T) == typeof(Int64))
                {
                    return Convert.ToInt64(obj);
                }
                else if (typeof(T) == typeof(DateTime))
                {
                    return Convert.ToDateTime(obj);
                }
                else if (typeof(T) == typeof(decimal))
                {
                    return Convert.ToDecimal(obj);
                }
                else if (typeof(T) == typeof(double))
                {
                    return Convert.ToDouble(obj);
                }
                else
                {
                    return obj;
                }
            }
            catch (Exception)
            {
                return default(T);
            }
        }

        public static T? ParseNullable<T>(this object obj) where T : struct
        {
            return obj == null ? null : (T?)Convert.ChangeType(obj, typeof(T));
        }
    }
}
