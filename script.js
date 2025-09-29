// ฟอร์ม submit
    document.getElementById('registrationForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn');
        const submitText = document.getElementById('submitText');
        const loadingSpinner = document.getElementById('loadingSpinner');

        submitBtn.disabled = true;
        submitText.textContent = 'ກຳລັງສົ່ງຂໍ້ມູນ...';
        loadingSpinner.classList.remove('hidden');

        try {
            const params = new URLSearchParams();
            params.append('fullName', document.getElementById('fullName').value);
            params.append('birthDate', document.getElementById('birthDate').value);
            params.append('address', document.getElementById('address').value);
            params.append('email', document.getElementById('email').value);
            params.append('phone', document.getElementById('phone').value);
            params.append('tableType', document.getElementById('tableType').value);
            params.append('studentType', document.querySelector('input[name="studentType"]:checked').value);

            await fetch('https://script.google.com/macros/s/AKfycbxo5oxv0z0lFixNXdcltnC17bBM3Dooz1J8RgLqzTnsWzP7dkLoT0D6jRqja8Qf8p5j/exec', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString()
            });

            setTimeout(() => {
                // ใช้ SweetAlert2 แทน success div
                Swal.fire({
                    icon: 'success',
                    title: 'ລົງທະບຽນສຳເລັດ!',
                    text: 'ຂໍ້ມູນຂອງທ່ານໄດ້ຖືກບັນທຶກແລ້ວ',
                    confirmButtonColor: '#059669',
                    confirmButtonText: 'ປິດ'
                });
                document.getElementById('registrationForm').reset();
                loadData();
            }, 1000);

        } catch (error) {
            console.error('Error details:', error);
            Swal.fire({
                icon: 'error',
                title: '⚠️ ເກີດຂໍ້ຜິດພາດ',
                text: 'ກະລຸນາລອງໃໝ່ອີກຄັ້ງ',
                confirmButtonColor: '#e11d48',
                confirmButtonText: 'ປິດ'
            });
        } finally {
            setTimeout(() => {
                submitBtn.disabled = false;
                submitText.textContent = 'ລົງທະບຽນເລີນ';
                loadingSpinner.classList.add('hidden');
            }, 1500);
        }
    });

    // Phone formatting
    document.getElementById('phone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 3 && value.length <= 6) value = value.replace(/(\d{3})(\d+)/, '$1-$2');
        else if (value.length >= 7) value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
        e.target.value = value;
    });

    // ฟังก์ชันดึงข้อมูลล่าสุดจาก Google Sheet
    async function loadData() {
        try {
            const res = await fetch('https://script.google.com/macros/s/AKfycbxo5oxv0z0lFixNXdcltnC17bBM3Dooz1J8RgLqzTnsWzP7dkLoT0D6jRqja8Qf8p5j/exec');
            const data = await res.json();
            const container = document.getElementById('dataList');
            container.innerHTML = data.map(row => `
                <div class="bg-white p-4 rounded shadow mb-2">
                    <strong>${row[0]}</strong> | ${row[1]} | ${row[2]} | ${row[3]} | ${row[4]} | ${row[5]} | ${row[6]}
                </div>
            `).join('');
        } catch (err) {
            console.error('Error loading data:', err);
        }
    }

    // เรียกตอนหน้าโหลด
    loadData();