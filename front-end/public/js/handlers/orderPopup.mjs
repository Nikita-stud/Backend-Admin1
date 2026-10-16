$('.editOrderCta').click(function () {
  const orderId = $(this).val();
  $('#orderForm').attr('action', `/admin/orders/update/${orderId}`);
  $('#orderLabel').text(`Change status Id: ${orderId}`);
  $('#orderPopup').removeClass('d-none').addClass('d-flex');
});

$('#closeOrderPopup').click(function () {
  $('#orderPopup').removeClass('d-flex').addClass('d-none');
});

$('#orderPopup').click(function (event) {
  if (event.target === this) {
    $(this).removeClass('d-flex').addClass('d-none');
  }
});
