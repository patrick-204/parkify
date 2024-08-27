// Client facing scripts here
$(() => {
  $('#fetch-vehicles').on('click', () => {
    $.ajax({
      method: 'GET',
      url: '/api/vehicles'
    })
    .done((response) => {
      const $vehiclesList = $('#vehicles');
      $vehiclesList.empty();

      for(const vehicle of response.vehicles) {
        $(`<li class="vehicles">`).text(vehicle.make).appendTo($vehiclesList);
      }
    });
  });
});
