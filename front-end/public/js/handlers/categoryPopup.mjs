$('.editCategoryCta').click(function () {
  const categoryId = $(this).val();
  $('#categoryForm').attr('action', `/admin/categories/update/${categoryId}`);
  $('#categoryLabel').text(`Rename Id: ${categoryId}`);
  $('#categoryPopup').removeClass('d-none').addClass('d-flex');
});

$('#closeCategoryPopup').click(function () {
  $('#categoryPopup').removeClass('d-flex').addClass('d-none');
});

$('#categoryPopup').click(function (event) {
  if (event.target === this) {
    $(this).removeClass('d-flex').addClass('d-none');
  }
});
