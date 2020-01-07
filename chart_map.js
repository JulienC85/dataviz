Plotly.d3.csv('https://julienc85.github.io/dataviz/sport_map.csv', function(err, rows){
      function unpack(rows, key) {
          return rows.map(function(row) { return row[key]; });
      }

    var data = [{
        type: 'scattergeo',
        locationmode: 'ISO-3',
        locations: unpack(rows, 'NOC'),
        z: unpack(rows, 'Sport Category'),
        text: unpack(rows, 'Team'),
        hoverinfor:  unpack(rows, 'Sport Category'),
        text:  unpack(rows, 'Sport Category'),
        marker: {
            size: 10,
            color: unpack(rows,'Id_Sport')
        },
    }];

    var layout = {
      title: 'Carte  des sports les plus représentés par pays',
      geo: {
          projection: {
              type: 'natural earth'
          }
      }
    };
    Plotly.plot("map", data, layout, {showLink: false});

});