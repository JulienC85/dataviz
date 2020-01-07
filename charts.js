// Chargement des données
var data;

Papa.parse('https://raw.githubusercontent.com/JulienC85/dataviz/master/data_light.csv', {
  header: true,
  download: true,
  dynamicTyping: true,
  complete: function(results) {
    //console.log(results);
    data = results.data;

    let all_competences_values = [];
    let all_competences_names = []
    
    let competences_names = ["Endurance","Strength","Power","Speed","Agility","Flexibility","Nerve","Durability","Hand-Eye Coordination","Analytical Aptitude"];
    
    let nb_women = 0;
    let nb_men = 0;

    let averages_women = new Array(10).fill(0);
    let averages_men = new Array(10).fill(0);
    let averages = new Array(10).fill(0);
    console.log(data.length);
    for (let index = 0; index < data.length; index++) {
        
        const element = data[index];
        
        averages[0] = parseFloat(element.Endurance) || 0;
        averages[1] = parseFloat(element.Strength) || 0;
        averages[2] = parseFloat(element.Power) || 0;
        averages[3] = parseFloat(element.Speed) || 0;
        averages[4] = parseFloat(element.Agility) || 0;
        averages[5] = parseFloat(element.Flexibility) || 0;
        averages[6] = parseFloat(element.Nerve) || 0;
        averages[7] = parseFloat(element.Durability) || 0;
        averages[8] = parseFloat(element["Hand-Eye Coordination"]) || 0;
        averages[9] = parseFloat(element["Analytical Aptitude"]) || 0;

        if (element.Sex === "F") {
          for (let i = 0; i < averages_women.length; i++) {
            averages_women[i] += averages[i];
          }

            nb_women += 1;
        } else {
          for (let i = 0; i < averages_women.length; i++) {
            averages_men[i] += averages[i];
          }
          nb_men += 1;
        }
    }

    averages_women = averages_women.map(x => x / nb_women);
    averages_men = averages_men.map(x => x / nb_men);
    console.log(averages_women)

    console.log(averages_men)
    var trace1 = {
        x: competences_names,
        y: averages_women,
        name: 'Women',
        type: 'bar'
      };
      
      var trace2 = {
        x: competences_names,
        y: averages_men,
        name: 'Men',
        type: 'bar'
      };
      
      var data_to_print = [trace1, trace2];
      
      var layout = {
        title: 'Comparaison des caractéristiques des sports pratiqués entre les hommes et les femmes aux JO',
        barmode: 'group'
      };
      
      Plotly.newPlot('graphe_hf_caract', data_to_print, layout);

    
      
  }
});


