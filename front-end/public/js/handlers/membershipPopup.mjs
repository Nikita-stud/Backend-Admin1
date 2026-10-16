$('.editMembershipCta').click(function () {
  const membershipId = $(this).val();
  $('#membershipForm').attr(
    'action',
    `/admin/memberships/update/${membershipId}`,
  );
  $('#membershipLabel').text(`Change discount Id: ${membershipId}`);
  $('#membershipPopup').removeClass('d-none').addClass('d-flex');
});

$('#closeMembershipPopup').click(function () {
  $('#membershipPopup').removeClass('d-flex').addClass('d-none');
});

$('#membershipPopup').click(function (event) {
  if (event.target === this) {
    $(this).removeClass('d-flex').addClass('d-none');
  }
});
