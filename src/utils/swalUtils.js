import Swal from 'sweetalert2';

export const showLoading = () => {
  Swal.fire({
    title: 'Loading...',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeLoading = () => {
  Swal.close();
};

export const showSuccess = (message) => {
  return Swal.fire({
    title: 'Thành công',
    text: message,
    icon: 'success',
    confirmButtonText: 'OK',
  });
};

export const showError = (message) => {
  return Swal.fire({
    title: 'Lỗi',
    text: message,
    icon: 'error',
    confirmButtonText: 'Đóng',
  });
};

export const showConfirm = (message, onConfirm) => {
  Swal.fire({
    title: 'Bạn có chắc chắn?',
    text: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Đồng ý',
    cancelButtonText: 'Hủy'
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
  });
};
