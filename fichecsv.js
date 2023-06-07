var DateDeDebut = "";
var DateDeFin = "";
var Produits = "";
var Active = "";
var Regions = "";
var Graph = "";
var Chemin = "";

function jour(date) {
    var j = date[8] + date[9];
    return j;
}

function mois(date) {
    var m = date[5] + date[6];
    return m;
}

function an(date) {
    var a = date[2] + date[3];
    return a;
}

function Clique() {
    DateDeDebut = document.getElementById("start").value;
    DateDeFin = document.getElementById("stop").value;
    Produits = document.getElementById("Ch1").value;
    Active = document.getElementById("Ch2").value;
    Regions = document.getElementById("Ch3").value;
    Graph = document.getElementById("Ch4").value; // Récupère la valeur sélectionnée
    Chemin = "Fichiers/" + Regions + "/" + Active + "/" + Produits + ".csv";

    // Effectuez ici l'action souhaitée en fonction de la valeur sélectionnée
    console.log("DateDeDébut sélectionnée :", DateDeDebut);
    console.log("DateDeFin sélectionnée :", DateDeFin);
    console.log("Produits sélectionnée :", Produits);
    console.log("Graphique sélectionnée :", Active);
    console.log("Regions sélectionnée :", Regions);
    console.log("Graphique sélectionnée :", Graph);
    console.log("Chemin :", Chemin);

    // Graphique n'utilisant pas de fichier en entrée mais affiche 2 courbes.
    // Graphique utilisant fichier en entrée et affiche 2 courbes depuis csv.
    var eachyears = new Array();
    //var graph = '';

    if (Graph === "Graphiques1" && Active === "Achats") {  
        function getYear(dateString) {
            dateString = dateString.toString(); //"05-01-14"
            var y = dateString[6] + dateString[7];
            console.log(y);
            return y;
        }

        function getMonth(dateString) {
            dateString = dateString.toString();
            var m = dateString[3] + dateString[4];
            console.log(m);
            return m;
        }

        function getDay(dateString) {
            dateString = dateString.toString();
            var d = dateString[0] + dateString[1];
            console.log(d);
            return d;
        }

        function getUniqueYears(csvData, columnName, callback) {
            const years = new Set();
            const rows = csvData.split('\n');
            const headers = rows[0].split(',');
            const columnIndex = headers.indexOf(columnName);
            for (let i = 1; i < rows.length; i++) {
                const rowData = rows[i].split(',');
                if (rowData[columnIndex] !== "") {
                    const dateString = rowData[columnIndex];
                    if (dateString && compriseAn(DateDeDebut, dateString, DateDeFin)) {
                        const year = getYear(dateString);
                        years.add(year);
                    }
                }
            }
            callback(Array.from(years));
        }

        function compriseAn(DateDeDebut, date, DateDeFin) {
            return an(DateDeDebut) <= getYear(date) && getYear(date) <= an(DateDeFin);
        }

        function comprise(datedeb, date, datefin) {
            if (
                parseInt(an(datedeb), 10) <= parseInt(getYear(date), 10) &&
                parseInt(getYear(date), 10) <= parseInt(an(datefin), 10)
            ) {
                if (
                    parseInt(mois(datedeb), 10) <= parseInt(getMonth(date), 10) &&
                    parseInt(getMonth(date), 10) <= parseInt(mois(datefin), 10)
                ) {
                    if (
                        parseInt(jour(datedeb), 10) <= parseInt(getDay(date), 10) &&
                        parseInt(getDay(date), 10) <= parseInt(jour(datefin), 10)
                    ) {
                        return true;
                    }
                    return false;
                }
                return false;
            }
            return false;
        }

        d3.csv(Chemin, function (data) {
            nv.addGraph(function () {
                var chart = nv.models.lineChart();
                const columnName = 'ending on';
                fetch(Chemin)
                    .then(response => response.text())
                    .then(csvData => {
                        getUniqueYears(csvData, columnName, (uniqueYears) => {
                            for (var i = 0; i < uniqueYears.length; i++) {
                                eachyears[i] = uniqueYears[i];
                            }

                            var seriesKeys = Object.keys(data[0]).filter(function (key) {
                                return key !== 'ending on' && key !== 'week' && key !== '' && key !== null;
                            });

                            var seriesData = [];
                            for (var i = 0; i < eachyears.length; i++) {
                                for (var j = 0; j < seriesKeys.length; j++) {
                                    var countryData = data.filter(function (d) {
                                        return getYear(d['ending on']) === eachyears[i] /*&& comprise(DateDeDebut,d['ending on'],DateDeFin)*/;
                                    });
                                    var values = countryData.map(function (d) {
                                        //if(comprise(DateDeDebut,d['ending on']),DateDeFin)&&(+d[seriesKeys[j]]!==0)){
                                        return { x: +d['week'], y: +d[seriesKeys[j]] };
                                        //}
                                    });
                                    values = values.filter(function (value) {
                                        return value.y !== 0;
                                    });
                                    if(values!==[]){
                                        seriesData.push({
                                            key: seriesKeys[j] + ' ' + eachyears[i],
                                            values: values
                                        });
                                    }
                                }
                            }

                            chart.xAxis.axisLabel('Semaines');
                            chart.yAxis.axisLabel('Prix au 100 kilos');


                            d3.select('#chart svg')
                                .datum(seriesData)
                                .transition().duration(600)
                                .call(chart);


                            nv.utils.windowResize(function () {
                                chart.update();
                            });
                            return chart;
                        });
                    });
            });
        });
    }
    else if (Graph === "Graphiques2" && Active === "Achats"){
        //moyenne pour chaque année
        function getYear(dateString) {
            dateString = dateString.toString(); //"05-01-14"
            var y = dateString[6] + dateString[7];
            console.log(y);
            return y;
        }

        function getMonth(dateString) {
            dateString = dateString.toString();
            var m = dateString[3] + dateString[4];
            console.log(m);
            return m;
        }

        function getDay(dateString) {
            dateString = dateString.toString();
            var d = dateString[0] + dateString[1];
            console.log(d);
            return d;
        }

        function getUniqueYears(csvData, columnName, callback) {
            const years = new Set();
            const rows = csvData.split('\n');
            const headers = rows[0].split(',');
            const columnIndex = headers.indexOf(columnName);
            for (let i = 1; i < rows.length; i++) {
                const rowData = rows[i].split(',');
                if (rowData[columnIndex] !== "") {
                    const dateString = rowData[columnIndex];
                    if (dateString && compriseAn(DateDeDebut, dateString, DateDeFin)) {
                        const year = getYear(dateString);
                        years.add(year);
                    }
                }
            }
            callback(Array.from(years));
        }

        function compriseAn(DateDeDebut, date, DateDeFin) {
            return an(DateDeDebut) <= getYear(date) && getYear(date) <= an(DateDeFin);
        }

        function comprise(datedeb, date, datefin) {
            if (
                parseInt(an(datedeb), 10) <= parseInt(getYear(date), 10) &&
                parseInt(getYear(date), 10) <= parseInt(an(datefin), 10)
            ) {
                if (
                    parseInt(mois(datedeb), 10) <= parseInt(getMonth(date), 10) &&
                    parseInt(getMonth(date), 10) <= parseInt(mois(datefin), 10)
                ) {
                    if (
                        parseInt(jour(datedeb), 10) <= parseInt(getDay(date), 10) &&
                        parseInt(getDay(date), 10) <= parseInt(jour(datefin), 10)
                    ) {
                        return true;
                    }
                    return false;
                }
                return false;
            }
            return false;
        }

        d3.csv(Chemin, function (data) {
            nv.addGraph(function () {
              var chart = nv.models.lineChart();
              const columnName = 'ending on';
              fetch(Chemin)
                .then(response => response.text())
                .then(csvData => {
                  getUniqueYears(csvData, columnName, (uniqueYears) => {
                    for (var i = 0; i < uniqueYears.length; i++) {
                        eachyears[i] = uniqueYears[i];
                    }

                    var seriesKeys = Object.keys(data[0]).filter(function (key) {
                        return key !== 'ending on' && key !== 'week' && key !== '' && key !== null;
                    });
                    var seriesData = [];
                    uniqueYears.forEach(year => {
                      var yearData = data.filter(d => getYear(d['ending on']) === year && comprise(DateDeDebut, d['ending on'], DateDeFin));
                      var values = yearData.map(d => ({ x: year, y: +d[seriesKeys[0]] }));
                      values = values.filter(value => value.y !== 0);
                      seriesData.push({
                        key: year,
                        values: values
                      });
                    });
      
                    chart.xAxis.axisLabel('Année');
                    chart.yAxis.axisLabel('Prix au 100 kilos');
      
                    d3.select('#chart svg')
                      .datum(seriesData)
                      .transition().duration(600)
                      .call(chart);
      
                    nv.utils.windowResize(function () {
                      chart.update();
                    });
                    return chart;
                  });
                });
            });
          });
    }
    
    else if (Graph === "Graphiques3" && Active === "Achats"){
        //valeur max pour chaque année
    }
}

