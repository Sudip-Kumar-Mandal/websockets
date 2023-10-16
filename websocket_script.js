const socket = new WebSocket('ws://SudipESP:81');
var event_counter = 0;
var seconds_counter = 0;
var sensor1_play_pause = true;

const ctx = document.getElementById('myChart');

const touchChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    datasets: [{
      label: '# of Votes',
      data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        min: 0,
        max: 120
      }
    },
    animation: false,
    parse: false,
    normalized: true
  }
});

function shiftChartData(chart, label, newData) {
  chart.data.labels.shift();
  chart.data.labels.push(label);
  chart.data.datasets.forEach((dataset) => {
      dataset.data.shift();
      dataset.data.push(newData);
  });
  chart.update('none');
}

socket.onopen = function(event) {
  console.log('WebSocket connection opened');
  time_passed();
  setInterval(time_passed, 1000);
};

socket.onmessage = function(event) {
  console.log(event.data);

  const data = JSON.parse(event.data);

  document.getElementById('sensorData').textContent = data.touchSensor;

  event_counter++;
  document.getElementById('eventCount').textContent = event_counter;

  document.getElementById('touchProgress').style.width = "" + (data.touchSensor / 120  * 100) + "%";

  shiftChartData(touchChart, event_counter, data.touchSensor);
};

socket.onclose = function(event) {
  console.log('WebSocket connection closed');
};

function toggleSwitch() {
  socket.send('toggle');
}

function toggle_sensor1_pause_play() {
  sensor1_play_pause = !sensor1_play_pause;
  if(sensor1_play_pause) {
    document.getElementById('sensor1_button').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 320 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>';
  }
  else {
    document.getElementById('sensor1_button').innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>';
  }
  socket.send('s1p');
}

time_passed = function() {
  document.getElementById('timePassed').textContent = seconds_counter++;
}
