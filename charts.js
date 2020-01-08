var data_caract_h_f;
var data_sport_h_f;
var slider = document.getElementById('slider');
var limites_dates = [1890,2020]

noUiSlider.create(slider, {
  start: limites_dates,
  // Display colored bars between handles
  connect: true,

  // Move handle on tap, bars are draggable
  behaviour: 'tap-drag',
  tooltips: true,
  format: {
    from: function(value) {
            return parseInt(value);
        },
    to: function(value) {
            return parseInt(value);
        }
    },
  range: {
      'min': limites_dates[0],
      'max': limites_dates[1]
  }
});



function init_chart(url, chart_function) {
  Papa.parse(url, {
    header: true,
    download: true,
    dynamicTyping: true,
    complete: function (results) {
      chart_function(results.data);
    }
  });
}

function load_chart_caract_hf(data) {

  data_caract_h_f = data;

  let competences_names = ["Endurance", "Strength", "Power", "Speed", "Agility", "Flexibility", "Nerve", "Durability", "Hand-Eye Coordination", "Analytical Aptitude"];

  let averages_women = { "Endurance": 0, "Strength": 0, "Power": 0, "Speed": 0, "Agility": 0, "Flexibility": 0, "Nerve": 0, "Durability": 0, "Hand-Eye Coordination": 0, "Analytical Aptitude": 0, "Nombre d'enregistrements": 0 };
  let averages_men = { "Endurance": 0, "Strength": 0, "Power": 0, "Speed": 0, "Agility": 0, "Flexibility": 0, "Nerve": 0, "Durability": 0, "Hand-Eye Coordination": 0, "Analytical Aptitude": 0, "Nombre d'enregistrements": 0 };

  let dates = [parseInt(slider.noUiSlider.get()[0]), parseInt(slider.noUiSlider.get()[1])];

  for (let index = 0; index < data.length; index++) {

    const element = data[index];

    if(element["Year (classe)"] > dates[1] || element["Year (classe)"] < dates[0]){
      console.log("reset");
      continue;
    }


    if (element.Sex === "F") {
      averages_women[element["Noms de mesures"]] += element["Valeurs de mesures"];
    } else {
      averages_men[element["Noms de mesures"]] += element["Valeurs de mesures"];
    }
  }

  let nb_women = averages_women["Nombre d'enregistrements"];
  let nb_men = averages_men["Nombre d'enregistrements"];

  competences_names = competences_names.filter(item => item !== "Nombre d'enregistrements")

  let averages_women_array = [];
  let averages_men_array = [];

  competences_names.forEach(element => {
    averages_women[element] /= nb_women;
    averages_men[element] /= nb_men;
    averages_women_array.push(averages_women[element]);
    averages_men_array.push(averages_men[element]);
  });

  var trace1 = {
    x: competences_names,
    y: averages_women_array,
    name: 'Women',
    type: 'bar',
    marker: {
      color: ' #B07AA1'
    }
  };

  var trace2 = {
    x: competences_names,
    y: averages_men_array,
    name: 'Men',
    type: 'bar',
    marker: {
      color: ' #4E79A7'
    }
  };

  var data_to_print = [trace1, trace2];

  var layout = {
    title: 'Comparaison des caractéristiques des sports pratiqués entre les hommes et les femmes aux JO',
    barmode: 'group'
  };

  Plotly.newPlot('graphe_hf_caract', data_to_print, layout);
}

