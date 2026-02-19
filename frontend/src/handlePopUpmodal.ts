 export const handleModalPopUp = (elemId: string) => {
  const modalElement = document.getElementById(elemId);

  if (modalElement && window.bootstrap) {
    const modalInstance =
      window.bootstrap.Modal.getOrCreateInstance(modalElement);
    modalInstance.hide();
  }
};
