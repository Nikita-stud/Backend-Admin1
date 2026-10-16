$('.editProductCta').click(function () {
  const productId = $(this).val();
  $('#productForm').attr('action', `/admin/products/update/${productId}`);
  $('#productLabel').text(`Update Product Id: ${productId}`);
  $('#productName').val($(this).attr('data-name'));
  $('#productBrand').val($(this).attr('data-brand'));
  $('#productCategory').val($(this).attr('data-category'));
  $('#productDescription').val($(this).attr('data-description'));
  $('#productQuantity').val($(this).attr('data-quantity'));
  $('#productUnitprice').val($(this).attr('data-unitprice'));
  $('#productImgurl').val($(this).attr('data-imgurl'));
  $('#productIsdeleted').prop('checked', $(this).attr('data-isdeleted') === 'true');
  $('#productDeletedWrapper').removeClass('d-none');
  $('#productSubmitText').text('Save changes');
  $('#productSubmit').removeClass('btn-success').addClass('btn-warning');
  $('#productSubmitIcon').html('<i class="fa-solid fa-pen-to-square"></i>');
  $('#productPopup').removeClass('d-none').addClass('d-flex');
});

$('.addProductCta').click(function () {
  $('#productForm').attr('action', '/admin/products/add');
  $('#productLabel').text('Add Product');
  $('#productForm')[0].reset();
  $('#productDeletedWrapper').addClass('d-none');
  $('#productSubmitText').text('Add Product');
  $('#productSubmit').removeClass('btn-warning').addClass('btn-success');
  $('#productSubmitIcon').html('<i class="fa-solid fa-plus"></i>');
  $('#productPopup').removeClass('d-none').addClass('d-flex');
});

$('#closeProductPopup').click(function () {
  $('#productPopup').removeClass('d-flex').addClass('d-none');
});

$('#productPopup').click(function (event) {
  if (event.target === this) {
    $(this).removeClass('d-flex').addClass('d-none');
  }
});
