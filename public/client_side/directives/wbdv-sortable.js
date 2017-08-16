(function () {
    angular
        .module("StarGazers")
        .directive("wbdvSortable", makeSortable);

    function makeSortable() {

        function linker(scope, element, attrb) {
            var start = -1;
            var end = -1;

            $(element)
                .sortable({
                    start: function(event, ui) {
                        start = ui.item.index();
                    },
                    stop: function (event, ui) {
                        end = ui.item.index();

                        if(end >= start){
                            end = end + 1;
                        }
                        scope.callback({
                            start : start,
                            end : end
                        });
                    }
                });
        }

        return {
            restrict: 'ACE',
            scope : {
                callback : '&'
            },
            link : linker
        };
    }
})();