function load_chart_sport_hf(data) {

  data_sport_h_f = data;

  let sports_names = [];

  let nb_women = {};
  let nb_men = {};
  let dates = [parseInt(slider.noUiSlider.get()[0]), parseInt(slider.noUiSlider.get()[1])];

  let max_nb_participations = 0; 

  for (let index = 0; index < data.length; index++) {

    const element = data[index];
    
    if(element["Year (classe)"] > dates[1] || element["Year (classe)"] < dates[0]){
      continue;
    }

    if (element.Sex === "F") {
      if (element.Sport in nb_women) {
        nb_women[element.Sport] += element.Nb;
      }
      else {
        nb_women[element.Sport] = element.Nb;
        if (sports_names.indexOf(element.Sport) == -1) {
          sports_names.push(element.Sport);
        }
      }
    } else {
      if (element.Sport in nb_men) {
        nb_men[element.Sport] += element.Nb;
      }
      else {
        nb_men[element.Sport] = element.Nb;
        if (sports_names.indexOf(element.Sport) == -1) {
          sports_names.push(element.Sport);
        }
      }
    }
  }

  let nb_women_array = [];
  let nb_women_array_reverse = [];
  let nb_men_array = [];


  sports_names.forEach(element => {
    nb_women_array.push(nb_women[element] || 0);
    nb_women_array_reverse.push(-nb_women[element] || 0);

    nb_men_array.push(nb_men[element] || 0);

    if(nb_women[element] > max_nb_participations){
      max_nb_participations = nb_women[element];
    }
    if(nb_men[element] > max_nb_participations){
      max_nb_participations = nb_men[element];
    }

  });

  trace1 = {
    name: 'Men',
    type: 'bar',
    x: nb_men_array,
    y: sports_names,
    marker: { color: '#4E79A7' },
    hoverinfo: 'x',
    orientation: 'h'
  };
  trace2 = {
    name: 'Women',
    type: 'bar',
    x: nb_women_array_reverse,
    y: sports_names,
    marker: { color: '#B07AA1' },
    text: nb_women_array,
    hoverinfo: 'text',
    orientation: 'h'
  };
  let data_to_print = [trace1, trace2];
  let layout = {
    xaxis: {
      type: 'linear',
      title: { text: 'Number of people' },
    },
    yaxis: {
      title: { text: 'Sports' },
    },
    bargap: 0.1,
    barmode: 'relative',
    autosize: true,
    height: 1500,
    margin: {
      l: 200,
      r: 50,
      b: 100,
      t: 100,
      pad: 4
    },
    title: 'Comparaison du nombre de participations des femmes et des hommes aux différents sports'
  };


  Plotly.newPlot('graphe_hf_sport', data_to_print, layout);

}


function load_chart_caract_age(data) {



  let data_to_print = [];

  let ages = [];

  let caracteristics_by_age = {};

  for (let index = 0; index < data.length; index++) {

    const element = data[index];

    ages.push(element.Age);

    Object.keys(element).forEach(key => {
      if (key in caracteristics_by_age) {
        caracteristics_by_age[key].push(element[key]);
      }
      else {
        caracteristics_by_age[key] = [element[key]];
      }
    });

  }

  delete caracteristics_by_age["Age"];

  Object.keys(caracteristics_by_age).forEach(key => {
    data_to_print.push({
      x: ages,
      y: caracteristics_by_age[key],
      mode: 'lines',
      name: key
    });
  });


  var layout = {
    title: 'Comparaison des caractéristiques des sports pratiqués selon l\'âge des athlètes aux JO',
  };

  Plotly.newPlot('graphe_age_caract', data_to_print, layout);

}


function load_map() {
  Plotly.d3.csv('https://julienc85.github.io/dataviz/data/sport_map.csv', function (err, rows) {

    function unpack(rows, key) {
      return rows.map(function (row) { return row[key]; });
    }

    let data = [{
      type: 'scattergeo',
      locationmode: 'ISO-3',
      locations: unpack(rows, 'NOC'),
      z: unpack(rows, 'Sport Category'),
      text: unpack(rows, 'Team'),
      hoverinfor: unpack(rows, 'Sport Category'),
      text: unpack(rows, 'Sport Category'),
      marker: {
        size: 12,
        color: unpack(rows, 'Id_Sport')
      },
    }];

    let layout = {
      title: 'Carte  des sports les plus représentés par pays',
      geo: {
        projection: {
          type: 'Equirectangular'
        },
        showcountries: true
      },
    };
    Plotly.plot("map", data, layout, { showLink: false });

  });
}

function updateCharts(values, handle, unencoded, tap, positions) {
  load_chart_caract_hf(data_caract_h_f);
  load_chart_sport_hf(data_sport_h_f);
}

// Binding signature
slider.noUiSlider.on('change', updateCharts);

init_chart('https://julienc85.github.io/dataviz/data/data_comparaison_caract_h_f.csv', load_chart_caract_hf);
init_chart('https://julienc85.github.io/dataviz/data/data_comparaison_sports_h_f.csv', load_chart_sport_hf);
//init_chart('https://julienc85.github.io/dataviz/data/data_comparaison_caract_age.csv', load_chart_caract_age);

//load_map();

