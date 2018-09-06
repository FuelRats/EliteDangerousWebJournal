/* edjGui */
edjGetdistance = {
  request(sysname) {
    const req = new XMLHttpRequest();
    // true parameter denotes asynchronous
    req.overrideMimeType('application/json');
    req.open('GET', `https://elitebgs.kodeblox.com/api/eddb/v3/bodies?name=${sysname.toString()}`, true);
    req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == '200') {
        const jsonResponse = JSON.parse(req.responseText);
        console.log(jsonResponse.docs[0].distance_to_arrival);
        edjdata.player.pos.DistanceToArrival = jsonResponse.docs[0].distance_to_arrival;
        edjGui.updateGui();
      }
    };
    req.send(null);
  },
};

