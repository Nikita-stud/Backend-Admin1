$('.editBrandCta').click(function () {
  const brandId = $(this).val();
  $('#brandForm').attr('action', `/admin/brands/update/${brandId}`);
  $('#brandLabel').text(`Rename Id: ${brandId}`);
  $('#brandPopup').removeClass('d-none').addClass('d-flex');
});

$('#closeBrandPopup').click(function () {
  $('#brandPopup').removeClass('d-flex').addClass('d-none');
});

$('#brandPopup').click(function (event) {
  if (event.target === this) {
    $(this).removeClass('d-flex').addClass('d-none');
  }
});
