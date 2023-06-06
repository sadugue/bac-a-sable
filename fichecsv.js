var DateDeDébut="";
var DateDeFin="";
var Produits="";
var Active="";
var Regions="";
var Graph="";
var Chemin="";


function Clique() {
DateDeDébut = document.getElementById("start").value;
DateDeFin = document.getElementById("stop").value;
Produits = document.getElementById("Ch1").value;
Active = document.getElementById("Ch2").value;
Regions = document.getElementById("Ch3").value;
Graph = document.getElementById("Ch4").value; // Récupère la valeur sélectionnée
Chemin="Fichiers/"+Regions+"/"+Active+"/"+Produits+".csv";



      // Effectuez ici l'action souhaitée en fonction de la valeur sélectionnée
      console.log("DateDeDébut sélectionnée :", DateDeDébut);
      console.log("DateDeFin sélectionnée :", DateDeFin);
      console.log("Produits sélectionnée :", Produits);
      console.log("Graphique sélectionnée :", Active);
      console.log("Regions sélectionnée :", Regions);
      console.log("Graphique sélectionnée :", Graph);
      console.log("Chemin :", Chemin);

        // Graphique n'utilisant pas de fichier en entrée mais affiche 2 courbes.
        // Graphique utilisant fichier en entrée et affiche 2 courbes depuis csv.
        let eachyears = new Array();
        var graph = '';

        function Clique() {
            graph = document.getElementById("Ch4").value;
        }

        if (Graph === "Graphiques1" && Active === "Achats") {  // Remplissage de la valeur manquante dans la condition if
            function getYear(dateString) {
                dateString = dateString.toString();
                if (typeof dateString === 'string') {
                    var dateParts = dateString.split('-');
                    var year = dateParts[2];
                    var lastTwoDigits = year.slice(-2);
                    return lastTwoDigits;
                }
                return null; // ou une valeur par défaut si la chaîne de caractères est invalide
            }

            function getMonth(dateString) {
                dateString = dateString.toString();
                if (typeof dateString === 'string') {
                    var dateParts = dateString.split('-');
                    var year = dateParts[1];
                    var lastTwoDigits = year.slice(-2);
                    return lastTwoDigits;
                }
                return null; // ou une valeur par défaut si la chaîne de caractères est invalide
            }

            function getDay(dateString) {
                dateString = dateString.toString();
                if (typeof dateString === 'string') {
                    var dateParts = dateString.split('-');
                    var year = dateParts[0];
                    var lastTwoDigits = year.slice(-2);
                    return lastTwoDigits;
                }
                return null; // ou une valeur par défaut si la chaîne de caractères est invalide
            }

            function getUniqueYears(csvData, columnName, callback) {
                const years = new Set();
                const rows = csvData.split('\n');
                const headers = rows[0].split(',');
                const columnIndex = headers.indexOf(columnName);
                for (let i = 1; i < rows.length; i++) {
                    const rowData = rows[i].split(',');
                    const dateString = rowData[columnIndex];
                    if (dateString) {
                        const year = dateString.slice(-2);
                        years.add(year);
                    }
                }
                callback(Array.from(years));
            }

            d3.csv(Chemin, function(data) {
                nv.addGraph(function() {
                    var chart = nv.models.lineChart();
                    const csvFilePath = 'bananas-wholesale-prices_en.csv';
                    const columnName = 'ending on';
                    fetch(Chemin)
                        .then(response => response.text())
                        .then(csvData => {
                            getUniqueYears(csvData, columnName, (uniqueYears) => {
                                for (var i = 0; i < uniqueYears.length; i++) {
                                    eachyears[i] = uniqueYears[i];
                                }
      
                                function Data(key, values) {
                                    this.key = key;
                                    this.values = values;
                                }

                                var seriesKeys = Object.keys(data[0]).filter(function(key) {
                                    return key !== 'ending on' && key !== 'week';
                                });

                                var seriesData = [];
                                for (var i = 0; i < eachyears.length; i++) {
                                    for (var j = 0; j < seriesKeys.length; j++) {
                                        var countryData = data.filter(function(d) {
                                            return getYear(d['ending on']) === eachyears[i] ;
                                        });
                                        var values = countryData.map(function(d) {
                                            return { x: +d['week'], y: +d[seriesKeys[j]] };
                                        });
                                        seriesData.push({
                                            key: seriesKeys[j] + ' ' + eachyears[i],
                                            values: values
                                        });
                                    }
                                }
    
                                chart.xAxis.axisLabel('Semaines');
                                chart.yAxis.axisLabel('Prix au 100 kilos');
    
                                d3.select('#chart svg')
                                    .datum(seriesData)
                                    .transition().duration(500)
                                    .call(chart);
    
                                nv.utils.windowResize(function() {
                                    chart.update();
                                });

                                return chart;
                            });
                        });
                });
            });
        }
        }