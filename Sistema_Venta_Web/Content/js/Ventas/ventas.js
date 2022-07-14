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

    var $btnProducto = $('#btnProducto');
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

    var $btnGenerarExcel = $('#btnGenerarExcel');
    var $txtFechaDesde = $('#txtFechaDesde');
    var $txtFechaHasta = $('#txtFechaHasta'); 

    var Message = {
        ObtenerTipoBusqueda: "Obteniendo los tipos de busqueda, Por favor espere...",
        GuardarSuccess: "Los datos se guardaron satisfactoriamente",
        EliminarSuccess: "El registro se elimino satisfactoriamente"
    };

    var Global = {
        Producto_Id: 0,
        Producto_Nombre: null,
        Producto_Cantidad: 0,
        Producto_Precio: 0.0,
        Producto_Precio_Mayor: 0.0,
        Producto_Tipo: 0,
        Producto_Cantidad_Gramo: 0,
        Producto_Cantidad_Kilo: 0
    };

    // Constructor
    $(Initialize);

    // Implementacion del constructor
    function Initialize() {
        $cboTipoBusqueda.change($cboTipoBusqueda_change);
        $cboTipoBusquedaModal.change($cboTipoBusquedaModal_change);
        GetVentas();
        GetCategoria();
        app.Event.Datepicker($txtFecha);
        app.Event.SetDateDatepicket($txtModalFecha);
        $btnBuscar.click($btnBuscar_click);
        $btnNuevaVenta.click($btnNuevaVenta_click);
        $btnProducto.click($btnProducto_click);
        $btnSaveProducto.click($btnSaveProducto_click);
        $btnSaveVenta.click($btnSaveVenta_click);
        $btnBuscarModal.click($btnBuscarModal_click);
        $cboModalTipoVenta.change($cboModalTipoVenta_change)
        $txtModalPrecioVenta.blur($txtModalPrecioVenta_keypress);
        $txtModalCantidad.blur($txtModalPrecioVenta_keypress);
        app.Event.ForceDecimalOnly($txtModalPrecioVenta);
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
            { data: "Venta_Precio" },
            { data: "Venta_Descuento" },
            { data: "Venta_Precio_Total" },
            { data: "Fecha" },
            { data: "Auditoria.TipoUsuario" }
        ];
        var columnDefs = [

            {
                "targets": [4, 5, 6, 7],
                "className": "text-right",
                'render': function (data, type, full, meta) {
                    return '' + app.FormatNumber(data) + '';
                }
            },
            {
                "targets": [8],
                'render': function (data, type, full, meta) {
                    return '' + app.ConvertIntToDatetimeDT(data) + '';
                }
            },
            {
                "targets": [9],
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
                msg += app.ValidarCampo(Fecha, "• La fecha.");
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
        $cboModalTipoVenta.append("<option value=0>Todos</option>");
    }

    function $btnSaveVenta_click() {

        var total = app.UnformatNumber($txtModalPrecioVenta.val());

        if (total > 0) {
            InsertUpdateVenta();
        } else if (total === 0) {
            app.Message.Info("Aviso", "Ingrese un precio de venta.", null, null);
        }

    }

    function InsertUpdateVenta() {

        var obj = {
            "Producto": { "Producto_Id": Global.Producto_Id },
            "Venta_Cantidad": $txtModalCantidad.val(),
            "Venta_Precio": app.UnformatNumber($txtModalPrecioVenta.val()),
            "Venta_Descuento": app.UnformatNumber($txtModalDescuento.val()),
            "Venta_Precio_Total": app.UnformatNumber($txtModalTotal.val()),
            "TipoVenta": { "TipoVenta_Id": $cboModalTipoVenta.val() },
            "TipoPago": { "TipoPago_Id": $cboModalTipoPago.val() }
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
        LoadProductos();
    }

    function LoadProductos() {

        var url = "Ventas/GetProducto";
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

        app.FillDataTableAjaxPaging($tblListadoProductos, url, parms, columns, columnDefs, null, null, null);
    }

    function $btnSaveProducto_click() {

        var DatosSeleccionados = $tblListadoProductos.DataTable().rows({ selected: true }).data().toArray();
        var Producto = DatosSeleccionados[0];

        Global = {
            Producto_Id: Producto.Producto_Id,
            Producto_Nombre: Producto.Producto_Nombre,
            Producto_Cantidad: Producto.Producto_Cantidad,
            Producto_Precio: Producto.Producto_Precio,
            Producto_Precio_Mayor: Producto.Producto_Precio_Mayor,
            Producto_Tipo: Producto.Producto_Tipo,
            Producto_Cantidad_Gramo: Producto.Producto_Cantidad_Gramo,
            Producto_Cantidad_Kilo: Producto.Producto_Cantidad_Kilo
       };

       $txtModalDescripcion.val(Global.Producto_Nombre);
       $modalProducto.modal('hide');
       GetTípoVenta();
    }

    function GetTípoVenta() {
        $cboModalTipoVenta.html("");
        $cboModalTipoVenta.append("<option value=0>Todos</option>");
        $cboModalTipoVenta.append("<option value=1>Mayor</option>");
        $cboModalTipoVenta.append("<option value=2>Menor</option>");
        if (Global.Producto_Tipo == 1) {
            $cboModalTipoVenta.append("<option value=3>Granel</option>");
        }     
    }

    function $cboModalTipoVenta_change() {
        $txtModalPrecioVenta.val("");
        $txtModalCantidad.val("");
        var tipoVenta = $cboModalTipoVenta.val();
        if (Global.Producto_Nombre != null) {

            if (tipoVenta == 1 || tipoVenta == 2) {
                $txtModalCantidadMaxima.val(Global.Producto_Cantidad);
            } else if (tipoVenta == 3) {
                $txtModalCantidadMaxima.val(Global.Producto_Cantidad_Gramo);
            }

            if (tipoVenta == 1) {
                $txtModalPrecioProducto.val(Global.Producto_Precio_Mayor);
            } else if (tipoVenta == 2) {
                $txtModalPrecioProducto.val(Global.Producto_Precio);
            } else if (tipoVenta == 3) {
                $txtModalPrecioProducto.val(parseFloat(Global.Producto_Precio / Global.Producto_Cantidad_Kilo).toFixed(2));
            } else {
                $txtModalPrecioProducto.val("");
            }

            $txtModalPrecioVenta_keypress();
        }
    }

    function $txtModalPrecioVenta_keypress() {
        var PrecioProducto = parseFloat(app.UnformatNumber($txtModalPrecioProducto.val()));
        var PrecioVenta = parseFloat(app.UnformatNumber($txtModalPrecioVenta.val()));
        var Cantidad = parseInt($txtModalCantidad.val());

        if ($cboModalTipoVenta.val() == 3) {
            Cantidad = parseFloat(Cantidad / 1000)    
        }

        if (PrecioVenta > 0) {
            if (PrecioProducto >= PrecioVenta) {
                var Descuento = app.FormatNumber((PrecioProducto - PrecioVenta) * Cantidad);
                $txtModalDescuento.val(Descuento);
                var Total = app.FormatNumber(PrecioVenta * Cantidad);
                $txtModalTotal.val(Total);
            } else {
                app.Message.Info("ERROR", "El precio del producto no puede ser mayor al  de venta", null, null);
                $txtModalPrecioVenta.val("");
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

    return {
        EliminarVenta: EliminarVenta
    };


})(window.jQuery, window, document);