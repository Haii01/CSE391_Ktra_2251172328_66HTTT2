let borrows = JSON.parse(localStorage.getItem("borrows")) || [];
let editing = null;

const modal = document.getElementById("modal");

// ======================
// MỞ MODAL THÊM
// ======================

document.getElementById("btnAdd").onclick = function () {

    editing = null;

    document.getElementById("modalTitle").textContent =
        "Thêm Phiếu Mượn";

    document.getElementById("borrowForm").reset();

    clearErrors();

    modal.style.display = "block";
};

// ======================
// ĐÓNG MODAL
// ======================

document.getElementById("btnClose").onclick = function () {

    modal.style.display = "none";
};

// ======================
// LƯU LOCAL STORAGE
// ======================

function saveStorage() {

    localStorage.setItem(
        "borrows",
        JSON.stringify(borrows)
    );
}

function formatDate(dateString) {

    const date = new Date(dateString);

    const day = date.getDate();

    const month = date.getMonth() + 1;

    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

// ======================
// HIỂN THỊ BẢNG
// ======================

function renderTable() {

    let html = "";

    borrows.forEach((b, index) => {

        html += `
        <tr>
            <td>${b.borrowId}</td>
            <td>${b.borrower}</td>
            <td>${b.bookId}</td>
            <td>${b.category}</td>
            <td>${formatDate(b.borrowDate)}</td>
            <td>${formatDate(b.dueDate)}</td>
            <td>${b.phone}</td>
            <td>${b.email}</td>
            <td>${b.status}</td>
            <td>${b.note}</td>

            <td>
                <button class="edit"
                    onclick="editBorrow(${index})">
                    Sửa
                </button>

                <button class="delete"
                    onclick="deleteBorrow(${index})">
                    Xóa
                </button>
            </td>
        </tr>
        `;
    });

    document.getElementById("borrowTable").innerHTML = html;

    updateStats();
}

// ======================
// THỐNG KÊ
// ======================

function updateStats() {

    document.getElementById("totalBorrow").textContent =
        borrows.length;

    document.getElementById("borrowing").textContent =
        borrows.filter(
            item => item.status === "Đang mượn"
        ).length;

    document.getElementById("returned").textContent =
        borrows.filter(
            item => item.status === "Đã trả"
        ).length;
}

// ======================
// XÓA
// ======================

function deleteBorrow(index) {

    if (confirm("Bạn có chắc muốn xóa phiếu mượn này không?")) {

        borrows.splice(index, 1);

        saveStorage();

        renderTable();
    }
}

// ======================
// SỬA
// ======================

function editBorrow(index) {

    let b = borrows[index];

    editing = index;

    document.getElementById("modalTitle").textContent =
        "Cập Nhật Phiếu Mượn";

    document.getElementById("borrowId").value =
        b.borrowId;

    document.getElementById("borrower").value =
        b.borrower;

    document.getElementById("bookId").value =
        b.bookId;

    document.getElementById("category").value =
        b.category;

    document.getElementById("borrowDate").value =
        b.borrowDate;

    document.getElementById("dueDate").value =
        b.dueDate;

    document.getElementById("phone").value =
        b.phone;

    document.getElementById("email").value =
        b.email;

    document.getElementById("status").value =
        b.status;

    document.getElementById("note").value =
        b.note;

    clearErrors();

    modal.style.display = "block";
}

// ======================
// XÓA THÔNG BÁO LỖI
// ======================

function clearErrors() {

    document
        .querySelectorAll(".error")
        .forEach(error => {

            error.textContent = "";
        });
}

// ======================
// VALIDATE
// ======================

function validate() {

    clearErrors();

    let valid = true;

    const borrowId =
        document.getElementById("borrowId").value.trim();

    const borrower =
        document.getElementById("borrower").value.trim();

    const bookId =
        document.getElementById("bookId").value.trim();

    const category =
        document.getElementById("category").value;

    const borrowDate =
        document.getElementById("borrowDate").value;

    const dueDate =
        document.getElementById("dueDate").value;

    const phone =
        document.getElementById("phone").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const status =
        document.getElementById("status").value;

    const note =
        document.getElementById("note").value.trim();

    // MÃ PHIẾU

    if (borrowId === "") {

        errBorrowId.textContent =
            "Không được để trống";

        valid = false;

    } else if (!/^PM-\d{4}$/.test(borrowId)) {

        errBorrowId.textContent =
            "Mã phiếu phải có dạng PM-XXXX";

        valid = false;

    } else if (
        editing === null &&
        borrows.some(item =>
            item.borrowId === borrowId
        )
    ) {

        errBorrowId.textContent =
            "Mã phiếu đã tồn tại";

        valid = false;
    }

    // HỌ TÊN

    if (borrower === "") {

        errBorrower.textContent =
            "Không được để trống";

        valid = false;

    } else if (
        borrower.length < 2 ||
        borrower.length > 40
    ) {

        errBorrower.textContent =
            "Tên phải từ 2 đến 40 ký tự";

        valid = false;

    } else if (
        !/^[A-Za-zÀ-ỹ\s]+$/.test(borrower)
    ) {

        errBorrower.textContent =
            "Chỉ chứa chữ cái và khoảng trắng";

        valid = false;
    }

    // MÃ SÁCH

    if (bookId === "") {

        errBookId.textContent =
            "Không được để trống";

        valid = false;

    } else if (
        !/^BK\d{5}$/.test(bookId)
    ) {

        errBookId.textContent =
            "Mã sách phải có dạng BK12345";

        valid = false;
    }

    // THỂ LOẠI

    if (category === "") {

        errCategory.textContent =
            "Vui lòng chọn thể loại";

        valid = false;
    }

    // NGÀY MƯỢN

    if (borrowDate === "") {

        errBorrowDate.textContent =
            "Không được để trống";

        valid = false;

    } else {

        let today = new Date();

        today.setHours(0, 0, 0, 0);

        let borrowDay =
            new Date(borrowDate);

        if (borrowDay > today) {

            errBorrowDate.textContent =
                "Ngày mượn không được lớn hơn ngày hiện tại";

            valid = false;
        }
    }

    // HẠN TRẢ

    if (dueDate === "") {

        errDueDate.textContent =
            "Không được để trống";

        valid = false;

    } else if (borrowDate !== "") {

        let start =
            new Date(borrowDate);

        let end =
            new Date(dueDate);

        let diff =
            (end - start) /
            (1000 * 60 * 60 * 24);

        if (diff < 0) {

            errDueDate.textContent =
                "Hạn trả phải lớn hơn hoặc bằng ngày mượn";

            valid = false;

        } else if (diff > 30) {

            errDueDate.textContent =
                "Hạn trả không vượt quá 30 ngày";

            valid = false;
        }
    }

    // ĐIỆN THOẠI

    if (phone === "") {

        errPhone.textContent =
            "Không được để trống";

        valid = false;

    } else if (
        !/^(03|05|07|08|09)\d{8}$/.test(phone)
    ) {

        errPhone.textContent =
            "Số điện thoại phải gồm đúng 10 chữ số";

        valid = false;
    }

    // EMAIL

    if (email === "") {

        errEmail.textContent =
            "Không được để trống";

        valid = false;

    } else if (
        !/^[A-Za-z0-9._%+-]+@library\.vn$/.test(email)
    ) {

        errEmail.textContent =
            "Email phải kết thúc bằng @library.vn";

        valid = false;
    }

    // TRẠNG THÁI

    if (status === "") {

        errStatus.textContent =
            "Vui lòng chọn trạng thái";

        valid = false;
    }

    // GHI CHÚ

    if (note.length > 120) {

        errNote.textContent =
            "Ghi chú tối đa 120 ký tự";

        valid = false;

    } else if (
        /<\s*(script|iframe|img)/i.test(note)
    ) {

        errNote.textContent =
            "Không được chứa thẻ HTML";

        valid = false;
    }

    return valid;
}

// ======================
// SUBMIT FORM
// ======================

document
    .getElementById("borrowForm")
    .addEventListener("submit", function (e) {

        e.preventDefault();

        if (!validate()) return;

        let data = {

            borrowId:
                document.getElementById("borrowId").value.trim(),

            borrower:
                document.getElementById("borrower").value.trim(),

            bookId:
                document.getElementById("bookId").value.trim(),

            category:
                document.getElementById("category").value,

            borrowDate:
                document.getElementById("borrowDate").value,

            dueDate:
                document.getElementById("dueDate").value,

            phone:
                document.getElementById("phone").value.trim(),

            email:
                document.getElementById("email").value.trim(),

            status:
                document.getElementById("status").value,

            note:
                document.getElementById("note").value.trim()
        };

        if (editing === null) {

            borrows.push(data);

        } else {

            borrows[editing] = data;
        }

        saveStorage();

        renderTable();

        modal.style.display = "none";

        document.getElementById("borrowForm").reset();

        editing = null;
    });

// ======================
// KHỞI TẠO
// ======================

renderTable();