var Ventas = (function ($, win, doc) {

    var $cboTipoBusqueda = $('#cboTipoBusqueda');

    var $tipoFecha = $('#tipoFecha');

    var $txtFecha = $('#txtFecha');
    var $tblListadoVentas = $('#tblListadoVentas');
    var $btnBuscar = $('#btnBuscar');
    var $btnNuevaVenta = $('#btnNuevaVenta');

    //Modal Ventas
    var $formModal = $('#formModal');
    var $modalVentas = $('#modalVentas');
    var $txtModalFecha = $('#txtModalFecha');
    var $txtModalDescripcion = $('#txtModalDescripcion');           
    var $cboModalTipoVenta = $('#cboModalTipoVenta');
    var $cboModalTipoPago = $('#cboModalTipoPago');
    var $txtModalCantidad = $('#txtModalCantidad');
    var $txtModalCantidadMaxima = $('#txtModalCantidadMaxima');
    var $txtModalPrecioVenta = $('#txtModalPrecioVenta');
    var $txtModalPrecioProducto = $('#txtModalPrecioProducto');
    var $txtModalDescuento = $('#txtModalDescuento');
    var $txtModalTotal = $('#txtModalTotal');
    var $txtModalTotalFinal = $('#txtModalTotalFinal');

    var $btnProducto = $('#btnProducto');
    var $btnAgregarProducto = $('#btnAgregarProducto');
    var $btnSaveVenta = $('#btnSaveVenta');

    //Modal Producto 
    var $modalProducto = $('#modalProducto');

    var $tipoCategoriaModal = $('#tipoCategoriaModal');
    var $tipoDescripcionModal = $('#tipoDescripcionModal');

    var $tblListadoProductos = $('#tblListadoProductos');
    var $btnSaveProducto = $('#btnSaveProducto');

    var $cboTipoBusquedaModal = $('#cboTipoBusquedaModal');
    var $txtDescripcionModal = $('#txtDescripcionModal');
    var $cboCategoriaModal = $('#cboCategoriaModal');
    var $btnBuscarModal = $('#btnBuscarModal');

    var $tblListadoProductosSeleccionados = $('#tblListadoProductosSeleccionados');
    var $tblListadoProductosVendidos = $('#tblListadoProductosVendidos');
    
    var $btnGenerarExcel = $('#btnGenerarExcel');
    var $txtFechaDesde = $('#txtFechaDesde');
    var $txtFechaHasta = $('#txtFechaHasta');

    var $agregarProducto = $('#agregarProducto'); 
    
    var Message = {
        ObtenerTipoBusqueda: "Obteniendo los tipos de busqueda, Por favor espere...",
        GuardarSuccess: "Los datos se guardaron satisfactoriamente",
        EliminarSuccess: "El registro se elimino satisfactoriamente"
    };

    var NuevosDatosSeleccionados = [];
    var DatosSeleccionados = [];
    var DatosSeleccionadosDetalle = { Data: [] };

    var Global = null;  
    var TotalVenta = 0;

    // Constructor
    $(Initialize);

    // Implementacion del constructor
    function Initialize() {
        $cboTipoBusqueda.change($cboTipoBusqueda_change);
        $cboTipoBusquedaModal.change($cboTipoBusquedaModal_change);
        GetVentas();
        GetCategoria();
        app.Event.Datepicker($txtFecha);
        $btnBuscar.click($btnBuscar_click);
        $btnNuevaVenta.click($btnNuevaVenta_click);
        $btnProducto.click($btnProducto_click);
        $btnAgregarProducto.click($btnAgregarProducto_click);
        $btnSaveProducto.click($btnSaveProducto_click);
        $btnSaveVenta.click($btnSaveVenta_click);
        $btnBuscarModal.click($btnBuscarModal_click);
        $cboModalTipoVenta.change($cboModalTipoVenta_change);
        $txtModalCantidad.blur($txtModalPrecioVenta_keypress);
        $txtModalDescuento.blur($txtModalPrecioVenta_keypress);
        app.Event.Number($txtModalCantidad);
        $btnGenerarExcel.click($btnGenerarExcel_click);
        $txtFechaDesde.change(ValidarGenerarExcel);
        $txtFechaHasta.change(ValidarGenerarExcel);
        var date = new Date();
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        $txtFechaHasta.datepicker({
            endDate: "today",
            todayHighlight: true
        }).datepicker('setDate', today);
        $txtFechaDesde.datepicker({
            endDate: "today",
            todayHighlight: true
        }).datepicker('setDate', today);;
    }

    function $cboTipoBusqueda_change() {
        var codSelec = $(this).val();
        $tipoFecha.hide();

        if (codSelec === "0") {
            $txtFecha.val(null);
        } else if (codSelec === "1") {
            $tipoFecha.show();
        }
    }

    function $cboTipoBusquedaModal_change() {

        var codSelec = $(this).val();
        $tipoCategoriaModal.hide();
        $tipoDescripcionModal.hide();

        $cboCategoriaModal.val(0);
        $txtDescripcionModal.val("");

        if (codSelec === "1") {
            $tipoCategoriaModal.show();
        }
        else if (codSelec === "2") {
            $tipoDescripcionModal.show();
        }
    }

    function GetVentas() {

        var url = "Ventas/GetVentas";

        var parms = {
            Fecha: app.ConvertDatetimeToInt($txtFecha.val(), '/')
        };

        var columns = [
            { data: "Producto.Producto_Nombre" },
            { data: "TipoVenta.TipoVenta_Nombre" },
            { data: "TipoPago.TipoPago_Nombre" },
            { data: "Venta_Cantidad" },
            { data: "Producto.Producto_Precio" },
            { data: "Venta_Descuento" },
            { data: "Venta_Precio_Total" },
            { data: "Fecha" },
            { data: "Auditoria.TipoUsuario" }
        ];
        var columnDefs = [

            {
                "targets": [4, 5, 6],
                "className": "text-right",
                'render': function (data, type, full, meta) {
                    return '' + app.FormatNumber(data) + '';
                }
            },
            {
                "targets": [7],
                'render': function (data, type, full, meta) {
                    return '' + app.ConvertIntToDatetimeDT(data) + '';
                }
            },
            {
                "targets": [8],
                "visible": true,
                "orderable": false,
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    if (data === "1") {
                        return "<center>" +
                            '<a class="btn btn-default btn-xs" style="margin-right:0.8em" title="Eliminar" href="javascript:Ventas.EliminarVenta(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
                            "</center> ";
                    } else {
                        return "<center>"+''+"</center> ";
                    }
                }
            }
        ];

        var filters = {
            pageLength: app.Defaults.TablasPageLength
        };


        app.FillDataTableAjaxPaging($tblListadoVentas, url, parms, columns, columnDefs, filters, null, null);
    }

    function GetCategoria() {

        var method = "POST";
        var url = "Producto/GetCategoria";
        var fnDoneCallback = function (data) {
            $.each(data.Data, function (key, value) {
                $cboCategoriaModal.append("<option value=" + value.Categoria_Id + ">" + value.Categoria_Nombre + "</option>");
            });
        };
        app.CallAjax(method, url, null, fnDoneCallback);
    }

    function $btnBuscar_click() {
        if (ValidaBusqueda()) {
            GetVentas();
        }
    }

    function ValidaBusqueda() {
        var flag = true;
        var br = "<br>";
        var msg = "";

        var vcboTipoBusqueda = parseInt($cboTipoBusqueda.val());

        var Fecha = app.ConvertDatetimeToInt($txtFecha.val(), '/');

        switch (vcboTipoBusqueda) {

            case 2:
                msg += app.ValidarCampo(Fecha, "• La Fecha.");
                break;

            default:
                msg = "";
                break;
        }

        if (msg !== "") {
            flag = false;
            var msgTotal = "Por favor, Ingrese los siguientes campos de la venta: " + br + msg;
            app.Message.Info("Aviso", msgTotal);
        }

        return flag;
    }

    function $btnNuevaVenta_click() {
        $modalVentas.modal();
        $formModal[0].reset();
        app.Event.SetDateDatepicket($txtModalFecha);
        LimpiarAgregarProducto();
        DatosSeleccionados = [];
        NuevosDatosSeleccionados = [];                
        DatosSeleccionadosDetalle = { Data: [] };
        LoadProductosSeleccionados(DatosSeleccionados);
        LoadProductosVendidos(DatosSeleccionadosDetalle);
        $agregarProducto.hide();
    }

    function $btnSaveVenta_click() {           

        if (DatosSeleccionadosDetalle.Data.length > 0) {

            var cant_productos = parseInt(0);
            var flag = false;
            $.each(DatosSeleccionados, function (key, value) {
                $.each(DatosSeleccionadosDetalle.Data, function (key, valueD) {
                    if (value.Producto_Id === valueD.Producto.Producto_Id) {
                        cant_productos = cant_productos + parseInt(valueD.Venta_Cantidad);
                    }                                                                                       
                });

                if (cant_productos <= $txtModalCantidadMaxima.val()) {
                    flag = true;
                }
            });                 

            if (flag) {
                InsertUpdateVenta();
            } else {
                app.Message.Info("Aviso", "La cantidad de productos debe ser menor a la cantidad maxima.", null, null);
            }                                 
        }
        else
        {
            app.Message.Info("Aviso", "Agregar nuevos productos.", null, null);
        }
    }

    function InsertUpdateVenta() {
        var ProductosSeleccionados = [];
        DatosSeleccionadosDetalle.Data.map(function (v, i) {
            ProductosSeleccionados.push(v);
        }); 

        var obj = {
            "productosSeleccionados": ProductosSeleccionados
        };

        var method = "POST";
        var url = "Ventas/InsertUpdateVentas";
        var data = obj;
        var fnDoneCallback = function (data) {
            app.Message.Success("Grabar", Message.GuardarSuccess, "Aceptar", null);
            GetVentas();
            $modalVentas.modal('hide');
        };
        app.CallAjax(method, url, data, fnDoneCallback, null, null, null);

    }

    function $btnProducto_click() {
        $modalProducto.modal();
        $cboTipoBusquedaModal.val(0).change();        
        NuevosDatosSeleccionados = [];
        LoadProductos();
    }

    function LoadProductos() {

        var url = "Producto/GetProducto";
        var parms = {
            Categoria: { Categoria_Id: $cboCategoriaModal.val() },
            Producto_Nombre: $txtDescripcionModal.val().trim()
        };
        var columns = [         
            { data: "Categoria.Categoria_Nombre" },
            { data: "Producto_Nombre" },
            { data: "Producto_Cantidad" },
            { data: "Producto_Precio" },
            { data: "Producto_Precio_Mayor" }
        ];
        var columnDefs = [
            {
                "targets": [3,4],
                'render': function (data, type, full, meta) {
                    return '' + app.FormatNumber(data) + '';
                }
            }
        ];         

        var filters = {
            pageLength: app.Defaults.TablasPageLength
        };  
        app.FillDataTableAjaxPaging($tblListadoProductos, url, parms, columns, columnDefs, filters, null, null);
    }

    function $btnSaveProducto_click() {

        NuevosDatosSeleccionados = $tblListadoProductos.DataTable().rows({ selected: true }).data().toArray();

        $.each(NuevosDatosSeleccionados, function (key, valueDS) {
            $.each(DatosSeleccionados, function (key, valueNDS) {
                if (valueNDS.Producto_Id != valueDS.Producto_Id) {
                    NuevosDatosSeleccionados.push(valueNDS);
                }
            });
        });
        $tblListadoProductosSeleccionados.DataTable().clear().draw();
        LoadProductosSeleccionados(NuevosDatosSeleccionados);
        EventoSeleccionProducto();
        $modalProducto.modal('hide');
        DatosSeleccionados.push(NuevosDatosSeleccionados[0]);        
    }

    function GetTípoVenta() {
        LimpiarTipoVenta();
        $cboModalTipoVenta.append("<option value=1>Mayor</option>");
        $cboModalTipoVenta.append("<option value=2>Menor</option>");
        if (Global.Producto_Tipo == 1) {
            $cboModalTipoVenta.append("<option value=3>Granel</option>");
        }                       
    }

    function LimpiarTipoVenta() {
        $cboModalTipoVenta.html("");
        $cboModalTipoVenta.append("<option value=0>Todos</option>");
    }

    function $cboModalTipoVenta_change() {
        LimpiarAgregarProducto();
        var tipoVenta = $cboModalTipoVenta.val();

        if (tipoVenta == 1 || tipoVenta == 2) {
            $txtModalCantidadMaxima.val(Global.Producto_Cantidad);
        } else if (tipoVenta == 3) {
            $txtModalCantidadMaxima.val(Global.Producto_Cantidad_Gramo);
        }

        if (tipoVenta == 1) {
            $txtModalPrecioProducto.val(app.FormatNumber(Global.Producto_Precio_Mayor));
        } else if (tipoVenta == 2) {
            $txtModalPrecioProducto.val(app.FormatNumber(Global.Producto_Precio));
        } else if (tipoVenta == 3) {
            $txtModalPrecioProducto.val(app.FormatNumber(parseFloat(
                Global.Producto_Precio / Global.Producto_Cantidad_Kilo).toFixed(2)));
        } else {
            $txtModalPrecioProducto.val("");
        }

        $txtModalPrecioVenta_keypress();
    }

    function $txtModalPrecioVenta_keypress() {
        var PrecioProducto = parseFloat(app.UnformatNumber($txtModalPrecioProducto.val()));
        var Cantidad = parseInt($txtModalCantidad.val());
        var Descuento = parseFloat(app.UnformatNumber($txtModalDescuento.val()));

        if ($cboModalTipoVenta.val() == 3) {
            Cantidad = parseFloat(Cantidad / 1000)    
        }

        if (isNaN(Descuento)) {
            Descuento = 0
        }

        if (Cantidad > 0) {
            if (PrecioProducto > Descuento) {
                var PrecioVenta = app.FormatNumber(PrecioProducto - Descuento);
                $txtModalPrecioVenta.val(PrecioVenta)
                var Total = app.FormatNumber((PrecioProducto - Descuento) * Cantidad);
                $txtModalTotal.val(Total);     
            } else {
                app.Message.Info("ERROR", "El precio del producto no puede ser menor al descuento", null, null);
                $txtModalDescuento.val("");
            }
        }
    }

    function EliminarVenta(row) {
        var fnAceptarCallback = function () {
            var rowSelect = app.GetValueRowCellOfDataTable($tblListadoVentas, row);
            var obj = {
                "Venta_Id": rowSelect.Venta_Id
            };

            var method = "POST";
            var url = "Ventas/DeleteVentas";
            var data = obj;
            var fnDoneCallback = function (data) {
                app.Message.Success("Aviso", Message.EliminarSuccess, "Aceptar", null);
                GetVentas();
                $modalVentas.modal('hide');
            };
            app.CallAjax(method, url, data, fnDoneCallback, null, null, null);

        };
        app.Message.Confirm("Aviso", "Esta seguro que desea eliminar el registro?", "Aceptar", "Cancelar", fnAceptarCallback, null);
    }

    function $btnBuscarModal_click() {
        LoadProductos();
    }

    function $btnGenerarExcel_click() {
        var FechaDesde = app.ConvertDatetimeToInt($txtFechaDesde.val(), '/');
        var FechaHasta = app.ConvertDatetimeToInt($txtFechaHasta.val(), '/');

        if (FechaDesde !== "" && FechaHasta !== "") {
            GenerarExcel();
        } else if (FechaDesde === "") {
            app.Message.Info("Aviso", "Falta ingresar la Fecha Desde", "Aceptar", null);
        }

    }

    function GenerarExcel() {

        var data = {
            FechaDesde: app.ConvertDatetimeToInt($txtFechaDesde.val(), '/'),
            FechaHasta: app.ConvertDatetimeToInt($txtFechaHasta.val(), '/')
        };

        var fnDoneCallback = function (data) {
            if (data.InternalStatus === 1 && data.Data.length > 0) {
                app.RedirectTo("Ventas/GenerarExcel");
            } else {
                app.Message.Info("Aviso", "No hay ventas con esas fechas", "Aceptar");
            }
        };
        app.CallAjax("POST", "Ventas/GetAllVentas", data, fnDoneCallback);
    }

    function ValidarGenerarExcel() {
        var FechaDesde = app.ConvertDatetimeToInt($txtFechaDesde.val(), '/');
        var FechaHasta = app.ConvertDatetimeToInt($txtFechaHasta.val(), '/');

        if (FechaDesde > FechaHasta) {
            $txtFechaDesde.val("");
        }
    }       

    function EliminarProductoSeleccionado(row) {

        var data = app.GetValueRowCellOfDataTable($tblListadoProductosSeleccionados, row);
        var ProductosSeleccionadas = [];
        var fnAceptarCallback = function () {

            DatosSeleccionados.map(function (v, i) {
                ProductosSeleccionadas.push(v);
            });

            var index = $.inArray(data, DatosSeleccionados);
            ProductosSeleccionadas.splice(index, 1);

            DatosSeleccionados = [];
            $.each(ProductosSeleccionadas, function (index, value) {
                DatosSeleccionados.push(value);
            });

            LimpiarAgregarProducto();
            LoadProductosSeleccionados(DatosSeleccionados);
            EventoSeleccionProducto();  

            var cant_productos = parseInt(0);
            var ProductosVendidos = [];
            DatosSeleccionadosDetalle.Data.map(function (v, i) {
                if (v.Producto.Producto_Id == data.Producto_Id) {
                    cant_productos++;
                }
                ProductosVendidos.push(v);
            });

            for (var i = 0; i < cant_productos; i++) {
                $.each(ProductosVendidos, function (i, item) {
                    if (item.Producto.Producto_Id == data.Producto_Id) {
                        ProductosVendidos.splice(i, 1);
                        return false;
                    }
                });
            }

            DatosSeleccionadosDetalle = { Data: [] };
            $.each(ProductosVendidos, function (index, value) {
                DatosSeleccionadosDetalle.Data.push(value);
            });
            LoadProductosVendidos(DatosSeleccionadosDetalle);
        };

        var cant_detalle = parseInt(0);
        $.each(DatosSeleccionadosDetalle.Data, function (key, value) {
            if (value.Producto.Producto_Id == data.Producto_Id) {
                cant_detalle++;
            }
        });

        if (cant_detalle > 0) {
            app.Message.Confirm("Aviso", "Esta seguro que desea eliminar el producto, se eliminaran las tallas asociadas?", "Aceptar", "Cancelar", fnAceptarCallback, null);
            return false;
        }
        else {

            DatosSeleccionados.map(function (v, i) {
                ProductosSeleccionadas.push(v);
            });

            var index = $.inArray(data, DatosSeleccionados);
            ProductosSeleccionadas.splice(index, 1);

            DatosSeleccionados = [];
            $.each(ProductosSeleccionadas, function (index, value) {
                DatosSeleccionados.push(value);
            });

            LoadProductosSeleccionados(DatosSeleccionados);
            EventoSeleccionProducto();
        }
    }

    function LoadProductosSeleccionados(data) {
        $tblListadoProductosSeleccionados.DataTable({
            data: data,
            columns: [
                { data: "Categoria.Categoria_Nombre" },
                { data: "Producto_Nombre" },
                { data: "Producto_Cantidad" },
                { data: "Producto_Precio" },
                { data: "Producto_Precio_Mayor" },
                { data: "Producto_Id" }
            ],
            columnDefs: [
                {
                    "targets": [3,4],
                    'render': function (data, type, full, meta) {
                        return '' + app.FormatNumber(data) + '';
                    }
                },
                {
                    "targets": [5],
                    "visible": true,
                    "className": "text-center",
                    'render': function (data, type, full, meta) {
                        return "<center>" +
                            '<a class="btn btn-default btn-xs"  title="Eliminar" href="javascript:Ventas.EliminarProductoSeleccionado(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
                            "</center> ";
                    }
                }
            ],
            destroy: true,
            paging: true,
            searching: false,
            pageLength: 5,
            ordering: false,
            lengthMenu: false,
            lengthChange: false,
            select: {
                style: "single",
            },
            language: app.Defaults.DataTableLanguage
        });
    }

    function EventoSeleccionProducto() {
        var table = $tblListadoProductosSeleccionados.DataTable();

        table.on('select', function (e, dt, type, indexes) {
            var row = table.rows(indexes).data().toArray();
            if (row.length > 0) {
                var Producto = row[0];
                Global = Producto; 
                $txtModalDescripcion.val(Global.Producto_Nombre);
                $txtModalCantidadMaxima.val(Global.Producto_Cantidad);
                GetTípoVenta();
                $agregarProducto.show()
            }
        }).on('deselect', function (e, dt, type, indexes) {
            var row = table.rows(indexes).data().toArray();
            LimpiarTipoVenta();
            LimpiarAgregarProducto();
            $txtModalCantidadMaxima.val("");
            $txtModalPrecioProducto.val("");
            $agregarProducto.hide();
            Global = null;
        });
    }

    function $btnAgregarProducto_click() {
        if (ValidarAgregarProducto()) {
            var obj = {
                "Producto": {
                    "Producto_Id": Global.Producto_Id,
                    "Categoria_Nombre": Global.Categoria.Categoria_Nombre,
                    "Producto_Nombre": Global.Producto_Nombre,
                    "Producto_Precio": app.UnformatNumber($txtModalPrecioProducto.val())
                },
                "Venta_Cantidad": app.UnformatNumber($txtModalCantidad.val()),
                "Venta_Precio": app.UnformatNumber($txtModalPrecioVenta.val()),
                "Venta_Descuento": app.FormatNumber($txtModalDescuento.val()),
                "Venta_Precio_Total": app.UnformatNumber($txtModalTotal.val()),
                "TipoVenta": {
                    "TipoVenta_Id": $cboModalTipoVenta.val(),
                },
                "TipoPago": {
                    "TipoPago_Id": $cboModalTipoPago.val()
                }
            };

            DatosSeleccionadosDetalle.Data.push(obj);

            TotalVenta = TotalVenta + parseFloat(app.UnformatNumber($txtModalTotal.val()));
            $txtModalTotalFinal.val(app.FormatNumber(TotalVenta));

            LoadProductosVendidos(DatosSeleccionadosDetalle);
            LimpiarAgregarProducto();
        }                             
    }

    function LoadProductosVendidos(DatosSeleccionadosDetalle) {
        var columns = [
            { data: "Producto.Categoria_Nombre" },
            { data: "Producto.Producto_Nombre" },
            { data: "Venta_Cantidad" },
            { data: "Producto.Producto_Precio" },
            { data: "Venta_Descuento" },
            { data: "Venta_Precio" },
            { data: "Venta_Precio_Total" },
            { data: "Producto.Producto_Id" }
        ];
        var columnDefs = [
            {
                "targets": [7],
                "visible": true,
                "className": "text-center",
                'render': function (data, type, full, meta) {
                    return "<center>" +
                        '<a class="btn btn-default btn-xs"  title="Eliminar" href="javascript:Ventas.EliminarProductosVendidos(' + meta.row + ')"><i class="fa fa-trash" aria-hidden="true"></i></a>' +
                        "</center> ";
                }
            }
        ];

        var filtros = {
            pageLength: 5
        };

        app.FillDataTable($tblListadoProductosVendidos, DatosSeleccionadosDetalle, columns, columnDefs, "#tblListadoProductosVendidos", filtros, null, null, null, null, true);
    }

    function EliminarProductosVendidos(row) {
        var data = app.GetValueRowCellOfDataTable($tblListadoProductosVendidos, row);

        TotalVenta = TotalVenta - parseFloat(app.UnformatNumber(data.Total));
        $txtModalTotalFinal.val(app.FormatNumber(TotalVenta)); 

        var ProductosVendidos = [];
        DatosSeleccionadosDetalle.Data.map(function (v, i) {
            ProductosVendidos.push(v);
        });

        $.each(ProductosVendidos, function (i, item) {
            if (item.Producto_Id === data.Producto_Id) {
                ProductosVendidos.splice(i, 1);
                return false;
            }
        });

        DatosSeleccionadosDetalle = { Data: [] };
        $.each(ProductosVendidos, function (index, value) {
            DatosSeleccionadosDetalle.Data.push(value);
        });

        LoadProductosVendidos(DatosSeleccionadosDetalle);
    }

    function ValidarAgregarProducto() {
        var flag = true;
        var br = "<br>";
        var msg = "";
        msg += app.ValidarCampo($cboModalTipoPago.val(), "• El Tipo de Pago.");
        msg += app.ValidarCampo($cboModalTipoVenta.val(), "• El Tipo de Venta.");
        msg += app.ValidarCampo($txtModalCantidad.val(), "• La Cantidad.");

        if (msg !== "") {
            flag = false;
            var msgTotal = "Por favor, Ingrese los siguientes campos de venta: " + br + msg;
            app.Message.Info("Aviso", msgTotal);
        }

        return flag;
    }

    function LimpiarAgregarProducto() {
        $cboModalTipoPago.val(0);
        $txtModalCantidad.val("");
        $txtModalDescuento.val("");
        $txtModalTotal.val("");
    }

    return {
        EliminarVenta: EliminarVenta,
        EliminarProductoSeleccionado: EliminarProductoSeleccionado,
        EliminarProductosVendidos: EliminarProductosVendidos
    };


})(window.jQuery, window, document);