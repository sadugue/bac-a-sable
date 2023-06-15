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

    var div = document.getElementById('hidden1').style.visibility='hidden';
    var div2 = document.getElementById('chart').style.visibility='visible';
    var div3 = document.getElementById('hidden2').style.visibility='hidden';

    var eachyears = new Array();
    //var graph = '';
    if(Produits === ""||Active === ""||Regions === ""||Graph === ""||Chemin === ""){
        div = document.getElementById('hidden1').style.visibility='visible';
        div2=document.getElementById('chart').style.visibility='hidden';
    }
    else if (Graph === "Graphiques1" && Active === "Achats") {  
        if(an(DateDeDebut)!==an(DateDeFin)){
          div3 = document.getElementById('hidden2').style.visibility='visible';
          div2 = document.getElementById('chart').style.visibility='hidden';
        }
        else{
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
                                        if (comprise(DateDeDebut, d['ending on'], DateDeFin) && (+d[seriesKeys[j]] !== 0)) {
                                            return { x: +d['week'], y: +d[seriesKeys[j]] };
                                        }
                                    });
                                    values = values.filter(function (value) {
                                        return value !== undefined;
                                    });
                                    if (values.length > 0) {
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
    }
    else if (Graph === "Graphiques2" && Active === "Achats"){
        //moyenne pour chaque année
        function getYear(dateString) {
            dateString = dateString.toString(); 
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
            const countries = new Set();
            const rows = csvData.split('\n');
            const headers = rows[0].split(',');
            const columnIndex = headers.indexOf(columnName);
            const paysIndex = headers.indexOf('country');
            for (let i = 1; i < rows.length; i++) {
              const rowData = rows[i].split(',');
              if (rowData[columnIndex] !== "") {
                const dateString = rowData[columnIndex];
                if (dateString && compriseAn(DateDeDebut, dateString, DateDeFin)) {
                  const year = getYear(dateString);
                  years.add(year);
                  const country = rowData[paysIndex];
                  countries.add(country);
                }
              }
            }
            callback(Array.from(years), Array.from(countries));
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
          d3.csv(Chemin, function(data) {
            nv.addGraph(function() {
              var chart = nv.models.lineChart();
              const columnName = 'ending on';
          
              fetch(Chemin)
                .then(response => response.text())
                .then(csvData => {
                  var paysMoyennes = new Map();
                  const rows = csvData.split('\n');
                  var countries = rows[0].split(',').filter(elt => elt !== "");
                  countries.splice(0, 2)
          
                  for (let i = 1; i < rows.length - 1; i++) {
                    values = rows[i].split(',');
                    const year = values[1].substring(6, 8);
          
                    if (compriseAn(DateDeDebut, values[1], DateDeFin)) {
                      for (let j = 2; j < countries.length + 2; j++) {
                        const country = countries[j - 2];
                        const value = +values[j];
          
                        if (value !== 0) {
                          if (!paysMoyennes.has(country)) {
                            paysMoyennes.set(country, new Map());
                          }
          
                          var yearData = paysMoyennes.get(country);
                          if (!yearData.has(year)) {
                            yearData.set(year, { total: 0, count: 0 });
                          }
          
                          var yearDataItem = yearData.get(year);
                          yearDataItem.total += value;
                          yearDataItem.count++;
                        }
                      }
                    }
                  }
          
                  var seriesData = [];
          
                  for (const [country, yearData] of paysMoyennes) {
                    var data = [];
                    for (const [year, yearDataItem] of yearData) {
                      var average = yearDataItem.total / yearDataItem.count;
                      data.push({ x: "20" + year, y: average });
                    }
                    seriesData.push({
                      values: data,
                      key: country,
                      color: getRandomColor() // Génère une couleur aléatoire pour chaque pays
                    });
                  }
          
                  chart.xAxis.axisLabel('Années');
                  chart.yAxis.axisLabel('Moyenne du Prix au 100 kilos');
          
                  d3.select('#chart svg')
                    .datum(seriesData)
                    .transition().duration(600)
                    .call(chart);
          
                  nv.utils.windowResize(function() {
                    chart.update();
                  });
                });
          
              return chart;
            });
          });
          
          function compriseAn(DateDeDebut, date, DateDeFin) {
            return parseInt(an(DateDeDebut), 10) <= parseInt(getYear(date), 10) && parseInt(getYear(date), 10) <= parseInt(an(DateDeFin), 10);
          }
          
          function an(date) {
            var a = date[2] + date[3];
            return a;
          }
          
          function getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
              color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
          }
          
        
        
         

        }
    else if (Graph === "Graphiques3" && Active === "Achats"){
        //valeur max pour chaque année

        d3.csv(Chemin, function(data) {
          nv.addGraph(function() {
            var chart = nv.models.lineChart();
            const columnName = 'ending on';
        
            fetch(Chemin)
              .then(response => response.text())
              .then(csvData => {
                var listeAnnee = new Map();
                const rows = csvData.split('\n');
                var countries = rows[0].split(',').filter(elt => elt !== "");
                countries.splice(0, 2)
        
                for (let i = 1; i < rows.length - 1; i++) {
                  values = rows[i].split(',');
                  const year = values[1].substring(6, 8);
        
                  if (compriseAn(DateDeDebut, values[1], DateDeFin)) {
                    if (!listeAnnee.has(year)) {
                      listeAnnee.set(year, { paysMax: "", valMax: 0, paysMin: "", valMin: 1000 });
                    }
        
                    objMaxMin = listeAnnee.get(year);
        
                    for (let j = 2; j < countries.length + 2; j++) {
                      if (objMaxMin.valMax < +values[j]) {
                        listeAnnee.set(year, {
                          paysMax: countries[j - 2],
                          valMax: +values[j],
                          paysMin: objMaxMin.paysMin,
                          valMin: objMaxMin.valMin
                        });
                      } else if (+values[j] < objMaxMin.valMin && +values[j] !== 0) {
                        listeAnnee.set(year, {
                          paysMax: objMaxMin.paysMax,
                          valMax: objMaxMin.valMax,
                          paysMin: countries[j - 2],
                          valMin: +values[j]
                        });
                      }
                    }
                  }
                }
        
                var min = [];
                var max = [];
        
                for (const [key, value] of listeAnnee) {
                  min.push({ x: "20" + key, y: value.valMin });
                  max.push({ x: "20" + key, y: value.valMax });
                }
        
                var seriesData = [
                  {
                    values: max,
                    key: 'Prix Max',
                    color: '#ff7f0e'
                  },
                  {
                    values: min,
                    key: 'Prix Min',
                    color: '#2ca02c'
                  }
                ];
        
                chart.xAxis.axisLabel('Années');
                chart.yAxis.axisLabel('Prix au 100 kilos');
        
                d3.select('#chart svg')
                  .datum(seriesData)
                  .transition().duration(600)
                  .call(chart);
        
                nv.utils.windowResize(function() {
                  chart.update();
                });
              });
        
            return chart;
          });
        });
        
        function an(date) {
          var a = date[2] + date[3];
          return a;
        }

        function compriseAn(DateDeDebut, date, DateDeFin) {
          return (
            parseInt(an(DateDeDebut), 10) <= parseInt(getYear(date), 10) &&
            parseInt(getYear(date), 10) <= parseInt(an(DateDeFin), 10)
          );
        }
        
        function getYear(dateString) {
          dateString = dateString.toString();
          var y = dateString[6] + dateString[7];
          return y;
        }
        
        function getRandomColor() {
          var letters = '0123456789ABCDEF';
          var color = '#';
          for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
        }
        
    }
}

