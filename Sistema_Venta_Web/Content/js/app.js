var app = (function ($, win, doc) {

    var $mainContent = $("#mainContent");
    var PathName = win.location;
    var BaseSiteUrl = baseSiteUrl;

    var DigitsNumber = 2;

    var Defaults = (function ($, w, d) {
        // Configuracion general del datatable
        var DataTableLanguage = {
            "paginate": {
                "first": '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
                "last": '<i class="fa fa-angle-double-left" aria-hidden="true"></i>',
                "next": '<i class="fa fa-angle-right" aria-hidden="true"></i>',
                "previous": '<i class="fa fa-angle-left" aria-hidden="true"></i>'
            },
            "lengthMenu": "Registros por página: _MENU_",
            "search": "Buscar:",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "emptyTable": "Sin datos",
            "zeroRecords": "No existen coindicencias",
            "info": "Mostrando _START_ al _END_ de _TOTAL_ registros",
            "infoEmpty": "Mostrando 0 al 0 registros",
            "infoFiltered": "(Filtrado de _MAX_ registros en total)",
            "select": {
                "rows": {
                    "_": "%d registros seleccionados",
                    "0": "",
                    "1": "1 registro seleccionado"
                }
            }
        };
        var DataTablePaging = false;
        var DataTableSearching = false;
        var DataTableOrdering = false;
        var DataTableSelect = {
            Single: "single",
            Multiple: 'multi'
        };
        var DataTableLengthChange = false;
        var DataTablePageLength = 20;
        var TablasPageLength = 10;
        // Configuracion general select2
        var Select2AllowClear = true;
        var Select2Style = {
            Single: "single",
            Multiple: "multiple"
        };
        // Configuraciones comunes
        var Language = "es";
        var Placeholder = {
            Id: "-1",
            Text: "Seleccionar"
        };
        // Configuracion del detepicker
        var DatePickerFormat = "dd/mm/yyyy";
        var DatePickerAutoclose = true;
        // Configuracion del modal
        var ModalKeyboard = false;
        var ModalBackdrop = "static";

        var datatableError = {
            "draw": 0,
            "recordsTotal": 0,
            "recordsFiltered": 0,
            "data": [0],
            "error": ""
        };


        return {
            DataTableLanguage: DataTableLanguage,
            DataTablePaging: DataTablePaging,
            DataTableSearching: DataTableSearching,
            DataTableOrdering: DataTableOrdering,
            DataTableSelect: DataTableSelect,
            DataTableLengthChange: DataTableLengthChange,
            DataTablePageLength: DataTablePageLength,
            Select2AllowClear: Select2AllowClear,
            Select2Style: Select2Style,
            Language: Language,
            Placeholder: Placeholder,
            DatePickerFormat: DatePickerFormat,
            DatePickerAutoclose: DatePickerAutoclose,
            ModalKeyboard: ModalKeyboard,
            ModalBackdrop: ModalBackdrop,
            datatableError: datatableError,
            TablasPageLength: TablasPageLength

        };
    })($, win, doc);

    $(Initialize);

    function Initialize() {
        // Binding de eventos
        $.fn.datepicker.defaults.autoclose = app.Defaults.DatePickerAutoclose;
        $.fn.datepicker.defaults.format = app.Defaults.DatePickerFormat;
        $.fn.datepicker.defaults.language = app.Defaults.Language;

        // Funciones iniciales
        SetActiveMenu();
        ModalDraggable();

        //Event.Select();
    }

    function SetActiveMenu() {
        // for sidebar menu entirely but not cover treeview
        $('ul.sidebar-menu a').filter(function () {
            return this.href === PathName;
        }).parent().addClass('active');

        // for treeview
        $('ul.treeview-menu a').filter(function () {
            return this.href === PathName;
        }).parentsUntil(".sidebar-menu > .treeview-menu").addClass('active menu-open');
    }

    function ModalDraggable() {
        //Para que los modales sean moviles por su cabecera.
        $('.modal-dialog').draggable({
            cursor: 'move',
            handle: '.modal-header'
        });
        $('.modal-dialog .modal-content .modal-header').css('cursor', 'move');

    }

    var Message = (function ($, w, d) {
        var $modal = $("#modalMessage");
        var $title = $("#titleModalMessage");
        var $body = $("#bodyModalMessage");
        var $btnAccept = $("#btnAcceptModalMessage");
        var $btnCancel = $("#btnCancelModalMessage");

        var DefaultsOptions = {
            Title: "Annies",
            Message: "",
            TextButtonAccept: "Aceptar",
            TextButtonCancel: "Cerrar",
            FnAfterAcceptCallback: null,
            FnAfterCancelCallback: null,
            FnCallback: null,
            Style: {
                Default: "modal fade",
                Info: "modal modal-info fade",
                Success: "modal modal-success fade",
                Confirm: "modal modal-warning fade",
                Error: "modal modal-danger fade"
            }
        };

        $(Construct);

        function Construct() {
            $btnAccept.click($btnAccept_click);
            $btnCancel.click($btnCancel_click);
            $modal.on("hidden.bs.modal", $modal_on_hidden);
        }

        function $btnAccept_click(e) {
            DefaultsOptions.FnCallback = DefaultsOptions.FnAfterAcceptCallback;
        }

        function $btnCancel_click(e) {
            DefaultsOptions.FnCallback = DefaultsOptions.FnAfterCancelCallback;
        }

        function $modal_on_hidden(e) {
            if (typeof (DefaultsOptions.FnCallback) !== "undefined" && DefaultsOptions.FnCallback !== null) {
                DefaultsOptions.FnCallback();
            }
        }

        function Default(message) {
            $modal.attr("class", DefaultsOptions.Style.Default);
            $title.text(DefaultsOptions.Title);
            $body.html(message || DefaultsOptions.Message);
            $btnAccept.show().html(DefaultsOptions.TextButtonAccept);
            $btnCancel.hide();
            DefaultsOptions.FnAfterAcceptCallback = null;
            DefaultsOptions.FnAfterCancelCallback = null;
            return $modal.modal({
                keyboard: Defaults.ModalKeyboard,
                backdrop: Defaults.ModalBackdrop
            });
        }

        function Info(title, message, textButtonAccept, fnCallback) {
            $modal.attr("class", DefaultsOptions.Style.Info);
            $title.text(title || DefaultsOptions.Title);
            $body.html(message || DefaultsOptions.Message);
            $btnAccept.show().html(textButtonAccept || DefaultsOptions.TextButtonAccept);
            $btnCancel.hide();
            DefaultsOptions.FnAfterAcceptCallback = fnCallback;
            DefaultsOptions.FnAfterCancelCallback = null;
            return $modal.modal({
                keyboard: Defaults.ModalKeyboard,
                backdrop: Defaults.ModalBackdrop
            });
        }

        function Success(title, message, textButtonAccept, fnCallback) {
            $modal.attr("class", DefaultsOptions.Style.Success);
            $title.text(title || DefaultsOptions.Title);
            $body.html(message || DefaultsOptions.Message);
            $btnAccept.show().html(textButtonAccept || DefaultsOptions.TextButtonAccept);
            $btnCancel.hide();
            DefaultsOptions.FnAfterAcceptCallback = fnCallback;
            DefaultsOptions.FnAfterCancelCallback = null;
            return $modal.modal({
                keyboard: Defaults.ModalKeyboard,
                backdrop: Defaults.ModalBackdrop
            });
        }

        function Confirm(title, message, textButtonAccept, textButtonCancel, fnAceptarCallback, fnCerrarCallback) {
            $modal.attr("class", DefaultsOptions.Style.Confirm);
            $title.text(title || DefaultsOptions.Title);
            $body.html(message || DefaultsOptions.Message);
            $btnAccept.show().html(textButtonAccept || DefaultsOptions.TextButtonAccept);
            $btnCancel.show().html(textButtonCancel || DefaultsOptions.TextButtonCancel);
            DefaultsOptions.FnAfterAcceptCallback = fnAceptarCallback;
            DefaultsOptions.FnAfterCancelCallback = fnCerrarCallback;
            return $modal.modal({
                keyboard: Defaults.ModalKeyboard,
                backdrop: Defaults.ModalBackdrop
            });
        }

        function Error(title, message, textButtonAccept, fnCallback) {
            $modal.attr("class", DefaultsOptions.Style.Error);
            $title.text(title || DefaultsOptions.Title);
            $body.html(message || DefaultsOptions.Message);
            $btnAccept.show().html(textButtonAccept || DefaultsOptions.TextButtonAccept);
            $btnCancel.hide();
            DefaultsOptions.FnAfterAcceptCallback = fnCallback;
            DefaultsOptions.FnAfterCancelCallback = null;
            return $modal.modal({
                keyboard: Defaults.ModalKeyboard,
                backdrop: Defaults.ModalBackdrop
            });
        }

        return {
            Default: Default,
            Info: Info,
            Success: Success,
            Confirm: Confirm,
            Error: Error
        };
    })($, win, doc);

    var Error = (function ($, w, d) {
        var $modal = $("#modalError");
        var $body = $("#bodyModalError");
        var defaultMessage = "Se ha producido un error inesperado al procesar su solicitud.";

        function Show(message) {
            $body.html(message || defaultMessage);
            return $modal.modal({
                keyboard: Defaults.ModalKeyboard,
                backdrop: Defaults.ModalBackdrop
            });
        }

        return {
            Show: Show
        };
    })($, win, doc);

    var Loading = (function ($, w, d) {
        var $modal = $("#modalLoading");
        var $body = $("#messageLoading");
        var defaultMessage = "Procesando, por favor espere...";

        $(Construct);

        function Construct() {
            $modal.on("show.bs.modal", $modal_on_show);
            $modal.on("hidden.bs.modal", $modal_on_hidden);
        }

        function $modal_on_show(e) {
            setTimeout(function () {
                var zi = GetHighestZIndex();
                $(".modal-backdrop").css("z-index", zi + 1);
                $modal.css("z-index", zi + 2);
            });
        }

        function $modal_on_hidden(e) {
            setTimeout(function () {
                $(".modal-backdrop").css("z-index", "");
                $modal.css("z-index", "");
            });
        }

        function Show(message) {
            $body.html(message || defaultMessage);
            return $modal.modal({
                keyboard: Defaults.ModalKeyboard,
                backdrop: Defaults.ModalBackdrop
            });
        }

        function Hide() {
            return $modal.modal("hide");
        }

        return {
            Show: Show,
            Hide: Hide
        };
    })($, win, doc);

    var cantidadLlamadas = 0;

    function CallAjax(method, url, data, fnDoneCallback, fnFailCallback, fnAlwaysCallback, messageWait) {
        try {
            var m = method || "POST";
            var u = app.BaseSiteUrl + url;
            var d = data || "";

            cantidadLlamadas++;

            if (cantidadLlamadas === 1) {
                Loading.Show(messageWait);
            }

            $.ajax({
                method: m,
                url: u,
                data: d,
                cache: false,
            }).done(function (data, textStatus, jqXhr) {
                if (data.InternalStatus === 1) {
                    if (fnDoneCallback !== null && typeof (fnDoneCallback) !== "undefined") {
                        fnDoneCallback(data);
                    }
                } else if (data.InternalStatus === 0) {
                    Message.Error("Error", data.InternalException, "Aceptar", fnFailCallback);
                }
                else {
                    $mainContent.html(data);
                }
            }).fail(function (jqXhr, textStatus, errorThrow) {
                var body = "<h3>Se ha producido un error inesperado al procesar su solicitud.</h><hr>";
                body = body + "<b>Status: </b>" + jqXhr.status + "<br/>";
                body = body + "<b>Error: </b>" + errorThrow;
                Error.Show(body);
            }).always(function (jqXhr, textStatus) {

                cantidadLlamadas--;
                if (cantidadLlamadas === 0) {
                    Loading.Hide();
                }
                if (fnAlwaysCallback !== null && typeof (fnAlwaysCallback) !== "undefined") {
                    fnAlwaysCallback();
                }
            });

        } catch (e) {
            Loading.Hide();
            var body = "<h3>Se ha producido un error inesperado al procesar su solicitud.</h3><hr>";
            body = body + "<b>Error controlado: </b>" + e.toString();
            Error.Show(body);
        }
    }

    function GetHighestZIndex() {
        var index_highest = 0;
        $("*").each(function () {
            var index_current = parseInt($(this).css("zIndex"), 10);
            if (index_current > index_highest) {
                index_highest = index_current;
            }
        });
        return index_highest;
    }

    function FillComboBox(selector, data, selectorParent, isSelected) {
        if (isSelected) {
            var item = data.Data[0];
            var obj;
            if (item.Id !== null && item.Name !== null) {
                obj = {
                    Id: "-1",
                    Name: ""
                };
                data.Data.splice(0, 0, obj);
            } else if (item.Id !== null && item.Description !== null) {
                obj = {
                    Id: "-1",
                    Description: ""
                };
                data.Data.splice(0, 0, obj);
            } else if (item.Id !== null && item.Text !== null) {
                obj = {
                    Id: "-1",
                    Text: ""
                };
                data.Data.splice(0, 0, obj);
            } else if (item.Value !== null && item.Text !== null) {
                obj = {
                    Value: "-1",
                    Text: ""
                };
                data.Data.splice(0, 0, obj);
            }
        }
        selector.empty();
        selector.select2({
            dropdownParent: selectorParent,
            language: app.Defaults.Language,
            allowClear: app.Defaults.Select2AllowClear,
            placeholder: {
                id: app.Defaults.Placeholder.Id,
                text: app.Defaults.Placeholder.Text
            },
            data: $.map(data.Data, function (obj, i) {
                if (obj.Id !== null && obj.Name !== null) {
                    return {
                        id: obj.Id,
                        text: obj.Name
                    };
                } else if (obj.Id !== null && obj.Description !== null) {
                    return {
                        id: obj.Id,
                        text: obj.Description
                    };
                } else if (obj.Value !== null && obj.Text !== null) {
                    return {
                        id: obj.Value,
                        text: obj.Text
                    };

                } else {
                    return null;
                }
            })
        });

    }

    function FillDataTable(selector, data, columns, columnsDefs, tableName, filtros, rowCallback, drawCallback, indexRow, buttons, paginacion) {

        var pageLength = !isNullUndefined(filtros) && !isNullUndefined(filtros.pageLength) ? filtros.pageLength : app.Defaults.DataTablePageLength;
        var table;
        if ($.fn.dataTable.isDataTable(tableName)) {
            table = selector.dataTable().api();
        } else {

            table = selector.dataTable({
                paging: paginacion === undefined || paginacion === null ? app.Defaults.DataTablePaging : !app.Defaults.DataTablePaging,
                searching: false,
                ordering: app.Defaults.DataTableOrdering,
                lengthChange: filtros ? app.Defaults.DataTableOrdering : !app.Defaults.DataTableOrdering,
                order: [],
                columns: columns,
                columnDefs: columnsDefs,
                language: app.Defaults.DataTableLanguage,
                rowCallback: rowCallback,
                drawCallback: drawCallback,
                pageLength: pageLength,
                dom: 'Bfrtip',
                buttons: buttons === undefined || buttons === null ? [] : buttons,
                info: false
            }).api();
        }

        table.clear();
        if (data !== null) {
            table.rows.add(data.Data);
            table.draw();
        }

        if (data !== null && indexRow !== null) {
            var rwX = table.row(indexRow).node();
            $(rwX).addClass("selected");
        }
    }

    function FillDataTableFiltros(selector, data, columns, columnsDefs, tableName, filtros, rowCallback, drawCallback, indexRow, selectColumn) {
        var table;
        if ($.fn.dataTable.isDataTable(tableName)) {
            table = selector.dataTable().api();
        } else {

            table = selector.dataTable({
                paging: !app.Defaults.DataTablePaging,
                searching: app.Defaults.DataTableSearching,
                ordering: app.Defaults.DataTableOrdering,
                lengthChange: filtros ? app.Defaults.DataTableOrdering : !app.Defaults.DataTableOrdering,
                select: {
                    style: selectColumn === undefined ? app.Defaults.DataTableSelect.Single : app.Defaults.DataTableSelect.Multiple
                },
                order: [],
                columns: columns,
                columnDefs: columnsDefs,
                language: app.Defaults.DataTableLanguage,
                rowCallback: rowCallback,
                drawCallback: drawCallback,
                pageLength: app.Defaults.DataTablePageLength
            }).api();

        }
        table.clear();
        if (data !== null) {
            table.rows.add(data.Data);
            table.draw();
        }

        if (data !== null && indexRow !== null) {
            var rwX = table.row(indexRow).node();
            $(rwX).addClass("selected");
        }
    }

    function FillDataTableAjaxPaging(selector, url, params, columns, columnDefs, filters, rowCallback, buttons) {
        var u = app.BaseSiteUrl + url;

        var searching = !isNullUndefined(filters) && !isNullUndefined(filters.searching) ? filters.searching : app.Defaults.DataTableSearching;
        var ordering = !isNullUndefined(filters) && !isNullUndefined(filters.ordering) ? filters.ordering : app.Defaults.DataTableOrdering;
        var pageLength = !isNullUndefined(filters) && !isNullUndefined(filters.pageLength) ? filters.pageLength : app.Defaults.DataTablePageLength;
        var lengthChange = !isNullUndefined(filters) && !isNullUndefined(filters.lengthChange) ? filters.lengthChange : app.Defaults.DataTableLengthChange;
        var style = !isNullUndefined(filters) && !isNullUndefined(filters.select) ? filters.select : app.Defaults.DataTableSelect.Single;
        var lenghMenu = !isNullUndefined(filters) && !isNullUndefined(filters.lengthMenu) ? filters.lengthMenu : [];

        selector.dataTable({
            "destroy": true,
            "processing": true,
            "responsive": true,
            "serverSide": true,
            "filter": false,
            "orderMulti": false,
            "paging": true,
            "searching": searching,
            "ordering": ordering,
            "pageLength": pageLength,
            "lengthChange": lengthChange,
            "lengthMenu": lenghMenu,
            "select": {
                "style": style
            },
            "language": app.Defaults.DataTableLanguage,
            "ajax":
            {
                "url": u,
                "dataType": "JSON",
                "type": "POST",
                "data": function (d) {
                    return $.extend({}, d, params);
                },
                "dataFilter": function (data) {
                    try {
                        var json = jQuery.parseJSON(data);
                        if (json.error !== "" && json.error !== undefined) {
                            var message = "<h4>Se ha producido un error inesperado al procesar su solicitud.</h4>";
                            message = message + "Descripcion del error: <br />" + json.error;
                            Error.Show(message);
                        }
                        return JSON.stringify(json);
                    } catch (e) {

                        var error = app.Defaults.datatableError.error = e;
                        $mainContent.html(data);
                        return JSON.stringify(error);
                    }
                }
            },
            "columns": columns,
            "columnDefs": columnDefs,
            "rowCallback": rowCallback,
            "dom": 'Bfrtip',
            "buttons": buttons === undefined || buttons === null ? [] : buttons

        }).api();


    }

    function isNullUndefined(value) {
        if (typeof value === "undefined" || value === null) {
            return true;
        } else {
            return false;
        }
    }


    function GetValueRowCellOfDataTable(selector, row) {
        var rows = selector.dataTable().api().rows().data().count();
        if (rows > 0) {
            var command;
            if (row !== null) {
                command = 'selector.dataTable().api().rows().data()[' + row + ']';
            } else {
                command = 'selector.dataTable().api().rows().data()';
            }
            return eval(command);
        } else {
            return null;
        }
    }

    function RedirectTo(url) {
        win.location.href = BaseSiteUrl + url;
    }

    var Event = (function ($, w, d) {

        function Disabled($control) {
            $control.prop('disabled', true);
        }

        function Enable($control) {
            $control.prop('disabled', false);
        }

        function Datepicker($control) {
            $control.datepicker({
                autoclose: true,
                format: "dd/mm/yyyy",
                maxViewMode: 0,
                todayHighlight: true
            });
        }

        function SetDateDatepicket($control) {
            $control.datepicker({
                autoclose: true,
                format: "dd/mm/yyyy",
                maxViewMode: 0,
                todayHighlight: true
            }).datepicker('setDate', new Date());

        }

        function ForceNumericOnly($control) {
            return $control.each(function () {
                $control.keydown(function (e) {
                    var key = e.charCode || e.keyCode || 0;
                    return (
                        key === 8 ||
                        key === 9 ||
                        key === 13 ||
                        key === 46 ||
                        key === 110 ||
                        key === 190 ||
                        (key >= 35 && key <= 40) ||
                        (key >= 48 && key <= 57) ||
                        (key >= 96 && key <= 105));
                });
            });
        }

        function Focus($control) {
            $control.focus();
        }

        function KeypressEnter($form, $control) {
            $form.bind('keypress', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    $control.trigger("click");
                }
            });
        }

        function ForceDecimalOnly($control) {
            $control.on("input", function (evt) {
                var self = $(this);
                self.val(self.val().replace(/[^0-9\.]/g, ''));
                if ((evt.which !== 46 || self.val().indexOf('.') !== -1) && (evt.which < 48 || evt.which > 57)) {
                    evt.preventDefault();
                }
            });
        }

        function Blur($control, tipoFormat) {
            if (tipoFormat === 'N') {
                $control.blur(function () {
                    var val = app.UnformatNumber($(this).val());
                    $(this).val(app.FormatNumber(val));
                });
            } else if (tipoFormat === 'P') {
                $control.blur(function () {
                    var val = app.UnformatNumber($(this).val());
                    $(this).val(app.FormatPorcent(val));
                });
            }

        }

        function Number($control) {
            $control.on("keypress keyup blur", function (event) {
                $(this).val($(this).val().replace(/[^\d].+/, ""));
                if ((event.which < 48 || event.which > 57)) {
                    event.preventDefault();
                }
            });

        }

        function UpperCase($control) {
            $control.on("keypress", function () {
                $control = $(this);
                setTimeout(function () {
                    $control.val($control.val().toUpperCase());
                }, 50);
            });
        }

        return {
            Disabled: Disabled,
            Enable: Enable,
            Datepicker: Datepicker,
            ForceNumericOnly: ForceNumericOnly,
            Focus: Focus,
            KeypressEnter: KeypressEnter,
            ForceDecimalOnly: ForceDecimalOnly,
            Blur: Blur,
            Number: Number,
            SetDateDatepicket: SetDateDatepicket,
            UpperCase: UpperCase
        };

    })($, win, doc);

    function ConvertDatetimeToInt(fecha, simbolo) {
        if (fecha === "") return "";

        var data = ToSplit(fecha, simbolo);
        var result = data[2] + data[1] + data[0];
        return result;
    }

    function ConvertIntToDatetime(control, valor) {
        if (valor === "") {
            control.val("");
            return "";
        }
        var data = valor.toString();

        var day = data.substr(6, 7);
        var month = data.substr(4, 2);
        var year = data.substr(0, 4);

        var date = new Date(year, month - 1, day);
        control.datepicker("setDate", date);

    }

    function ConvertIntToDatetimeDT(valor) {
        if (valor === "" || valor === "0") {
            return "";
        }
        var data = valor.toString();

        var day = data.substr(6, 7);
        var month = data.substr(4, 2);
        var year = data.substr(0, 4);
        var date = day + "/" + month + "/" + year;
        return date;
    }


    function ValidarCampo(valor, msg) {
        if (valor === "" || valor === null || valor === "0" || valor === 0 || valor === undefined || valor === "0.00"|| valor === 0.00) {
            return msg + "<br>";
        }
        return "";
    }

    function FormatNumber(data, index) {

        var dato = DigitsNumber;

        try {
            var valFormated = parseFloat(data).toFixed(dato);

            if (!isNaN(valFormated)) {
                return valFormated.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
            } else {
                return parseFloat("0").toFixed(dato);
            }
        } catch (e) {
            return parseFloat("0").toFixed(dato);
        }
    }

    function UnformatNumber(data) {

        try {
            var number = data.replace(/,/g, '');
            return number;
        } catch (e) {
            return parseFloat("0").toFixed(DigitsNumber);
        }
    }

    function ToSplit(data, simbolo) {
        if (data !== null) {
            return data.split(simbolo);
        } else {
            return null;
        }

    }

    function GetDataOfDataTable(selector, nameColumn) {
        try {
            var rows = selector.dataTable().api().rows(".selected").data().count();
            if (rows > 0) {
                var command;
                if (nameColumn !== null) {
                    command = 'selector.dataTable().api().rows(".selected").data()[0].' + nameColumn;

                } else {
                    command = 'selector.dataTable().api().rows(".selected").data()[0]';
                }
                return eval(command);
            } else {
                return null;
            }
        } catch (e) {
            return null;
        }
    }



    return {
        PathName: PathName,
        BaseSiteUrl: BaseSiteUrl,
        Defaults: Defaults,
        Message: Message,
        Error: Error,
        Loading: Loading,
        CallAjax: CallAjax,
        GetHighestZIndex: GetHighestZIndex,
        FillComboBox: FillComboBox,
        FillDataTable: FillDataTable,
        GetValueRowCellOfDataTable: GetValueRowCellOfDataTable,
        RedirectTo: RedirectTo,
        Event: Event,
        ConvertDatetimeToInt: ConvertDatetimeToInt,
        ConvertIntToDatetime: ConvertIntToDatetime,
        ValidarCampo: ValidarCampo,
        FormatNumber: FormatNumber,
        UnformatNumber: UnformatNumber,
        ToSplit: ToSplit,
        FillDataTableFiltros: FillDataTableFiltros,
        GetDataOfDataTable: GetDataOfDataTable,
        ConvertIntToDatetimeDT: ConvertIntToDatetimeDT,
        FillDataTableAjaxPaging: FillDataTableAjaxPaging
    };



})(window.jQuery, window, document);