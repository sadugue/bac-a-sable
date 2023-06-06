var DateDeDébut = "";
var DateDeFin = "";
var Produits = "";
var Active = "";
var Regions = "";
var Graph = "";
var Chemin = "";

function Clique() {
  DateDeDébut = document.getElementById("start").value;
  DateDeFin = document.getElementById("stop").value;
  Produits = document.getElementById("Ch1").value;
  Active = document.getElementById("Ch2").value;
  Regions = document.getElementById("Ch3").value;
  Graph = document.getElementById("Ch4").value; // Récupère la valeur sélectionnée
  Chemin = "Fichiers/" + Regions + "/" + Active + "/" + Produits + ".csv";

  // Effectuez ici l'action souhaitée en fonction de la valeur sélectionnée
  console.log("Date de début sélectionnée :", DateDeDébut);
  console.log("Date de fin sélectionnée :", DateDeFin);
  console.log("Produit sélectionné :", Produits);
  console.log("Graphique sélectionné :", Active);
  console.log("Régions sélectionnée :", Regions);
  console.log("Graphique sélectionné :", Graph);
  console.log("Chemin :", Chemin);

  if (Graph === "Graphiques1" && Active === "Achats") {
    function getYear(dateString) {
      dateString = dateString.toString();
      if (typeof dateString === "string") {
        var dateParts = dateString.split("-");
        var year = dateParts[2];
        var lastTwoDigits = year.slice(-2);
        return lastTwoDigits;
      }
      return null; // ou une valeur par défaut si la chaîne de caractères est invalide
    }

    function getUniqueYears(csvData, columnName, callback) {
      const years = new Set();
      const rows = csvData.split("\n");
      const headers = rows[0].split(",");
      const columnIndex = headers.indexOf(columnName);
      for (let i = 1; i < rows.length; i++) {
        const rowData = rows[i].split(",");
        const dateString = rowData[columnIndex];
        if (dateString) {
          const year = dateString.slice(-2);
          years.add(year);
        }
      }
      callback(Array.from(years));
    }

    d3.csv(Chemin, function (data) {
      nv.addGraph(function () {
        var chart = nv.models.lineChart();
        const columnName = "ending on";
        fetch(Chemin)
          .then((response) => response.text())
          .then((csvData) => {
            getUniqueYears(csvData, columnName, (uniqueYears) => {
              var seriesData = [];

              for (var i = 0; i < uniqueYears.length; i++) {
                const year = uniqueYears[i];
                var countryData = data.filter(function (d) {
                  return getYear(d["ending on"]) === year;
                });

                var values = countryData.map(function (d) {
                  return { x: +d["week"], y: +d[seriesKeys[j]] };
                });

                var nonZeroValues = values.filter(function (d) {
                  return d.y !== 0;
                });

                if (nonZeroValues.length > 0) {
                  seriesData.push({
                    key: seriesKeys[j] + " " + year,
                    values: nonZeroValues,
                  });
                }
              }

              chart.xAxis.axisLabel("Semaines");
              chart.yAxis.axisLabel("Prix au 100 kilos");

              d3.select("#chart svg").datum(seriesData).call(chart);

              nv.utils.windowResize(function () {
                chart.update();
              });
            });
          });
      });
    });
  }
}


